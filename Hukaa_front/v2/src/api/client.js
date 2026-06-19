// src/api/client.js
import { API_BASE_URL } from './api-config';
import { toast } from 'react-hot-toast';

// ─────────────────────────────────────────────
// Token Store
// Centralizes all token operations.
// ─────────────────────────────────────────────
const TokenStore = {
    getAccessToken: () => localStorage.getItem('token'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setTokens: (access, refresh) => {
        localStorage.setItem('token', access);
        if (refresh) localStorage.setItem('refreshToken', refresh);
    },
    clearTokens: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },
};

// ─────────────────────────────────────────────
// Auth helpers
// ─────────────────────────────────────────────
const redirectToLogin = () => {
    const currentPath = window.location.pathname + window.location.search;

    if (window.location.pathname.includes('/auth/login')) return;

    TokenStore.clearTokens();
    window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
};

// ─────────────────────────────────────────────
// Refresh Queue
// Enqueue parallel requests while token is refreshing.
// Resolve all requests at once after refresh completes.
// ─────────────────────────────────────────────
const RefreshQueue = (() => {
    let _isRefreshing = false;
    let _queue = [];           // Array<{ resolve, reject }>

    return {
        get isRefreshing() { return _isRefreshing; },

        /**
         * Starts the refresh process. The caller awaits refreshFn,
         * which must return a new access token. If successful,
         * the queue is resolved with the new token; otherwise, it's rejected with an error.
         */
        async run(refreshFn) {
            _isRefreshing = true;
            try {
                const newToken = await refreshFn();
                _queue.forEach(({ resolve }) => resolve(newToken));
                return newToken;
            } catch (err) {
                _queue.forEach(({ reject }) => reject(err));
                throw err;
            } finally {
                _queue = [];
                _isRefreshing = false;
            }
        },

        /**
         * Requests arriving while refresh is in progress wait on this Promise.
         * `run` resolves or rejects the queue once done.
         */
        waitForToken() {
            return new Promise((resolve, reject) => {
                _queue.push({ resolve, reject });
            });
        },
    };
})();

// ─────────────────────────────────────────────
// Token Refresh
// ─────────────────────────────────────────────

/**
 * Gets a new access token from the backend.
 * Returns a new token string on success, otherwise throws an exception.
 */
const executeTokenRefresh = async () => {
    const refreshToken = TokenStore.getRefreshToken();
    if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('REFRESH_FAILED');

    const result = await response.json();

    // Check API Success flag if it's formatted as standard API response
    const success = result.Success ?? result.success ?? true;
    if (!success) {
        throw new Error('REFRESH_FAILED');
    }

    // Robust extractor supporting root, Data, and tokens nesting (camelCase and PascalCase)
    const rootData = result.Data ?? result.data ?? result;
    const tokensObj = rootData.tokens ?? rootData.Tokens ?? rootData;

    const accessTokenObj = tokensObj.accessToken ?? tokensObj.AccessToken;
    const refreshTokenObj = tokensObj.refreshToken ?? tokensObj.RefreshToken;

    const newAccessToken  = accessTokenObj?.accessToken ?? accessTokenObj?.AccessToken;
    const newRefreshToken = refreshTokenObj?.refreshToken ?? refreshTokenObj?.RefreshToken;

    if (!newAccessToken) throw new Error('INVALID_TOKEN_RESPONSE');

    TokenStore.setTokens(newAccessToken, newRefreshToken);
    return newAccessToken;
};

// ─────────────────────────────────────────────
// Response Handler
// ─────────────────────────────────────────────

/**
 * Converts fetch response into a standard result object.
 * We do not handle 401 status here — that's fetchClient's job.
 */
const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') ?? '';
    const hasJson     = contentType.includes('application/json');

    if (response.status === 204 || !hasJson) {
        return { Success: response.ok, StatusCode: response.status, Data: null };
    }

    let body;
    try {
        body = await response.json();
    } catch {
        return {
            Success:    false,
            StatusCode: response.status,
            Message:    'Server response is not in JSON format.',
            Errors:     [],
        };
    }

    if (!response.ok) {
        const message = body?.Message ?? body?.message ?? 'An error occurred during the request.';
        toast.error(message);
        return {
            Success:    false,
            StatusCode: response.status,
            Message:    message,
            Errors:     body?.Errors ?? body?.errors ?? [],
            Data:       body?.Data   ?? body?.data   ?? null,
        };
    }

    return body;
};

// ─────────────────────────────────────────────
// Build Headers
// ─────────────────────────────────────────────
const buildHeaders = (token, options = {}) => {
    const headers = {
        Accept: 'application/json',
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

// ─────────────────────────────────────────────
// Public Endpoints
// We don't try to refresh tokens for endpoints like Login.
// ─────────────────────────────────────────────
const PUBLIC_ENDPOINTS = [
    '/api/auth/login',
    '/api/auth/refresh-token',
    '/api/auth/register',
    '/api/auth/login/2fa',
    '/api/auth/login/recovery',
];

const isPublicEndpoint = (endpoint) =>
    PUBLIC_ENDPOINTS.some(pub => endpoint.toLowerCase().startsWith(pub.toLowerCase()));

// ─────────────────────────────────────────────
// fetchClient
// ─────────────────────────────────────────────

/**
 * Centralized fetch wrapper for all API requests.
*
* Flow:
*   1. Send request
*   2. If 401 comes and endpoint is not public:
*       a. Another refresh is in progress — queue, wait for token
*       b. Nobody is refreshing — start refresh
*   3. Retry original request once with new token
*   4. If refresh fails — logout + redirect
 */
export const fetchClient = async (endpoint, options = {}) => {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url                = `${API_BASE_URL}${normalizedEndpoint}`;

    const performRequest = async (accessToken) => {
        const headers = buildHeaders(accessToken, options);
        return fetch(url, { ...options, headers });
    };

    try {
        // ── First attempt ─
        const firstResponse = await performRequest(TokenStore.getAccessToken());

        // If not 401, return normal response
        if (firstResponse.status !== 401 || isPublicEndpoint(normalizedEndpoint)) {
            return parseResponse(firstResponse);
        }

        // ── 401 → Token Refresh Flow ─
        if (!TokenStore.getRefreshToken()) {
            redirectToLogin();
            return { Success: false, StatusCode: 401, Message: 'Session expired' };
        }

        let freshToken;

        if (RefreshQueue.isRefreshing) {
            // Another request is already refreshing — wait for it to notify us
            freshToken = await RefreshQueue.waitForToken();
        } else {
            // This request starts the refresh
            try {
                freshToken = await RefreshQueue.run(executeTokenRefresh);
            } catch {
                redirectToLogin();
                return { Success: false, StatusCode: 401, Message: 'Session expired' };
            }
        }

        // ── Retry with new token ────
        const retryResponse = await performRequest(freshToken);
        return parseResponse(retryResponse);

    } catch (err) {
        console.error('[fetchClient] Network error:', err);
        toast.error('Network error. Please check your connection.');
        return {
            Success: false,
            Message: 'Network error. Please check your connection.',
            Errors:  [err.message],
        };
    }
};
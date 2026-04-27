// src/api/client.js
import { API_BASE_URL } from './api-config';
import { toast } from 'react-hot-toast';

let isRefreshing = false;
let failedQueue = [];

/**
 * Standardized logout with redirection to login page and current path as redirect param.
 */
const logoutWithRedirect = () => {
    const currentPath = window.location.pathname + window.location.search;
    
    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Avoid redirecting if already on the login page to prevent refresh loops
    if (window.location.pathname.includes('/auth/login')) {
        return;
    }

    // Use window.location for hard redirect to ensure app state is cleared
    const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
};

/**
 * Processes the queue of failed requests after a token refresh.
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * Handles the response from the fetch call, parsing JSON and managing errors.
 * Note: 401 errors are now intercepted in fetchClient before reaching here.
 */
const handleResponse = async (response, isLogin = false) => {
    try {
        const contentType = response.headers.get('content-type');
        if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
            return {
                Success: response.ok,
                StatusCode: response.status,
                Data: null
            };
        }

        const data = await response.json();

        if (!response.ok) {
            const message = data.Message || data.message || 'An error occurred during the request.';
            // Only show toast if it's not a 401 (since 401 is handled by refresh flow)
            // UNLESS it's a login request, in which case we want to see the error
            if (response.status !== 401 || isLogin) {
                toast.error(message);
            }
            return {
                Success: false,
                StatusCode: response.status,
                Message: message,
                Errors: data.Errors || data.errors || [],
                Data: data.Data || data.data || null
            };
        }

        return data;
    } catch (error) {
        console.error('API Response Parsing Error:', error);
        return {
            Success: false,
            StatusCode: response.status,
            Message: 'Critical server error or invalid response format.',
            Errors: [error.message]
        };
    }
};

/**
 * Custom fetch wrapper with automatic token refresh and request queuing.
 */
export const fetchClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { ...options, headers };

    try {
        const response = await fetch(url, config);

        // Intercept 401 Unauthorized (except for login endpoint)
        if (response.status === 401 && cleanEndpoint !== '/api/auth/login') {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                logoutWithRedirect();
                return { Success: false, StatusCode: 401, Message: 'Session expired.' };
            }

            if (isRefreshing) {
                // Return a promise that will resolve when the refresh finishes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(newToken => {
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    return fetch(url, config).then(handleResponse);
                }).catch(err => {
                    return { Success: false, StatusCode: 401, Message: 'Session expired.' };
                });
            }

            isRefreshing = true;

            try {
                // Background refresh request
                const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                });
                debugger;
                console.log(refreshRes);

                if (refreshRes.ok) {
                    console.log("refreshRes is ok");
                    const data = await refreshRes.json();

                    // Handle potential backend format variations
                    const newToken = data.accessToken?.accessToken || data.accessToken || data.Data?.accessToken?.accessToken;
                    const newRefreshToken = data.refreshToken?.refreshToken || data.refreshToken || data.Data?.refreshToken?.refreshToken;

                    if (newToken) {
                        localStorage.setItem('token', newToken);
                        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
                        
                        processQueue(null, newToken);
                        isRefreshing = false;

                        // Retry original request
                        config.headers['Authorization'] = `Bearer ${newToken}`;
                        const retryResponse = await fetch(url, config);
                        return await handleResponse(retryResponse);
                    }
                }

                console.log("refreshRes is not ok");
                
                // If refresh fails
                throw new Error('Refresh failed');

            } catch (err) {
                isRefreshing = false;
                processQueue(err, null);
                logoutWithRedirect();
                return { Success: false, StatusCode: 401, Message: 'Session expired.' };
            }
        }

        return await handleResponse(response, cleanEndpoint === '/api/auth/login');
    } catch (error) {
        console.error('Network/Request Error:', error);
        toast.error('Network error. Please check your connection.');
        return {
            Success: false,
            Message: 'Network error. Please check your connection.',
            Errors: [error.message]
        };
    }
};
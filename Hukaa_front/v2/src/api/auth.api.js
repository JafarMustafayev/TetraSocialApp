// src/api/auth.api.js
import { fetchClient } from './client';

/**
 * Registers a new user.
 * @param {object} userData - The user data to register.
 * @returns {Promise<object>} The server response.
 */
export const register = async (userData) => {
    return fetchClient('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
};
/**
 * Log in a user.
 * @param {object} credentials - The login credentials (EmailOrUsername, Password).
 * @returns {Promise<object>} The server response.
 */
export const login = async (credentials) => {
    return fetchClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
};

/**
 * Log out the current user.
 * @returns {Promise<object>} The server response.
 */
export const logout = async () => {
    return fetchClient('/api/auth/logout', {
        method: 'POST'
    });
};

/**
 * Requests a password reset recovery link.
 * @param {object} data - { Email: string }
 * @returns {Promise<object>}
 */
export const forgotPassword = async (data) => {
    return fetchClient('/api/auth/Password/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

/**
 * Resets the password using a token.
 * @param {object} data - { UserId, Token, NewPassword }
 * @returns {Promise<object>}
 */
export const resetPassword = async (data) => {
    return fetchClient('/api/auth/Password/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

/**
 * Changes the user's password.
 * @param {object} data - { currentPassword, newPassword }
 * @returns {Promise<object>} The server response.
 */
export const changePassword = async (data) => {
    return fetchClient('/api/auth/Password/change-password', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};


/**
 * Confirms user email with token.
 * @param {object} data - { Email: string, Token: string }
 * @returns {Promise<object>}
 */
export const confirmEmail = async (data) => {
    return fetchClient('/api/auth/EmailVerification/confirm', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

/**
 * Resends confirmation email to user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<object>}
 */
export const resendConfirmationEmail = async (userId) => {
    return fetchClient('/api/auth/EmailVerification/resend', {
        method: 'POST',
        body: JSON.stringify({ userId: userId })
    });
};

/**
 * Retrieves all active sessions.
 * @returns {Promise<object>} Server response.
 */
export const getSessions = async () => {
    return fetchClient('/api/auth/session');
};

/**
 * Revokes a specific active session.
 * @param {string} sessionId 
 * @returns {Promise<object>} Server response.
 */
export const revokeSession = async (sessionId) => {
    return fetchClient(`/api/auth/session/${sessionId}`, {
        method: 'DELETE'
    });
};

/**
 * Revokes all other active sessions (excluding the current one).
 * @returns {Promise<object>} Server response.
 */
export const revokeOtherSessions = async () => {
    return fetchClient('/api/auth/session/revoke-others', {
        method: 'POST'
    });
};

/**
 * Retrieves the current two-factor authentication status from the backend.
 * @returns {Promise<object>} Server response.
 */
export const getTwoFactorStatus = async () => {
    return fetchClient('/api/auth/2fa/status');
};

/**
 * Initiates the setup/enable flow for two-factor authentication.
 * @param {string} password - The current user's password.
 * @returns {Promise<object>} Server response.
 */
export const setupTwoFactor = async (password) => {
    return fetchClient('/api/auth/2fa/setup', {
        method: 'POST',
        body: JSON.stringify({ password })
    });
};

/**
 * Enables two-factor authentication using the verification code.
 * @param {string} code - The 6-digit verification code.
 * @returns {Promise<object>} Server response.
 */
export const enableTwoFactor = async (code) => {
    return fetchClient('/api/auth/2fa/enable', {
        method: 'POST',
        body: JSON.stringify({ Code: code })
    });
};

/**
 * Regenerates two-factor authentication recovery codes.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} Server response.
 */
export const regenerateTwoFactorRecoveryCodes = async (password) => {
    return fetchClient('/api/auth/2fa/regenerate', {
        method: 'POST',
        body: JSON.stringify({ password })
    });
};

/**
 * Disables two-factor authentication using password and verification code.
 * @param {string} password - The user's password.
 * @param {string} code - The 2FA verification code.
 * @returns {Promise<object>} Server response.
 */
export const disableTwoFactor = async (password, code) => {
    return fetchClient('/api/auth/2fa/disable', {
        method: 'POST',
        body: JSON.stringify({ password, code })
    });
};
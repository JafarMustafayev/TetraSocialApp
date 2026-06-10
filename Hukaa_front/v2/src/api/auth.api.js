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
 * Confirms user email with token.
 * @param {object} data - { Email: string, Token: string }
 * @returns {Promise<object>}
 */
export const confirmEmail = async (data) => {
    return fetchClient('/api/auth/confirm-email', {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

/**
 * Resends confirmation email to user.
 * @param {string} email - The user's email address.
 * @returns {Promise<object>}
 */
export const resendConfirmationEmail = async (email) => {
    return fetchClient('/api/auth/resend-confirmation-email', {
        method: 'POST',
        body: JSON.stringify({ email })
    });
};
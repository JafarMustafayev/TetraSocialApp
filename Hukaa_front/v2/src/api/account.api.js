// src/api/account.api.js
import { fetchClient } from './client';

/**
 * Checks if the username is available.
 * @param {string} username 
 * @returns {Promise<object>} Response object with Success, Message, and Data.isAvailable
 */
export const checkUsername = async (username) => {
    if (!username) return { Success: false, Message: 'Username is required.' };
    
    return fetchClient(`/api/account/check-username?username=${encodeURIComponent(username)}`);
};

/**
 * Checks if the email is available.
 * @param {string} email 
 * @returns {Promise<object>} Response object with Success, Message, and Data.isAvailable
 */
export const checkEmail = async (email) => {
    if (!email) return { Success: false, Message: 'Email is required.' };

    return fetchClient(`/api/account/check-email?email=${encodeURIComponent(email)}`);
};

/**
 * Retrieves the current authenticated user's profile.
 * @returns {Promise<object>} Response object with user data.
 */
export const getMe = async () => {
    return fetchClient('/api/account/me');
};

/**
 * Updates the current user's username.
 * @param {string} username - The new username.
 * @returns {Promise<object>} The server response.
 */
export const updateUsername = async (username) => {
    return fetchClient('/api/account/username', {
        method: 'PATCH',
        body: JSON.stringify({ username })
    });
};

/**
 * Updates the current user's email address.
 * @param {string} email - The new email address.
 * @param {string} password - The current user's password.
 * @returns {Promise<object>} The server response.
 */
export const updateEmailAddress = async (email, password) => {
    return fetchClient('/api/account/emailAddress', {
        method: 'PATCH',
        body: JSON.stringify({ Email: email, Password: password })
    });
};



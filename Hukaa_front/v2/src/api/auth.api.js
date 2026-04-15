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

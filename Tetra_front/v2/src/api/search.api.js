// src/api/search.api.js

import { mockSearchUsers, mockSearchPosts } from '../utils/mockData';

// Simulated delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Searches for users based on query.
 * @param {string} query 
 * @returns {Promise<object>} Standard response format
 */
export const searchUsers = async (query = '') => {
    await delay(600); // Simulate network latency
    const normalizedQuery = query.toLowerCase().trim();

    let filtered = mockSearchUsers;
    if (normalizedQuery) {
        filtered = mockSearchUsers.filter(
            u => u.name.toLowerCase().includes(normalizedQuery) || 
                 u.username.toLowerCase().includes(normalizedQuery)
        );
    }

    return {
        Success: true,
        StatusCode: 200,
        Message: 'Users search completed successfully.',
        Data: filtered,
        Errors: []
    };
};

/**
 * Searches for posts based on query.
 * @param {string} query 
 * @returns {Promise<object>} Standard response format
 */
export const searchPosts = async (query = '') => {
    await delay(700); // Simulate network latency
    const normalizedQuery = query.toLowerCase().trim();

    let filtered = mockSearchPosts;
    if (normalizedQuery) {
        filtered = mockSearchPosts.filter(
            p => p.Content.toLowerCase().includes(normalizedQuery) || 
                 p.ByUserName.toLowerCase().includes(normalizedQuery)
        );
    }

    return {
        Success: true,
        StatusCode: 200,
        Message: 'Posts search completed successfully.',
        Data: filtered,
        Errors: []
    };
};

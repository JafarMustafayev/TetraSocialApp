// src/api/post.api.js

// Simulated delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

import { mockUserPosts,mockPosts } from '../utils/mockData';

/**
 * Retrieves the posts written by a specific user.
 * @param {string} username 
 * @returns {Promise<object>} Resolved standard response with posts data.
 */
export const getUserPosts = async (username) => {
    await delay(700); // Simulate network latency
    const normalizedUsername = username?.toLowerCase().replace(/[@\s]/g, '') || 'jafarmustafayev';
    const posts = mockPosts[normalizedUsername] || mockPosts['default'];
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Success',
        Data: posts,
        Errors: []
    };
};

export const getAllPosts = async () => {
    await delay(700); // Simulate network latency
    const posts = mockPosts;
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Success',
        Data: posts,
        Errors: []
    };
};

/**
 * Retrieves a single post by its ID.
 * @param {string|number} id - The ID of the post.
 * @returns {Promise<object>} Resolved standard response with post data.
 */
export const getPostById = async (id) => {
    await delay(300); // Simulate network latency
    const numericId = Number(id);

    // Search inside the static mockPosts dictionary
    for (const key in mockUserPosts) {
        const found = mockUserPosts[key].find(p => p.Id === numericId);
        if (found) {
            return {
                Success: true,
                StatusCode: 200,
                Message: 'Success',
                Data: found,
                Errors: []
            };
        }
    }

    // Fallback list matching Home.jsx mocks
    
    const fallbackFound = mockPosts.find(p => p.Id === numericId);
    if (mockPosts) {
        return {
            Success: true,
            StatusCode: 200,
            Message: 'Success',
            Data: fallbackFound,
            Errors: []
        };
    }

    return {
        Success: false,
        StatusCode: 404,
        Message: 'Post not found',
        Data: null,
        Errors: ['Post not found']
    };
};

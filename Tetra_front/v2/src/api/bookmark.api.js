// src/api/bookmark.api.js

import { mockBookmarks, mockFolders, mockLikedPosts } from '../utils/mockData';

// Simulated delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retrieves all bookmarked posts.
 * @returns {Promise<object>} Standard response structure.
 */
export const getBookmarks = async () => {
    await delay(500); // Simulate network latency
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Bookmarks retrieved successfully.',
        Data: mockBookmarks,
        Errors: []
    };
};

/**
 * Retrieves all bookmark folders.
 * @returns {Promise<object>} Standard response structure.
 */
export const getFolders = async () => {
    await delay(400); // Simulate network latency
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Folders retrieved successfully.',
        Data: mockFolders,
        Errors: []
    };
};

/**
 * Creates a new bookmark folder.
 * @param {string} name - Name of the folder.
 * @returns {Promise<object>} Standard response structure.
 */
export const createFolder = async (name) => {
    await delay(300); // Simulate network latency
    
    if (!name || name.trim() === "") {
        return {
            Success: false,
            StatusCode: 400,
            Message: 'Folder name cannot be empty.',
            Data: null,
            Errors: ['Invalid name']
        };
    }

    const newFolder = {
        id: Date.now(),
        name: name.trim(),
        postIds: []
    };

    mockFolders.push(newFolder);

    return {
        Success: true,
        StatusCode: 201,
        Message: 'Folder created successfully.',
        Data: newFolder,
        Errors: []
    };
};

/**
 * Retrieves all liked posts.
 * @returns {Promise<object>} Standard response structure.
 */
export const getLikedPosts = async () => {
    await delay(400); // Simulate network latency
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Liked posts retrieved successfully.',
        Data: mockLikedPosts,
        Errors: []
    };
};

/**
 * Updates a folder's name by its ID.
 * @param {string|number} id 
 * @param {string} name 
 * @returns {Promise<object>} Standard response structure.
 */
export const updateFolder = async (id, name) => {
    await delay(200);
    if (!name || name.trim() === "") {
        return {
            Success: false,
            StatusCode: 400,
            Message: 'Folder name cannot be empty.',
            Data: null,
            Errors: ['Invalid name']
        };
    }

    const folder = mockFolders.find(f => f.id === Number(id));
    if (folder) {
        folder.name = name.trim();
        return {
            Success: true,
            StatusCode: 200,
            Message: 'Folder updated successfully.',
            Data: folder,
            Errors: []
        };
    }

    return {
        Success: false,
        StatusCode: 404,
        Message: 'Folder not found.',
        Data: null,
        Errors: ['Folder not found']
    };
};

/**
 * Deletes a folder by its ID.
 * @param {string|number} id 
 * @returns {Promise<object>} Standard response structure.
 */
export const deleteFolder = async (id) => {
    await delay(200);
    const idx = mockFolders.findIndex(f => f.id === Number(id));
    if (idx !== -1) {
        mockFolders.splice(idx, 1);
        return {
            Success: true,
            StatusCode: 200,
            Message: 'Folder deleted successfully.',
            Data: id,
            Errors: []
        };
    }

    return {
        Success: false,
        StatusCode: 404,
        Message: 'Folder not found.',
        Data: null,
        Errors: ['Folder not found']
    };
};

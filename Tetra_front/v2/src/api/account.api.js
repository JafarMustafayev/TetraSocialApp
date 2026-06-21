// src/api/account.api.js
import { fetchClient } from './client';
import {
    mockFollowingList,
    mockFollowersList,
    mockProfiles
} from '../utils/mockData.js'

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

// delay for mock data
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Retrieves profile details of a specific user.
 * @param {string} username 
 * @returns {Promise<object>} Resolved response with user details.
 */
export const getUserProfile = async (username) => {
    await delay(500);
    const normalizedUsername = username?.toLowerCase().replace(/[@\s]/g, '') || 'jafarmustafayev';
    
    // Retrieve currentUser from localStorage to also allow their username dynamically
    let currentUsername = '';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            currentUsername = JSON.parse(storedUser).username?.toLowerCase();
        }
    } catch (e) {}

    const isAvailable = mockProfiles[normalizedUsername] || (currentUsername && normalizedUsername === currentUsername);

    if (!isAvailable) {
        return {
            Success: false,
            StatusCode: 404,
            Message: `User @${username} not found.`,
            Data: null,
            Errors: [`User @${username} not found.`]
        };
    }

    const profile = mockProfiles[normalizedUsername] || {
        name: username,
        username: normalizedUsername,
        bio: 'This is you!',
        website: '',
        joinedDate: 'Joined June 2026',
        followingCount: 0,
        followersCount: 0,
        postsCount: 0,
        followsYou: false,
        isFollowing: false,
        profilePhoto: null,
        coverPhoto: null
    };

    return {
        Success: true,
        StatusCode: 200,
        Message: 'Success',
        Data: profile,
        Errors: []
    };
};

/**
 * Retrieves the followers of a specific user.
 * @param {string} username 
 * @returns {Promise<object>}
 */
export const getUserFollowers = async (username) => {
    await delay(500);
    const normalizedUsername = username?.toLowerCase().replace(/[@\s]/g, '') || 'jafarmustafayev';
    const list = mockFollowersList[normalizedUsername] || mockFollowersList['jafarmustafayev'];
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Success',
        Data: list,
        Errors: []
    };
};

/**
 * Retrieves the following list of a specific user.
 * @param {string} username 
 * @returns {Promise<object>}
 */
export const getUserFollowing = async (username) => {
    await delay(500);
    const normalizedUsername = username?.toLowerCase().replace(/[@\s]/g, '') || 'jafarmustafayev';
    const list = mockFollowingList[normalizedUsername] || mockFollowingList['jafarmustafayev'];
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Success',
        Data: list,
        Errors: []
    };
};

/**
 * Follows a user.
 * @param {string} username 
 * @returns {Promise<object>}
 */
export const followUser = async (username) => {
    await delay(200);
    return {
        Success: true,
        StatusCode: 200,
        Message: `Successfully followed @${username}`,
        Data: null,
        Errors: []
    };
};

/**
 * Unfollows a user.
 * @param {string} username 
 * @returns {Promise<object>}
 */
export const unfollowUser = async (username) => {
    await delay(200);
    return {
        Success: true,
        StatusCode: 200,
        Message: `Successfully unfollowed @${username}`,
        Data: null,
        Errors: []
    };
};




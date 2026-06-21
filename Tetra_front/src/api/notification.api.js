// src/api/notification.api.js

import { mockNotifications } from '../utils/mockData';

// Simulated delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retrieves the notifications list for the logged-in user, filtered optionally by type.
 * @param {string} type - 'all' | 'mentions' | 'comments' | 'like' | 'follow' | 'system'
 * @returns {Promise<object>} Standard response structure.
 */
export const getNotifications = async (type = 'all') => {
    await delay(600); // Simulate network latency

    let filtered = mockNotifications;
    const normalizedType = type.toLowerCase().trim();

    if (normalizedType !== 'all') {
        // Map tab names to actual mock data type fields
        let targetType = normalizedType;
        if (normalizedType === 'comments') targetType = 'comment';
        if (normalizedType === 'mentions') targetType = 'mention';

        filtered = mockNotifications.filter(n => n.type === targetType);
    }

    return {
        Success: true,
        StatusCode: 200,
        Message: 'Notifications loaded successfully.',
        Data: filtered,
        Errors: []
    };
};

/**
 * Marks all notifications as read.
 * @returns {Promise<object>} Standard response structure.
 */
export const markAllAsRead = async () => {
    await delay(300);
    return {
        Success: true,
        StatusCode: 200,
        Message: 'All notifications marked as read.',
        Data: true,
        Errors: []
    };
};

/**
 * Marks a single notification as read by its ID.
 * @param {string|number} id 
 * @returns {Promise<object>} Standard response structure.
 */
export const markAsRead = async (id) => {
    await delay(200);
    return {
        Success: true,
        StatusCode: 200,
        Message: 'Notification marked as read successfully.',
        Data: id,
        Errors: []
    };
};

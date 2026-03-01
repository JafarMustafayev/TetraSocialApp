import { fetchClient } from './client';

/**
 * Fetch notifications for the current user with pagination.
 * @param {number} page - The page number to fetch.
 * @returns {Promise<any>}
 */
export const getNotifications = async (page = 1) => {
    return await fetchClient(`/api/notification/${page}`);
};

/**
 * Mark all notifications as read.
 * @returns {Promise<any>}
 */
export const readAllNotifications = async () => {
    return await fetchClient('/api/notification/all', {
        method: 'PUT',
    });
};

/**
 * Mark a specific notification as read.
 * @param {string} notificationId 
 * @returns {Promise<any>}
 */
export const readNotification = async (notificationId) => {
    return await fetchClient(`/api/notification/${notificationId}`, {
        method: 'PUT',
    });
};

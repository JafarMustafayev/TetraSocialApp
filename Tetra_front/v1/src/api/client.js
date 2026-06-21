export const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7124';
export const FRONT_URL = import.meta.env.VITE_FRONT_URL || 'https://localhost:5173';
export const USER_AVATAR = import.meta.env.VITE_USER_AVATAR || '/src/assets/images/user_avatar.png';
export const COVER_IMAGE = import.meta.env.VITE_COVER_IMAGE || '/src/assets/images/cover_image.png';
export const LOGO = import.meta.env.VITE_LOGO || '/src/assets/images/logo.png';
export const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || '/hubs/notification';
export const SIGNALR_CHAT_HUB_URL = import.meta.env.VITE_SIGNALR_CHAT_HUB_URL || '/hubs/chat';
const BASE_URL = IMAGE_BASE_URL;

/**
 * Custom fetch wrapper to handle common logic like base URL, headers, and error handling.
 * @param {string} endpoint - The API endpoint (e.g., '/api/auth/login').
 * @param {object} options - Fetch options (method, body, headers, etc.).
 * @returns {Promise<any>} - The parsed JSON response.
 */
export const fetchClient = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const token = localStorage.getItem('token');

    const isFormData = options.body instanceof FormData;
    const headers = {
        ...options.headers,
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            // Backend returns errors in specific format, try to extract meaningful message
            const errorMessage = data.Message || data.title || 'An error occurred';
            const error = new Error(errorMessage);
            error.statusCode = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
};

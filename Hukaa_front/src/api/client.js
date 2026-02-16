const BASE_URL = 'https://localhost:7124';

/**
 * Custom fetch wrapper to handle common logic like base URL, headers, and error handling.
 * @param {string} endpoint - The API endpoint (e.g., '/api/auth/login').
 * @param {object} options - Fetch options (method, body, headers, etc.).
 * @returns {Promise<any>} - The parsed JSON response.
 */
export const fetchClient = async (endpoint, options = {}) => {
    debugger;
    const url = `${BASE_URL}${endpoint}`;

    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

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

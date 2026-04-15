// src/api/client.js
import { API_BASE_URL } from './api-config';
import { toast } from 'react-hot-toast';

/**
 * Handles the response from the fetch call, parsing JSON and managing errors.
 * @param {Response} response 
 * @returns {Promise<object>} Standardized response object.
 */
const handleResponse = async (response) => {
    // 401 Unauthorized handling
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if on protected route (optional based on app structure)
       
        window.location.href = '/auth/login';
        
        toast.error('Session expired. Please login again.');
        return { 
            Success: false, 
            StatusCode: 401, 
            Message: 'Session expired. Please login again.' 
        };
    }

    try {
        // Handle empty responses (like 204 No Content)
        const contentType = response.headers.get('content-type');
        if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
            return {
                Success: response.ok,
                StatusCode: response.status,
                Data: null
            };
        }

        const data = await response.json();

        // If response is not ok (4xx or 5xx), standardize the error output
        if (!response.ok) {
            const message = data.Message || data.message || 'An error occurred during the request.';
            toast.error(message);
            return {
                Success: false,
                StatusCode: response.status,
                Message: message,
                Errors: data.Errors || data.errors || [],
                Data: data.Data || data.data || null
            };
        }

        // Return successful data (expecting backend format: { Success, StatusCode, Message, Data, Errors })
        return data;
    } catch (error) {
        console.error('API Response Parsing Error:', error);
        return {
            Success: false,
            StatusCode: response.status,
            Message: 'Critical server error or invalid response format.',
            Errors: [error.message]
        };
    }
};

/**
 * Custom fetch wrapper to handle base URL, auth headers, and common API logic.
 * @param {string} endpoint - The API endpoint (starts with /).
 * @param {object} options - Fetch options (method, body, headers, etc.).
 * @returns {Promise<object>} Standardized response.
 */
export const fetchClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Ensure the endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    const headers = {
        'Accept': 'application/json',
        ...options.headers,
    };

    // Add Content-Type unless it's FormData
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        console.error('Network/Request Error:', error);
        toast.error('Network error. Please check your connection.');
        return {
            Success: false,
            Message: 'Network error. Please check your connection.',
            Errors: [error.message]
        };
    }
};
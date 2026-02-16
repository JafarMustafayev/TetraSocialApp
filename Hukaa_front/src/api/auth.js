import { fetchClient } from './client';

export const login = async (credentials) => {
    return fetchClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const register = async (userData) => {
    return fetchClient('/api/Auth/Register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const confirmEmail = async (data) => {
    debugger;
    return fetchClient('/api/Auth/ConfirmEmail', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const forgotPassword = async (email) => {
    return fetchClient('/api/Auth/ForgotPassword', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
};

export const resetPassword = async (data) => {
    return fetchClient('/api/Auth/ResetPassword', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

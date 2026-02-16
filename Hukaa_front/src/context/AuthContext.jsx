import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token or fetch user profile if needed
            // For now, we'll just assume the user is logged in if the token exists
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginApi(credentials);
            if (response.success && response.data && response.data.access_token) {
                const { accessToken } = response.data.access_token;
                localStorage.setItem('token', accessToken);
                setUser({ token: accessToken });
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.Message || 'Login failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message || 'An error occurred during login'
            }
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerApi(userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

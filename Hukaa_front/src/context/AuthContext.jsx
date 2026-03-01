import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../api/auth';
import { getMe } from '../api/profile';
import signalRService from '../api/signalr';
import { SIGNALR_HUB_URL, IMAGE_BASE_URL } from '../api/client';


const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        signalRService.stopConnection();
    };

    const startSignalRConnection = () => {
        const hubUrl = IMAGE_BASE_URL + SIGNALR_HUB_URL;
        if (!hubUrl) return;

        setTimeout(async () => {
            try {
                const status = signalRService.getConnectionState();
                if (status === 'Disconnected') {
                    await signalRService.startConnection(hubUrl);
                }
            } catch (err) {
                console.error('Failed to start SignalR:', err);
            }
        }, 2000);
    };

    const fetchUserProfile = async (token) => {
        try {
            const response = await getMe();
            if (response && response.success) {
                setUser({ ...response.data, token });
                startSignalRConnection();
            } else {
                logout();
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            logout();
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await fetchUserProfile(token);
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginApi(credentials);
            if (response.success && response.data && response.data.access_token) {
                const accessToken = response.data.access_token.accessToken || response.data.access_token;
                localStorage.setItem('token', accessToken);
                await fetchUserProfile(accessToken);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.message || response.Message || 'Login failed'
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
        return await registerApi(userData);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        updateProfile: () => fetchUserProfile(localStorage.getItem('token'))
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

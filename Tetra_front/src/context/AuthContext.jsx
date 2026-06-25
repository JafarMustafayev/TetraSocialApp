// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe } from '../api/account.api';
import { logout as logoutApi } from '../api/auth.api';
import { toast } from 'react-hot-toast';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { setTheme } = useTheme();

    const fetchUser = async () => {
        setIsLoadingUser(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setIsLoadingUser(false);
            return;
        }

        try {
            const response = await getMe();
            if (response.Success || response.success) {
                const userData = response.Data || response.data;
                setUser(userData);
                if (userData && userData.accentHue !== undefined && userData.accentHue !== null) {
                    const hue = userData.accentHue;
                    localStorage.setItem('accentHue', hue);
                    document.documentElement.style.setProperty('--accent-hue', hue);
                    document.documentElement.style.setProperty('--color-main', `hsl(${hue} 89% var(--accent-l))`);
                    document.documentElement.style.setProperty('--color-main-hover', `hsl(${hue} 89% var(--accent-l) / 80%)`);
                    document.documentElement.style.setProperty('--color-optional', `hsl(${hue} 89% var(--accent-l) / 70%)`);
                }
                if (userData && userData.theme) {
                    setTheme(userData.theme);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    const updateCurrentUser = (data) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    };

    const logout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout request failed:", error);
            toast.error("Logged out locally. Session cleanup request failed.");
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsLoggingOut(false);
            window.location.href = '/auth/login';
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser, isLoadingUser, updateCurrentUser, logout, isLoggingOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

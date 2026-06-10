// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe } from '../api/account.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

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
                setUser(response.Data || response.data);
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

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, fetchUser, isLoadingUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

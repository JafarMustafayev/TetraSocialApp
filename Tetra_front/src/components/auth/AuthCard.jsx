// src/components/auth/AuthCard.jsx
import React from 'react';
import { getLogo } from '../../api/apiConfig.js';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const AuthCard = ({ title, subtitle, children }) => {
    const { isDark } = useTheme();
    const logo = getLogo(isDark ? 'dark' : 'light');
    return (
        <div className="bg-white dark:bg-[#16181c] w-full rounded-[24px] shadow-sm border border-gray-100 dark:border-[#1f1f1f] p-8 md:p-10 transition-colors duration-300">
            <div className="flex flex-col items-center text-center mb-8">
                <Link to="/" className="mb-6 inline-block">
                    <img src={logo} alt="Tetra" className="h-15 w-auto" />
                </Link>
                {title && (
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p className="text-[15px] text-gray-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default AuthCard;

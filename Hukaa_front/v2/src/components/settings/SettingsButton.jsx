import React from 'react';

const SettingsButton = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
    
    const baseStyles = "h-[36px] px-4 rounded-full font-bold text-[14px] transition-colors inline-flex items-center justify-center";
    
    const variants = {
        primary: "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    };

    return (
        <button 
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default SettingsButton;

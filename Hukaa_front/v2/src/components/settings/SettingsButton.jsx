import React from 'react';

const SettingsButton = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled, ...props }) => {
    
    const baseStyles = "h-[36px] px-4 rounded-full font-bold text-[14px] transition-colors inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
        danger: "border border-red-200 dark:border-red-900/30 bg-transparent text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800/50"
    };

    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default SettingsButton;

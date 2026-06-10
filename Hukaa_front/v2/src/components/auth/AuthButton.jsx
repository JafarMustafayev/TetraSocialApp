import React from 'react';

const AuthButton = ({ children, isLoading, disabled, onClick, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`w-full h-[46px] rounded-full font-bold text-[15px] flex items-center justify-center transition-all 
                bg-gray-900 text-white hover:bg-black 
                dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}`}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin"></div>
                    <span>Please wait...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default AuthButton;

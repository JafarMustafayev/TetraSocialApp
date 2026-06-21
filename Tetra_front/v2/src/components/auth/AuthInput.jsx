// src/components/auth/AuthInput.jsx
import React, { useState } from 'react';

const AuthInput = ({ label, type = "text", error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    className={`w-full h-[46px] px-4 rounded-xl text-[15px] transition-colors
                        bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-white
                        border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} 
                        focus:border-main focus:ring-1 focus:ring-main focus:outline-none
                        placeholder-gray-400 dark:placeholder-gray-600`}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                        tabIndex="-1"
                    >
                        <i className={`ri-eye-${showPassword ? 'off-' : ''}line text-lg`}></i>
                    </button>
                )}
            </div>
            {error && (
                <span className="block mt-1.5 ml-1 text-[13px] text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
};

export default AuthInput;

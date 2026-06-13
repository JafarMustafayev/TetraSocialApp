import React, { useState } from 'react';

const SettingsInput = ({ label, type = "text", helperText, status, helperClassName, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    let borderClass = "border-gray-300 dark:border-gray-700 focus:border-main focus:ring-main";
    if (status === 'success') {
        borderClass = "border-green-500 focus:border-green-500 focus:ring-green-500";
    } else if (status === 'error') {
        borderClass = "border-red-500 focus:border-red-500 focus:ring-red-500";
    }

    let helperTextClass = "text-gray-500";
    if (isFocused && !status) {
        helperTextClass = "text-main";
    } else if (status === 'success') {
        helperTextClass = "text-green-500";
    } else if (status === 'error') {
        helperTextClass = "text-red-500";
    }

    return (
        <div className="mb-5">
            <label className="block text-[15px] font-bold text-gray-900 dark:text-white mb-2">
                {label}
            </label>
            <input
                type={type}
                className={`w-full h-[48px] px-4 rounded-xl border bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition-colors text-[15px] ${borderClass}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {helperText && (
                <span className={`block mt-1 text-[13px] ${helperTextClass} ${helperClassName || ''}`}>
                    {helperText}
                </span>
            )}
        </div>
    );
};

export default SettingsInput;

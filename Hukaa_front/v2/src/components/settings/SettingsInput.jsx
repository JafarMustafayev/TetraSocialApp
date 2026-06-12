import React, { useState } from 'react';

const SettingsInput = ({ label, type = "text", helperText, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="mb-5">
            <label className="block text-[15px] font-bold text-gray-900 dark:text-white mb-2">
                {label}
            </label>
            <input
                type={type}
                className="w-full h-[48px] px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-colors text-[15px] "
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            {helperText && (
                <span className={`block mt-1 text-[13px] ${isFocused ? 'text-main' : 'text-gray-500'}`}>
                    {helperText}
                </span>
            )}
        </div>
    );
};

export default SettingsInput;

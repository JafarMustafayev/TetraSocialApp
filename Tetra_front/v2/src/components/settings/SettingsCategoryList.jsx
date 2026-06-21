// src/components/settings/SettingsCategoryList.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { settingsData } from '../../data/settingsData';

const SettingsCategoryList = () => {
    const location = useLocation();

    // Determine the active category from the URL, default to "account" if exact match on /settings
    const pathParts = location.pathname.split('/').filter(Boolean);
    const activeCategory = pathParts.length > 1 ? pathParts[1] : 'account';

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar">
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>

            <div className="flex-1 py-2">
                {settingsData.map((category) => {
                    const isActive = activeCategory === category.id;

                    return (
                        <Link
                            key={category.id}
                            to={`/settings/${category.id}`}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-l-4 ${isActive
                                ? 'bg-gray-50 dark:bg-[#16181c] border-main'
                                : 'hover:bg-gray-50 dark:hover:bg-[#16181c] border-transparent'
                                }`}
                        >
                            <span className={`text-[15px] ${isActive ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                {category.title}
                            </span>
                            <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default SettingsCategoryList;

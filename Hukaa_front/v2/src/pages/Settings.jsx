import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SettingsCategoryList from '../components/settings/SettingsCategoryList';
import SettingsContent from '../components/settings/SettingsContent';

const Settings = () => {
    const location = useLocation();

    // Check if we are at the root of the settings page
    const isRoot = location.pathname === '/settings' || location.pathname === '/settings/';

    useEffect(() => {
        document.title = "Settings - Hukaa";
    }, []);

    return (
        <div className="flex w-full h-[calc(100vh-60px)] md:h-screen overflow-hidden">
            {/* Middle Column: Category List */}
            {/* Always visible on Desktop. Visible on Mobile ONLY if at root /settings */}
            <div className={`w-full md:w-[320px] lg:w-[350px] shrink-0 border-r border-gray-100 dark:border-[#1f1f1f] bg-white dark:bg-[#09090b] ${isRoot ? 'block' : 'hidden md:block'}`}>
                <SettingsCategoryList />
            </div>

            {/* Right Column: Detail Content */}
            {/* Always visible on Desktop. Visible on Mobile ONLY if NOT at root /settings */}
            <div className={`flex-1 min-w-0 bg-white dark:bg-[#09090b] ${!isRoot ? 'block' : 'hidden md:block'}`}>
                <Routes>
                    <Route path="/" element={<SettingsContent />} />
                    <Route path="/:categoryId" element={<SettingsContent />} />
                    <Route path="/:categoryId/:itemId" element={<SettingsContent />} />
                </Routes>
            </div>
        </div>
    );
};

export default Settings;

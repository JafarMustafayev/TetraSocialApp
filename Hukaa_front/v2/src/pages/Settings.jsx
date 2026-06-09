// src/pages/Settings.jsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SecuritySettings from './settings/SecuritySettings';
import EditAccount from './settings/EditAccount';
import ProfilePictures from './settings/ProfilePictures';
import PrivacySettings from './settings/PrivacySettings';

const SettingsList = () => {
    const navigate = useNavigate();

    const sections = [
        { id: 'edit-account', title: 'Edit Account', icon: 'ri-user-settings-line', description: 'Update your name, bio, and profile pictures.', path: '/settings/edit-account' },
        { id: 'security', title: 'Security Settings', icon: 'ri-lock-password-line', description: 'Manage passwords, passkeys, and two-step verification.', path: '/settings/security' },
        { id: 'privacy', title: 'Privacy Settings', icon: 'ri-shield-user-line', description: 'Control who can see your profile and interact with you.', path: '/settings/privacy' },
        { id: 'notifications', title: 'Notifications', icon: 'ri-notification-3-line', description: 'Customize your notification preferences.', path: '/settings/notifications' },
        { id: 'display', title: 'Display & Theme', icon: 'ri-palette-line', description: 'Choose your preferred theme and display settings.', path: '/settings/display' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account and app preferences</p>
            </div>

            <div className="grid gap-4">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => navigate(section.path)}
                        className="bg-white dark:bg-[#161a29] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-5 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-blue-900/20 flex items-center justify-center text-main group-hover:bg-main group-hover:text-white transition-all">
                            <i className={`${section.icon} text-2xl`}></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1">{section.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-300 dark:text-gray-700 text-2xl self-center group-hover:text-main group-hover:translate-x-1 transition-all"></i>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Settings = () => {
    return (
        <Routes>
            <Route path="/" element={<SettingsList />} />
            <Route path="/security" element={<SecuritySettings />} />
            <Route path="/edit-account" element={<EditAccount />} />
            <Route path="/edit-account/pictures" element={<ProfilePictures />} />
            <Route path="/privacy" element={<PrivacySettings />} />
        </Routes>
    );
};

export default Settings;

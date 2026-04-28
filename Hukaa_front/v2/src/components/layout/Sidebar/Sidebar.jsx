// src/components/layout/Sidebar/Sidebar.jsx
import React from 'react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        { path: '/feed', label: 'News Feed', icon: 'ri-newspaper-line' },
        { path: '/notifications', label: 'Notifications', icon: 'ri-notification-3-line', count: 0 },
        { path: '/messages', label: 'Messages', icon: 'ri-chat-3-line', count: 0 },
        { path: '/profile', label: 'Profile', icon: 'ri-user-line' },
        { path: '/my-activities', label: 'My Activities', icon: 'ri-layout-grid-line' },
    ];

    const settingsItem = { path: '/settings', label: 'Settings', icon: 'ri-settings-3-line' };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-980 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            ></div>

            <aside className={`fixed left-0 top-[85px] h-[calc(100vh-100px)] rounded-r-2xl border border-gray-100 md:rounded-2xl w-[155px] mt-1.5 ml-0 md:ml-1.5 bg-white dark:bg-[#161a29] dark:border-gray-800 z-990 transform transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto flex flex-col`}>
                <div className="p-4 pt-6 grow">
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <SidebarItem key={item.path} item={item} />
                        ))}
                    </ul>
                </div>

                <div className="p-3 border-gray-100 dark:border-gray-800">
                    <SidebarItem item={settingsItem} />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

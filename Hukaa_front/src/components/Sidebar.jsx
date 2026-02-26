import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/', label: 'News Feed', icon: 'ri-newspaper-line' },
        { path: '/notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
        { path: '/messages', label: 'Messages', icon: 'ri-chat-3-line' },
        { path: '/profile', label: 'Profile', icon: 'ri-user-line' },
        { path: '/my-activities', label: 'My Activities', icon: 'ri-layout-grid-line' },
    ];

    const settingsItem = { path: '/settings', label: 'Settings', icon: 'ri-settings-3-line' };

    return (
        <div className="fixed left-0 top-[85px] h-[calc(100vh-100px)] rounded-2xl border border-gray-100  w-[155px] mt-1.5 ml-1.5 bg-white  z-100 transform transition-all duration-300 md:translate-x-0 -translate-x-full overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-4 pt-6 grow">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 group
                                    ${location.pathname === item.path
                                        ? 'bg-main text-white shadow-lg shadow-blue-100'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-main'}`}
                            >
                                <i className={`${item.icon} text-2xl mb-2 transition-transform duration-300 group-hover:scale-110`}></i>
                                <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-gray-100">
                <Link
                    to={settingsItem.path}
                    className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 group
                        ${location.pathname === settingsItem.path
                            ? 'bg-main text-white shadow-lg shadow-blue-100'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-main'}`}
                >
                    <i className={`${settingsItem.icon} text-2xl mb-2 transition-transform duration-300 group-hover:scale-110`}></i>
                    <span className="text-[11px] font-bold uppercase tracking-wider">{settingsItem.label}</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;

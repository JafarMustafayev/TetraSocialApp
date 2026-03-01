import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { notifications } = useNotifications();

    const menuItems = [
        { path: '/', label: 'News Feed', icon: 'ri-newspaper-line' },
        {
            path: '/notifications',
            label: 'Notifications',
            icon: 'ri-notification-3-line',
            count: notifications.length
        },
        { path: '/messages', label: 'Messages', icon: 'ri-chat-3-line' },
        {
            path: '/profile',
            label: 'Profile',
            icon: 'ri-user-line'
        },
        { path: '/my-activities', label: 'My Activities', icon: 'ri-layout-grid-line' },
    ];

    const settingsItem = { path: '/settings', label: 'Settings', icon: 'ri-settings-3-line' };

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-black/50 z-990 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            ></div>

            <div className={`fixed left-0 top-[85px] h-[calc(100vh-100px)] rounded-r-2xl border border-gray-100 md:rounded-2xl w-[155px] mt-1.5 ml-0 md:ml-1.5 bg-white z-1000 transform transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto custom-scrollbar flex flex-col shadow-xl md:shadow-none`}>
                <div className="p-4 pt-6 grow">
                    <ul className="space-y-4">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 group
                                    ${location.pathname === item.path
                                            ? 'bg-main text-white shadow-lg shadow-blue-100'
                                            : 'text-gray-400 hover:bg-gray-50 hover:text-main'}`}
                                >
                                    <i className={`${item.icon} text-2xl mb-2 transition-transform duration-300 group-hover:scale-110`}></i>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>

                                    {item.count > 0 && (
                                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                            {item.count > 9 ? '9+' : item.count}
                                        </span>
                                    )}
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
        </>
    );
};

export default Sidebar;

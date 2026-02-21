import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/', label: 'News Feed', icon: 'ri-newspaper-line' },
        { path: '/notifications', label: 'Notifications', icon: 'ri-notification-3-line' },
        { path: '/messages', label: 'Messages', icon: 'ri-chat-3-line' },
        { path: '/friends', label: 'Friends', icon: 'ri-group-line' },
    ];

    return (
        <div className="fixed left-0 top-[85px] h-[calc(100vh-85px)] w-[165px] bg-white shadow-[0_8px_10px_0_rgba(183,192,206,0.1)] z-100 transform transition-all duration-300 md:translate-x-0 -translate-x-full overflow-y-auto custom-scrollbar">
            <div className="p-4 pt-6">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 group
                                    ${location.pathname === item.path
                                        ? 'bg-[#3644D9] text-white shadow-lg shadow-blue-100'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-[#3644D9]'}`}
                            >
                                <i className={`${item.icon} text-2xl mb-2 transition-transform duration-300 group-hover:scale-110`}></i>
                                <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;

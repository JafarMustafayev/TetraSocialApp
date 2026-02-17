import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/', label: 'News Feed', icon: 'flaticon-newspaper' },
        { path: '/notifications', label: 'Notifications', icon: 'flaticon-bell' },
        { path: '/messages', label: 'Messages', icon: 'flaticon-comment-1' },
        { path: '/friends', label: 'Friends', icon: 'flaticon-friends' },
    ];

    return (
        <div className="fixed left-0 top-[5.30rem] h-full w-[165px] z-1 transition-all duration-400 hidden lg:block">
            {/* Sidebar Body */}
            <div className="h-full relative bg-white overflow-hidden shadow-[0_8px_10px_0_rgba(183,192,206,0.1)] max-h-[calc(100%-80px)] transition-all duration-400 pt-2">
                <ul className="list-none h-full overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-[30px]  last:mb-0 relative group">
                            <Link
                                to={item.path}
                                className={`block relative pl-[40px] py-[5px] text-[14px] font-semibold transition-all duration-400 ${isActive(item.path) ? 'text-[#3644D9]' : 'text-[#515355] hover:text-[#3644D9]'
                                    }`}
                            >
                                {/* Left Indicator (the ::before replacement) */}
                                <span className={`absolute left-[-10px] top-0 w-[2px] bg-[#3644D9] transition-all duration-400 ${isActive(item.path) ? 'h-full opacity-100 visible' : 'h-0 opacity-0 invisible group-hover:h-full group-hover:opacity-100 group-hover:visible'
                                    }`}></span>

                                {/* Icon Container */}
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center rounded-[8px] text-[18px] transition-all duration-400 ${isActive(item.path) ? 'bg-[#3644D9] text-white' : 'bg-[#F4F7FC] text-[#515355] group-hover:bg-[#3644D9] group-hover:text-white'
                                    }`}>
                                    <i className={item.icon}></i>
                                </span>

                                <span className="transition-all duration-400">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;

// src/components/layout/Navbar/NavNotificationsMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR } from '../../../api/api-config';

const NavNotificationsMenu = ({ notifications = [], isOpen, toggleDropdown }) => {
    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={toggleDropdown}
                className="w-10 h-10 sm:w-[45px] sm:h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-main transition-all relative"
            >
                <i className="ri-notification-3-line text-[22px]"></i>
                {notifications.length > 0 && (
                    <span className="absolute -top-[2px] -right-[2px] w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-[#2E40B7]">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            <div className={`absolute right-0 top-full mt-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top z-50 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <h3 className="font-bold text-gray-800 text-sm m-0">Notifications</h3>
                    <Link to="/notifications" className="text-[10px] text-main font-bold hover:underline uppercase tracking-wider">View All</Link>
                </div>
                <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <Link
                                key={notif.Id}
                                to="/notifications"
                                className="p-3 flex items-start gap-3 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                <img src={USER_AVATAR} className="w-10 h-10 rounded-full object-cover" alt="user" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 font-medium line-clamp-2">{notif.Title}</p>
                                    <span className="text-[9px] font-bold text-main uppercase mt-1 block">Just now</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-8 text-center opacity-40">
                            <i className="ri-notification-off-line text-2xl block mb-1"></i>
                            <p className="text-xs italic">No new notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavNotificationsMenu;

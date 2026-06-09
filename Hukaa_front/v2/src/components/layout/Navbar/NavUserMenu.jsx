// src/components/layout/Navbar/NavUserMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL, USER_AVATAR } from '../../../api/api-config';

const NavUserMenu = ({ user, isOpen, toggleDropdown, onLogout }) => {
    return (
        <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
            <div
                onClick={toggleDropdown}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-white/20"
            >
                <div className="hidden lg:block text-right">
                    <span className="block text-sm font-bold text-white leading-none">{user?.FirstName || 'User'}</span>
                    <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">{user?.LastName || 'Profile'}</span>
                </div>
                <img
                    src={user?.ProfilePhoto ? `${API_BASE_URL}/${user.ProfilePhoto}` : USER_AVATAR}
                    className="w-[40px] h-[40px] rounded-full border-2 border-white/20 object-cover shadow-sm"
                    alt="user"
                />
            </div>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-full mt-4 w-[240px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 transition-all duration-300 transform origin-top z-50 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                <div className="px-5 py-3">
                    <span className="block text-sm font-bold text-gray-800">{user?.FirstName} {user?.LastName}</span>
                    <span className="text-xs text-gray-400 truncate block">@{user?.UserName || 'username'}</span>
                </div>

                {user?.IsAdmin && (
                    <div className="py-2">
                        <Link to="/dashboard" className="w-[90%] mx-auto flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all rounded-xl">
                            <i className="ri-dashboard-line mr-3 text-lg"></i>
                            Dashboard
                        </Link>
                    </div>
                )}

                <div className="px-2 pt-2">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all rounded-xl group border border-transparent hover:border-red-100"
                    >
                        <i className="ri-logout-box-line mr-3 text-lg text-red-400 group-hover:text-red-500"></i>
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NavUserMenu;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL, USER_AVATAR, LOGO } from '../api/client';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (name, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        setOpenDropdown(null);
        logout();
    };

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const stopPropagation = (e) => e.stopPropagation();

    console.log(user);

    return (
        <nav className="fixed top-0 left-0 w-full h-[85px] bg-[#3644D9] shadow-lg z-1000 flex items-center px-4 lg:px-8">
            <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
                {/* Logo Section */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="shrink-0">
                        <img src={LOGO} alt="logo" className="h-[45px] w-auto" />
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:block relative group">
                        <form className="relative">
                            <input
                                type="text"
                                className="w-[300px] lg:w-[450px] h-[45px] bg-white/10 border border-white/20 rounded-full pl-12 pr-5 text-white placeholder-white/60 focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 outline-none transition-all duration-300"
                                placeholder="Search everything..."
                            />
                            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-gray-400">
                                <i className="ri-search-line text-xl"></i>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side Icons & Profile */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Inbox Dropdown */}
                    <div className="relative" onClick={stopPropagation}>
                        <button
                            onClick={(e) => toggleDropdown('inbox', e)}
                            className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-[#3644D9] transition-all relative"
                        >
                            <i className="ri-mail-line text-[22px]"></i>
                            <span className="absolute -top-[2px] -right-[2px] w-5 h-5 flex items-center justify-center rounded-full bg-[#1CCD16] text-white text-[10px] font-bold border-2 border-[#3644D9]">2</span>
                        </button>

                        <div className={`absolute right-0 top-full mt-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top ${openDropdown === 'inbox' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-bold text-gray-800">Messages</h3>
                                <Link to="/messages" className="text-xs text-[#3644D9] font-bold hover:underline">View All</Link>
                            </div>
                            <div className="p-2 max-h-[400px] overflow-y-auto">
                                <div className="p-3 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                    <img src={USER_AVATAR} className="w-10 h-10 rounded-full object-cover" alt="user" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800 truncate">James Vanwin</h4>
                                        <p className="text-xs text-gray-500 truncate">Hello Dear I Want Talk To You</p>
                                    </div>
                                    <span className="w-2 h-2 bg-[#3644D9] rounded-full"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests Dropdown */}
                    <div className="relative" onClick={stopPropagation}>
                        <button
                            onClick={(e) => toggleDropdown('requests', e)}
                            className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-[#3644D9] transition-all relative"
                        >
                            <i className="ri-user-follow-line text-[22px]"></i>
                            <span className="absolute -top-[2px] -right-[2px] w-5 h-5 flex items-center justify-center rounded-full bg-[#3ED7FF] text-white text-[10px] font-bold border-2 border-[#3644D9]">3</span>
                        </button>

                        <div className={`absolute right-0 top-full mt-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top ${openDropdown === 'requests' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-bold text-gray-800">Friend Requests</h3>
                                <Link to="/friends" className="text-xs text-[#3644D9] font-bold hover:underline">View All</Link>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <img src={USER_AVATAR} className="w-10 h-10 rounded-full object-cover" alt="user" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-800">Sandra Cross</h4>
                                        <p className="text-[11px] text-gray-400">26 Friends</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"><i className="ri-close-line text-sm"></i></button>
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 text-[#3644D9] hover:bg-[#3644D9] hover:text-white transition-all"><i className="ri-check-line text-sm"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Dropdown */}
                    <div className="relative" onClick={stopPropagation}>
                        <button
                            onClick={(e) => toggleDropdown('notifications', e)}
                            className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-[#3644D9] transition-all relative"
                        >
                            <i className="ri-notification-3-line text-[22px]"></i>
                            <span className="absolute -top-[2px] -right-[2px] w-5 h-5 flex items-center justify-center rounded-full bg-[#FF3E3E] text-white text-[10px] font-bold border-2 border-[#3644D9]">1</span>
                        </button>

                        <div className={`absolute right-0 top-full mt-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top ${openDropdown === 'notifications' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-bold text-gray-800">Notifications</h3>
                                <Link to="/notifications" className="text-xs text-[#3644D9] font-bold hover:underline">View All</Link>
                            </div>
                            <div className="p-2">
                                <Link to="/notifications" className="p-3 flex items-start gap-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#3644D9] shrink-0">
                                        <i className="ri-chat-3-line"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-800">James Vanwin</h4>
                                        <p className="text-xs text-gray-500">Posted A Comment On Your Status</p>
                                        <span className="text-[10px] font-bold text-[#3644D9] uppercase mt-1 block">20 Minutes Ago</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="relative ml-2" onClick={stopPropagation}>
                        <div
                            onClick={(e) => toggleDropdown('profile', e)}
                            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 cursor-pointer transition-all border border-transparent hover:border-white/20"
                        >
                            <div className="hidden lg:block text-right">
                                <span className="block text-sm font-bold text-white leading-none">{user?.firstName || 'User'}</span>
                                <span className="text-[10px] text-white/70 font-medium uppercase tracking-wider">{user?.lastName || 'Profile'}</span>
                            </div>
                            <img
                                src={user?.profilePhoto ? `${IMAGE_BASE_URL}/${user.profilePhoto}` : USER_AVATAR}
                                className="w-[40px] h-[40px] rounded-full border-2 border-white/20 object-cover shadow-sm"
                                alt="user"
                            />
                        </div>

                        {/* Dropdown Menu */}
                        <div className={`absolute right-0 top-full mt-4 w-[240px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 transition-all duration-300 transform origin-top ${openDropdown === 'profile' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                            <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                <span className="block text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</span>
                                <span className="text-xs text-gray-400 truncate block">@{user?.username}</span>
                            </div>

                            <div className="border-t border-gray-50 mt-2 pt-2">
                                <button onClick={handleLogout} className="w-full flex items-center px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all group">
                                    <i className="ri-logout-box-line mr-3 text-lg text-red-400 group-hover:text-red-500"></i> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

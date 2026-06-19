// src/components/layout/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LOGO } from '../../../api/apiConfig';
import MobileProfileSheet from './MobileProfileSheet';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { Skeleton } from '../../skeletons/index.js';

import {
    House,
    Search,
    Bell,
    MessageSquare,
    Bookmark,
    User,
    Settings,
    Plus,
    Terminal,
    Radio,
    Moon,
    Sun
} from "lucide-react"

const Navbar = () => {
    const location = useLocation();
    const { user, logout, isLoggingOut, isLoadingUser } = useAuth();
    const [isMobileProfileSheetOpen, setIsMobileProfileSheetOpen] = useState(false);

    // Desktop Dropdown State
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Theme
    const { theme, toggleTheme } = useTheme();

    // Close dropdown on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDesktopDropdownOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsDesktopDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setIsDesktopDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
    }, []);



    const profilePath = user?.username ? `/${user.username}` : '/profile';
    const menuItems = [
        { path: '/feed', label: 'Home', icon: House, visibility: ['desktop', 'mobile'] },
        { path: '/search', label: 'Search', icon: Search, visibility: ['desktop', 'mobile'] },
        { path: '/notifications', label: 'Notifications', icon: Bell, count: 0, visibility: ['desktop', 'mobile'] },
        { path: '/messages', label: 'Messages', icon: MessageSquare, count: 0, visibility: ['desktop', 'mobile'] },

        { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, visibility: ['desktop', 'profileSheet'] },
        { path: '/apitester', label: 'API Tester', icon: Terminal, isDev: true, visibility: ['desktop', 'profileSheet'] },
        { path: '/websockettester', label: 'WS Tester', icon: Radio, isDev: true, visibility: ['desktop', 'profileSheet'] },

        { path: profilePath, label: 'Profile', icon: User, visibility: ['desktop'] },
        { path: '/settings', label: 'Settings', icon: Settings, visibility: ['desktop', 'profileSheet'] }
    ];





    const getNavItemClass = (isActive) => {
        const baseClass = "flex items-center gap-3 px-3 py-2 my-0.5 rounded-full transition-all group w-full";

        if (isActive) {
            return `${baseClass} font-medium bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-gray-100`;
        } else {
            return `${baseClass} font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-neutral-800 dark:hover:text-gray-100`;
        }
    };

    return (
        <>
            {/* Desktop Left Sidebar */}
            <header className="hidden md:flex flex-col justify-between sticky top-0 h-screen  w-[240px] shrink-0 border-r border-gray-100 dark:border-[#1f1f1f] px-4 py-4 z-50 bg-white dark:bg-[#09090b]">
                <div className="flex flex-col gap-2 w-full">
                    <div className="w-full flex justify-start">
                        <Link to="/" className="flex items-center w-auto h-auto rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all mb-2">
                            <img src={LOGO} alt="logo" className="h-9 w-auto" />
                        </Link>
                    </div>

                    <nav className="flex flex-col gap-1 mt-2 w-full">
                        {menuItems.filter(item =>
                            item.visibility.includes('desktop')).map((item) => {
                                if (item.isDev && !import.meta.env.DEV && user?.isAdmin !== true) {
                                    return null;
                                }
                                const isActive =
                                    location.pathname === item.path ||
                                    location.pathname.startsWith(`${item.path}/`);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={getNavItemClass(isActive)}
                                        title={item.label}
                                    >
                                        <div className="relative flex items-center justify-center shrink-0 w-6 h-7 ml-1">
                                            <item.icon size={24} className={`text-gray-500 dark:text-gray-400`} />

                                            {item.count > 0 && (
                                                <span className="absolute -top-1 -right-2 bg-main text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-[#09090b]">
                                                    {item.count}
                                                </span>
                                            )}
                                        </div>
                                        <span className={` text-[17px] truncate ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-inherit'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                    </nav>

                    <div className="w-full flex justify-center ">
                        <button className="bg-main text-white mt-4 h-10 w-full lg:h-[40px] rounded-full flex items-center justify-center hover:bg-main-hover transition-all shadow-md">
                            <Plus size={20} className={`text-white mr-1`} />
                            <span className=" text-[15px] font-bold">Post</span>
                        </button>
                    </div>
                </div>

                {/* User Profile / Logout section at bottom (Desktop) */}
                <div className="relative mt-auto w-full hidden md:block" ref={dropdownRef}>
                    {/* The Dropdown Menu */}
                    {isDesktopDropdownOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-[240px] bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-lg overflow-hidden z-50 py-2">
                            <button
                                onClick={() => { toggleTheme(); setIsDesktopDropdownOpen(false); }}
                                className="w-[95%] mx-auto rounded-2xl flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <Sun size={24} className={`text-gray-500 dark:text-gray-400`} />
                                        <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100">Light theme</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon size={24} className={`text-gray-500 dark:text-gray-400`} />
                                        <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100">Dark theme</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => { logout(); setIsDesktopDropdownOpen(false); }}
                                disabled={isLoggingOut}
                                className="w-[95%] flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-neutral-800 transition-colors text-left group rounded-2xl mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="ri-logout-box-r-line text-xl text-red-500 group-hover:text-red-600"></i>
                                <span className="text-[15px] font-medium text-red-500 group-hover:text-red-600">
                                    {isLoggingOut ? "Logging out..." : "Log out"}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* The Account Button */}
                    <div
                        className={`flex items-center justify-between p-2 rounded-full cursor-pointer transition-all w-full ${isDesktopDropdownOpen ? 'bg-gray-100 dark:bg-neutral-800' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
                        onClick={() => !isLoadingUser && user && setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                    >
                        {isLoadingUser || !user ? (
                            <div className="flex items-center gap-3 w-full pl-1">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                                    <Skeleton className="h-3 w-24 rounded" />
                                    <Skeleton className="h-2 w-16 rounded" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main shrink-0">
                                        {user?.username?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[14px] font-bold text-gray-900 dark:text-white truncate">
                                            {user?.name || "Fullname"}
                                        </span>
                                        <span className="text-[13px] text-gray-500 truncate">
                                            @{user?.username || 'user'}
                                        </span>
                                    </div>
                                </div>
                                <i className="ri-more-line  text-gray-900 dark:text-white text-[20px] shrink-0"></i>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md border-t border-gray-100 dark:border-[#1f1f1f] z-50 flex justify-around items-center h-[60px] pb-safe">
                {menuItems.filter(item =>
                    item.visibility.includes('mobile')).map((item) => {
                        const isActive = location.pathname.includes(item.path) || (item.path === '/feed' && location.pathname === '/');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex flex-col items-center justify-center w-full h-full relative"
                            >
                                <item.icon size={24} className={`text-2xl ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`} />
                                {item.count > 0 && (
                                    <span className="absolute top-2 right-1/4 bg-main text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-[#09090b]">
                                        {item.count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                {/* Profile Button for Mobile */}
                <button
                    onClick={() => !isLoadingUser && user && setIsMobileProfileSheetOpen(true)}
                    className="flex flex-col items-center justify-center w-full h-full relative"
                >
                    {isLoadingUser || !user ? (
                        <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main text-sm">
                            {user?.username?.[0].toUpperCase() || 'U'}
                        </div>
                    )}
                </button>
            </nav>

            {/* Mobile Profile Bottom Sheet */}
            <MobileProfileSheet
                isOpen={isMobileProfileSheetOpen}
                onClose={() => setIsMobileProfileSheetOpen(false)}
                user={user}
                onLogout={logout}
                isLoggingOut={isLoggingOut}
                menuItems={menuItems}
            />
        </>
    );
};

export default Navbar;

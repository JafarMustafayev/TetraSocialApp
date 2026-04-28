// src/components/layout/Navbar/NavActions.jsx
import React from 'react';
import NavNotificationsMenu from './NavNotificationsMenu';
import NavUserMenu from './NavUserMenu';
import { useTheme } from '../../../context/ThemeContext';

const NavActions = ({ 
    user, 
    notifications, 
    openDropdown, 
    setOpenDropdown, 
    onLogout, 
    onMobileSearchToggle 
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
            {/* Mobile Search Toggle */}
            <button
                onClick={onMobileSearchToggle}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-main transition-all active:scale-95"
            >
                <i className="ri-search-line text-xl"></i>
            </button>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="w-10 h-10 sm:w-[45px] sm:h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-main transition-all"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                <i className={`${theme === 'light' ? 'ri-moon-line' : 'ri-sun-line'} text-xl sm:text-[22px]`}></i>
            </button>

            {/* Notifications */}
            <NavNotificationsMenu 
                notifications={notifications}
                isOpen={openDropdown === 'notifications'}
                toggleDropdown={() => setOpenDropdown(openDropdown === 'notifications' ? null : 'notifications')}
            />

            {/* User Profile */}
            <NavUserMenu 
                user={user}
                isOpen={openDropdown === 'profile'}
                toggleDropdown={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                onLogout={onLogout}
            />
        </div>
    );
};

export default NavActions;

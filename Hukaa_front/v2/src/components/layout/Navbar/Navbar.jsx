// src/components/layout/Navbar/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavSearch from './NavSearch';
import NavActions from './NavActions';
import { LOGO } from '../../../api/api-config';

const Navbar = ({ onMenuClick }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [user, setUser] = useState(null);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
    };

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-[99%] ml-[0.5%] mr-[0.5%] h-[80px] mt-[5px] bg-[#2E40B7] shadow-lg z-1000 flex items-center px-4 lg:px-8 rounded-2xl">
            <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
                <div className="flex items-center gap-4 lg:gap-6">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-main transition-all active:scale-95"
                    >
                        <i className="ri-menu-2-line text-2xl"></i>
                    </button>

                    <Link to="/" className="shrink-0">
                        <img src={LOGO} alt="logo" className="h-[35px] md:h-[45px] w-auto" />
                    </Link>
                </div>

                <NavSearch 
                    isMobileSearchOpen={isMobileSearchOpen}
                    setIsMobileSearchOpen={setIsMobileSearchOpen}
                />

                <NavActions 
                    user={user}
                    notifications={[]} // Will be implemented with a real API later
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    onLogout={handleLogout}
                    onMobileSearchToggle={() => setIsMobileSearchOpen(true)}
                />
            </div>
        </nav>
    );
};

export default Navbar;

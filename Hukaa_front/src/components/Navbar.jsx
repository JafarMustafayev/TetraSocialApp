import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../api/client';

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

    return (
        <div className="fixed top-0 left-0 w-full z-999 bg-[#3644D9] shadow-[0_0_12px_rgba(0,0,0,0.12)]">
            {/* Desktop & Main Content Container */}
            <div className="p-[15px]">
                <nav className="flex items-center justify-between">
                    {/* Brand / Logo */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="flex items-center">
                            <img src="/src/assets/images/logo.png" alt="logo" className="max-w-full h-auto" />
                        </Link>
                    </div>

                    {/* Desktop Search Box (Hidden on small screens) */}
                    <div className="hidden lg:block relative w-[430px] mx-auto group">
                        <form className="relative">
                            <input
                                type="text"
                                className="w-full h-[50px] bg-[#2E3AB8] rounded-[50px] pl-[25px] pr-[60px] text-white placeholder-white placeholder:opacity-100 outline-none transition-all duration-400 focus:placeholder-transparent cursor-text"
                                placeholder="Search..."
                            />
                            <button type="submit" className="absolute right-0 top-0 h-full px-5 bg-transparent border-none text-white text-lg">
                                <i className="ri-search-line"></i>
                            </button>
                        </form>
                    </div>

                    {/* Right Side Options (Icons and Profile) */}
                    <div className="flex items-center space-x-2 md:space-x-4">

                        {/* Friend Requests Icon with Dropdown */}
                        <div className="relative group px-1 md:px-3" onClick={stopPropagation}>
                            <a
                                href="#"
                                onClick={(e) => toggleDropdown('friendRequests', e)}
                                className="relative block transition-transform duration-400 hover:translate-x-px"
                            >
                                <i className="flaticon-user text-white text-[25px]"></i>
                                <span className="absolute -top-[2px] -right-[5px] w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#3ED7FF] text-white text-[10px] font-bold">
                                    3
                                    <span className="absolute inset-0 rounded-full border border-[#3ED7FF] animate-ping opacity-75"></span>
                                </span>
                            </a>

                            {/* Dropdown Menu */}
                            <div className={`absolute right-0 mt-[20px] min-w-[310px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-50 rounded-sm transition-all duration-300 transform origin-top ${openDropdown === 'friendRequests' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-[10px]'}`}>
                                <div className="p-[15px] flex justify-between items-center border-b border-gray-50 bg-gray-50/30">
                                    <h3 className="text-[16px] font-bold text-[#515355] m-0">Friend Requests</h3>
                                    <i className="flaticon-menu text-[#727E8C] text-[18px] cursor-pointer hover:text-[#3644D9] transition-colors"></i>
                                </div>
                                <div className="p-[15px] max-h-[400px] overflow-y-auto">
                                    <div className="flex items-center mb-[20px] last:mb-0 group/item">
                                        <div className="shrink-0 relative">
                                            <img src="/src/assets/images/user/user-2.jpg" alt="user" className="w-[55px] h-[55px] rounded-full border border-gray-100" />
                                        </div>
                                        <div className="ml-[12px] flex-1 flex justify-between items-center">
                                            <div>
                                                <h4 className="text-[15px] font-bold text-[#515355] m-0 hover:text-[#3644D9] transition-colors"><a href="#">Sandra Cross</a></h4>
                                                <span className="text-[#6B7C8F] text-[13px] mt-[2px] block">26 Friends</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="w-[28px] h-[28px] flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"><i className="ri-close-line"></i></button>
                                                <button className="w-[28px] h-[28px] flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-[#3644D9] hover:text-white hover:border-[#3644D9] transition-all duration-300"><i className="ri-check-line"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/friends" className="block w-full text-center py-3 bg-[#3644D9] text-white text-[14px] font-bold rounded-md hover:bg-[#2E3AB8] transition-colors duration-400 shadow-sm" onClick={() => setOpenDropdown(null)}>View All Requests</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Icon with Dropdown */}
                        <div className="relative group px-1 md:px-3" onClick={stopPropagation}>
                            <a
                                href="#"
                                onClick={(e) => toggleDropdown('messages', e)}
                                className="relative block transition-transform duration-400 hover:translate-x-px"
                            >
                                <i className="flaticon-email text-white text-[25px]"></i>
                                <span className="absolute -top-[2px] -right-[5px] w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#1CCD16] text-white text-[9px] font-bold">
                                    2
                                    <span className="absolute inset-0 rounded-full border border-[#1CCD16] animate-pulse opacity-75"></span>
                                </span>
                            </a>

                            <div className={`absolute right-0 mt-[20px] min-w-[310px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-50 rounded-sm transition-all duration-300 transform origin-top ${openDropdown === 'messages' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-[10px]'}`}>
                                <div className="p-[15px] flex justify-between items-center border-b border-gray-50 bg-gray-50/30">
                                    <h3 className="text-[16px] font-bold text-[#515355] m-0">Messages</h3>
                                    <i className="flaticon-menu text-[#727E8C] text-[18px] cursor-pointer hover:text-[#3644D9]"></i>
                                </div>
                                <div className="p-[15px]">
                                    <div className="relative w-full mb-4">
                                        <input type="text" className="w-full h-[40px] bg-[#F4F7FC] rounded-[30px] pl-[15px] pr-[40px] text-[13px] text-[#6B7C8F] outline-none border-none" placeholder="Search..." />
                                        <button className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#6B7C8F]"><i className="ri-search-line"></i></button>
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto">
                                        <div className="flex items-center mb-[15px] last:mb-0">
                                            <div className="shrink-0 relative">
                                                <img src="/src/assets/images/user/user-11.jpg" alt="user" className="w-[50px] h-[50px] rounded-full" />
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <div className="ml-[12px] w-[210px]">
                                                <h4 className="text-[14px] font-bold text-[#515355] m-0 hover:text-[#3644D9] transition-colors"><a href="#">James Vanwin</a></h4>
                                                <span className="text-[#6B7C8F] text-[13px] mt-1 block truncate w-full">Hello Dear I Want Talk To You</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/messages" className="block w-full text-center py-3 bg-[#3644D9] text-white text-[14px] font-bold rounded-md hover:bg-[#2E3AB8] transition-colors" onClick={() => setOpenDropdown(null)}>View All Messages</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications Icon with Dropdown */}
                        <div className="relative group px-1 md:px-3" onClick={stopPropagation}>
                            <a
                                href="#"
                                onClick={(e) => toggleDropdown('notifications', e)}
                                className="relative block transition-transform duration-400 hover:translate-x-px"
                            >
                                <i className="flaticon-bell text-white text-[25px]"></i>
                                <span className="absolute -top-[2px] -right-[5px] w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#FF3E3E] text-white text-[9px] font-bold">
                                    1
                                </span>
                            </a>

                            <div className={`absolute right-0 mt-[20px] min-w-[325px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-50 rounded-sm transition-all duration-300 transform origin-top ${openDropdown === 'notifications' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-[10px]'}`}>
                                <div className="p-[15px_15px_20px] flex justify-between items-center border-b border-gray-50 bg-gray-50/30">
                                    <h3 className="text-[16px] font-bold text-[#515355] m-0">Notifications</h3>
                                    <i className="flaticon-menu text-[#727E8C] text-[18px] cursor-pointer hover:text-[#3644D9]"></i>
                                </div>
                                <div className="p-[15px] max-h-[350px] overflow-y-auto">
                                    <div className="flex items-center mb-[20px] last:mb-0">
                                        <div className="shrink-0 relative">
                                            <div className="w-[50px] h-[50px] rounded-full bg-blue-100 flex items-center justify-center text-[#3644D9]">
                                                <i className="ri-chat-3-line text-xl"></i>
                                            </div>
                                        </div>
                                        <div className="ml-[12px] flex-1">
                                            <h4 className="text-[14px] font-bold text-[#515355] m-0"><a href="#" className="hover:text-[#3644D9]">James Vanwin</a></h4>
                                            <span className="text-[#6B7C8F] text-[13px] mt-1 block leading-tight">Posted A Comment On Your Status</span>
                                            <span className="text-[#3644D9] text-[12px] mt-1 block font-bold">20 Minutes Ago</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link to="/notifications" className="block w-full text-center py-3 bg-[#3644D9] text-white text-[14px] font-bold rounded-md hover:bg-[#2E3AB8] transition-colors" onClick={() => setOpenDropdown(null)}>View All Notifications</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Section with Dropdown */}
                        <div className="pl-2 md:pl-4 border-l border-white/20" onClick={stopPropagation}>
                            <div className="relative">
                                <a
                                    href="#"
                                    onClick={(e) => toggleDropdown('profile', e)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="relative flex items-center group cursor-pointer transition-transform duration-400 hover:-translate-y-px">
                                        <img
                                            src={user?.profilePhoto ? `${IMAGE_BASE_URL}/${user.profilePhoto}` : "/src/assets/images/user/user-1.jpg"}
                                            alt="profile"
                                            className="w-10 h-10 object-cover rounded-full border-2 border-white/20 shadow-sm"
                                        />
                                        <span className="hidden lg:block text-white text-[15px] font-bold ml-3 mr-1">{user?.username || 'Matthew'}</span>
                                        <i className="ri-arrow-down-s-line text-white/50 ml-1 hidden lg:block"></i>
                                    </div>
                                </a>

                                {/* Dropdown Menu */}
                                <div className={`absolute right-0 mt-[25px] w-[250px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 rounded-md overflow-hidden transition-all duration-300 transform origin-top ${openDropdown === 'profile' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-[10px]'}`}>
                                    <div className="p-2 border-b border-gray-50 bg-[#F9FBFF]">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <img
                                                src={user?.profilePhoto ? `${IMAGE_BASE_URL}/${user.profilePhoto}` : "/src/assets/images/user/user-1.jpg"}
                                                alt="user"
                                                className="w-12 h-12 object-cover rounded-full ring-2 ring-white shadow-sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[17px] font-bold text-[#515355] truncate m-0">{user?.username || 'Matthew Turner'}</h3>

                                            </div>
                                        </div>


                                    </div>
                                    <ul className="py-2 list-none m-0">
                                        <li>
                                            <Link to="/profile" className="flex items-center  py-3 text-[#515355] text-[14px] font-bold  hover:text-[#3644D9] transition-all duration-300" onClick={() => setOpenDropdown(null)}>
                                                <i className="flaticon-user mr-4 text-lg opacity-70"></i>
                                                My Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/settings" className="flex items-center py-3 text-[#515355] text-[14px] font-bold  hover:text-[#3644D9] transition-all duration-300" onClick={() => setOpenDropdown(null)}>
                                                <i className="flaticon-settings mr-4 text-lg opacity-70"></i>
                                                Setting
                                            </Link>
                                        </li>

                                        <li className=" border-gray-100">
                                            <Link to="/archived" className="flex items-center  py-3   hover:text-red-500 text-[14px] font-bold  transition-all duration-300">
                                                <i className="flaticon-private mr-4 text-lg"></i>
                                                Archived posts
                                            </Link>
                                        </li>

                                        <li className=" border-gray-100">
                                            <Link to="/logout" className="flex items-center  py-3   hover:text-red-500 text-[14px] font-bold  transition-all duration-300" onClick={handleLogout}>
                                                <i className="flaticon-logout mr-4 text-lg"></i>
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Search - Bottom Bar (Optional based on design needs) */}
            <div className="lg:hidden px-[15px] pb-[15px]">
                <form className="relative">
                    <input
                        type="text"
                        className="w-full h-[40px] bg-[#2E3AB8] rounded-[50px] pl-[20px] pr-[50px] text-white placeholder-white placeholder:opacity-100 outline-none flex items-center text-sm"
                        placeholder="Search..."
                    />
                    <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-transparent border-none text-white text-lg">
                        <i className="ri-search-line"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Navbar;

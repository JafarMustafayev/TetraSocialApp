import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL, USER_AVATAR, LOGO } from '../api/client';
import { searchProfiles } from '../api/profile';
import { useTheme } from '../context/ThemeContext';
import ListSkeleton from './Skeleton/ListSkeleton';
import { useNotifications } from '../context/NotificationContext';
import moment from 'moment';

const Navbar = ({ onMenuClick }) => {
    const { notifications, acceptRequest, rejectRequest } = useNotifications();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchTimeout = useRef(null);

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
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
                setIsMobileSearchOpen(false);
            }
            if (openDropdown) setOpenDropdown(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openDropdown]);

    const stopPropagation = (e) => e.stopPropagation();

    // Debounced search logic
    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (searchQuery.trim().length > 0) {
            setIsSearching(true);
            setShowResults(true);
            searchTimeout.current = setTimeout(async () => {
                try {
                    const response = await searchProfiles(searchQuery);
                    if (response.success) {
                        setSearchResults(response.data);
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsSearching(false);
                }
            }, 500); // 0.5-second delay
        } else {
            setSearchResults([]);
            setShowResults(false);
            setIsSearching(false);
        }

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchQuery]);

    // Focus search input when opened on mobile
    useEffect(() => {
        if (isMobileSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [isMobileSearchOpen]);

    const handleSearchResultClick = (userId) => {
        setSearchQuery('');
        setShowResults(false);
        navigate(`/profile/${userId}`);
    };

    const getThemeIcon = () => {
        if (theme === 'light') return 'ri-sun-line';
        if (theme === 'dark') return 'ri-moon-line';
        return 'ri-contrast-line'; // auto
    };

    const handleThemeToggle = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('auto');
        else setTheme('light');
    };

    return (
        <nav className="fixed top-0 left-0 w-[99%] ml-[0.5%] mr-[0.5%] h-[80px] mt-[5px] bg-main shadow-lg z-1000 flex items-center px-4 lg:px-8 rounded-2xl">
            <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Mobile Menu Button - NEW */}
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

                {/* Desktop Search Bar */}
                <div className="hidden md:block relative group flex-1 md:flex-none lg:ml-12" ref={searchRef}>
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.trim() && setShowResults(true)}
                            className="w-[300px] lg:w-[450px] h-[45px] bg-white/10 border border-white/20 rounded-full pl-12 pr-5 text-white placeholder-white/60 focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 outline-none transition-all duration-300"
                            placeholder="Search everything..."
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-gray-400">
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <i className="ri-search-line text-xl"></i>
                            )}
                        </div>

                        {/* Desktop Search Results */}
                        {showResults && !isMobileSearchOpen && (
                            <div className="absolute top-full left-0 mt-3 w-full animate-fade-in-up">
                                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800 text-sm">Search Results</h3>
                                        {isSearching && <span className="text-xs text-main animate-pulse font-medium">Searching...</span>}
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                                        {isSearching ? (
                                            <ListSkeleton count={2} showButton={false} />
                                        ) : (
                                            searchResults.map((result) => (
                                                <div
                                                    key={result.id}
                                                    onClick={() => handleSearchResultClick(result.id)}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                                                >
                                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                                                        <img
                                                            src={result.profileImageUrl ? `${IMAGE_BASE_URL}/${result.profileImageUrl}` : USER_AVATAR}
                                                            alt={result.userName}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-main transition-colors">{result.userName}</h4>
                                                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">View Profile</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                {isMobileSearchOpen && (
                    <div className="fixed top-[5px] left-[0.5%] w-[99%] h-[80px] bg-main backdrop-blur-xl z-50 flex items-center px-4 rounded-2xl animate-fade-in shadow-2xl md:hidden" ref={searchRef}>
                        <button
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="mr-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:scale-90"
                        >
                            <i className="ri-arrow-left-line text-2xl"></i>
                        </button>
                        <div className="relative flex-1">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[50px] bg-white/10 border border-white/20 rounded-full pl-12 pr-5 text-white placeholder-white/60 outline-none"
                                placeholder="Search everything..."
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                                <i className="ri-search-line text-xl"></i>
                            </div>

                            {/* Mobile Search Results Dropdown */}
                            {showResults && (
                                <div className="fixed top-[90px] left-[0.5%] w-[99%] z-50 animate-fade-in-up">
                                    <div className="bg-white w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden max-h-[70vh] flex flex-col">
                                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                            <h3 className="font-bold text-gray-800 text-sm">Search Results</h3>
                                            {isSearching && <span className="text-xs text-main animate-pulse font-medium">Searching...</span>}
                                        </div>
                                        <div className="overflow-y-auto custom-scrollbar p-2">
                                            {isSearching ? (
                                                <ListSkeleton count={2} showButton={false} />
                                            ) : searchResults.length > 0 ? (
                                                searchResults.map((result) => (
                                                    <div
                                                        key={result.id}
                                                        onClick={() => handleSearchResultClick(result.id)}
                                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group"
                                                    >
                                                        <img
                                                            src={result.profileImageUrl ? `${IMAGE_BASE_URL}/${result.profileImageUrl}` : USER_AVATAR}
                                                            className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                                                            alt={result.userName}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-gray-800 group-hover:text-main">{result.userName}</h4>
                                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">View Profile</p>
                                                        </div>
                                                        <i className="ri-arrow-right-s-line text-gray-300 group-hover:text-main text-xl"></i>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-10 text-center">
                                                    <p className="text-sm text-gray-400 font-bold">No results found for "{searchQuery}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Right Side Icons & Profile */}
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
                    {/* Mobile Search Toggle */}
                    {!isMobileSearchOpen && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsMobileSearchOpen(true); }}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-main transition-all active:scale-95"
                        >
                            <i className="ri-search-line text-xl"></i>
                        </button>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={handleThemeToggle}
                        className="w-10 h-10 sm:w-[45px] sm:h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-main transition-all"
                        title={`Theme: ${theme}`}
                    >
                        <i className={`${getThemeIcon()} text-xl sm:text-[22px]`}></i>
                    </button>



                    {/* Notifications Dropdown */}
                    <div className="blok md:hidden relative" onClick={stopPropagation}>
                        <button
                            onClick={(e) => toggleDropdown('notifications', e)}
                            className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-main transition-all relative"
                        >
                            <i className="ri-notification-3-line text-[22px]"></i>
                            {notifications.length > 0 && (
                                <span className="absolute -top-[2px] -right-[2px] w-5 h-5 flex items-center justify-center rounded-full bg-[#FF3E3E] text-white text-[10px] font-bold border-2 border-main">
                                    {notifications.length > 9 ? '9+' : notifications.length}
                                </span>
                            )}
                        </button>

                        <div className={`absolute right-0 top-full mt-4 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform origin-top ${openDropdown === 'notifications' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                <h3 className="font-bold text-gray-800 text-sm m-0">Notifications</h3>
                                <Link to="/notifications" className="text-[10px] text-main font-bold hover:underline uppercase tracking-wider text-muted">View All</Link>
                            </div>
                            <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.slice(0, 3).map((notif) => {
                                        let payload = {};
                                        try { payload = JSON.parse(notif.payload); } catch { }
                                        const userId = payload.ByUserId;
                                        const img = payload.ByUserProfileImageUrl;
                                        const userImg = img ? `${IMAGE_BASE_URL}/${img}` : USER_AVATAR;
                                        const time = moment(notif.createdAt).fromNow();
                                        return (
                                            <div key={notif.notificationId} className="relative group/item">
                                                <Link
                                                    to={notif.type === 4 ? '/notifications' : (payload.PostId ? `/posts/${payload.PostId}` : `/profile/${userId}`)}
                                                    className="p-3 flex items-start gap-3 hover:bg-gray-50 rounded-xl transition-colors"
                                                    onClick={() => setOpenDropdown(null)}
                                                >
                                                    <div className="shrink-0">
                                                        <img src={userImg} className="w-10 h-10 rounded-full object-cover border border-gray-100" alt="user" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-gray-800 truncate leading-tight">
                                                            {payload.ByUserName || 'System'}
                                                        </h4>
                                                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{notif.title}</p>
                                                        <span className="text-[9px] font-bold text-main uppercase mt-1 block">{time}</span>
                                                    </div>
                                                </Link>

                                                {notif.type === 4 && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); rejectRequest(userId, notif.notificationId); }}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all transition-colors"
                                                            title="Reject"
                                                        >
                                                            <i className="ri-close-line text-sm"></i>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); acceptRequest(userId, notif.notificationId); }}
                                                            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 text-main hover:bg-main hover:text-white transition-all transition-colors"
                                                            title="Accept"
                                                        >
                                                            <i className="ri-check-line text-sm"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center opacity-40">
                                        <i className="ri-notification-off-line text-2xl block mb-1"></i>
                                        <p className="text-xs italic">No new notifications</p>
                                    </div>
                                )}
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
                            <div className="px-5 py-3">
                                <span className="block text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</span>
                                <span className="text-xs text-gray-400 truncate block">@{user?.username}</span>
                            </div>

                            {user?.isAdmin && (
                                <div className=" py-2">
                                    <Link target='_blank' to="/dashboard" className="w-[95%] mx-auto flex items-center px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-all group border border-gray-200 rounded-lg">
                                        <i className="ri-dashboard-line mr-3 text-lg text-gray-400 group-hover:text-gray-500"></i>
                                        Dashboard
                                    </Link>
                                </div>
                            )}

                            <div className=" pt-2">
                                <button onClick={handleLogout} className="w-[95%] mx-auto flex items-center px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all group border border-gray-200 rounded-lg">
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

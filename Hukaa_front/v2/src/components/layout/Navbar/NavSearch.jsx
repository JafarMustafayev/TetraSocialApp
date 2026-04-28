// src/components/layout/Navbar/NavSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../../api/client';
import { API_BASE_URL, USER_AVATAR } from '../../../api/api-config';
import SearchSkeleton from './SearchSkeleton';

const NavSearch = ({ isMobileSearchOpen, setIsMobileSearchOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchTimeout = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (searchQuery.trim().length > 0) {
            setIsSearching(true);
            setShowResults(true);
            searchTimeout.current = setTimeout(async () => {
                try {
                    const response = await fetchClient(`/api/Profile/Search?searchTerm=${searchQuery}`);
                    if (response.Success) {
                        setSearchResults(response.Data);
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    setIsSearching(false);
                }
            }, 500);
        } else {
            setSearchResults([]);
            setShowResults(false);
            setIsSearching(false);
        }

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchResultClick = (userId) => {
        setSearchQuery('');
        setShowResults(false);
        setIsMobileSearchOpen(false);
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="relative group flex-1 md:flex-none lg:ml-12" ref={searchRef}>
            {/* Desktop Search Input */}
            <div className="hidden md:block relative w-full md:w-auto">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setShowResults(true)}
                    className="w-[300px] lg:w-[450px] h-[45px] bg-white/10 border border-white/20 rounded-full pl-12 pr-5 text-white placeholder-white/60 focus:bg-white focus:text-gray-800 focus:placeholder-gray-400 outline-none transition-all duration-300"
                    placeholder="Search everything..."
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-gray-400">
                    <i className="ri-search-line text-xl"></i>
                </div>

                {/* Desktop Search Results */}
                {showResults && (
                    <div className="absolute top-full left-0 mt-3 w-full animate-fade-in-up z-50">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 text-sm">Search Results</h3>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                                {isSearching ? (
                                    <>

                                        <SearchSkeleton count={5} />
                                    </>
                                ) : (
                                    searchResults.map((result) => (
                                        <div
                                            key={result.Id}
                                            onClick={() => handleSearchResultClick(result.Id)}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                                                <img
                                                    src={result.ProfileImageUrl ? `${API_BASE_URL}/${result.ProfileImageUrl}` : USER_AVATAR}
                                                    alt={result.UserName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-main transition-colors">{result.UserName}</h4>
                                                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">View Profile</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {!isSearching && searchResults.length === 0 && searchQuery.trim() !== '' && (
                                    <div className="p-4 text-center text-sm text-gray-400">No results found</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Search Overlay logic is handled in the parent Navbar or here */}
            {isMobileSearchOpen && (
                <div className="fixed top-[5px] left-[0.5%] w-[99%] h-[80px] bg-[#2E40B7] backdrop-blur-xl z-50 flex items-center px-4 rounded-2xl animate-fade-in shadow-2xl md:hidden">
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
                            autoFocus
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                            <i className="ri-search-line text-xl"></i>
                        </div>

                        {/* Mobile Search Results */}
                        {showResults && (
                            <div className="fixed top-[90px] left-[0.5%] w-[99%] z-50 animate-fade-in-up">
                                <div className="bg-white w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[70vh] flex flex-col">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800 text-sm">Search Results</h3>
                                    </div>
                                    <div className="overflow-y-auto custom-scrollbar p-2">
                                        {isSearching ? (
                                            <>
                                                <div className="space-y-2">
                                                    <SearchSkeleton count={5} />
                                                </div>

                                            </>
                                        ) : (
                                            searchResults.map((result) => (
                                                <div
                                                    key={result.Id}
                                                    onClick={() => handleSearchResultClick(result.Id)}
                                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group"
                                                >
                                                    <img
                                                        src={result.ProfileImageUrl ? `${API_BASE_URL}/${result.ProfileImageUrl}` : USER_AVATAR}
                                                        className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                                                        alt={result.UserName}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-main">{result.UserName}</h4>
                                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">View Profile</p>
                                                    </div>
                                                    <i className="ri-arrow-right-s-line text-gray-300 group-hover:text-main text-xl"></i>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavSearch;

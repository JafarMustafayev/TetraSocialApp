// src/components/widgets/SuggestedUsersWidget.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { suggestedUsers } from '../../utils/mockData';

const SuggestedUsersWidget = ({ count = 5 }) => {
    const [displayedUsers, setDisplayedUsers] = useState(() => suggestedUsers.slice(0, count));
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [followedIds, setFollowedIds] = useState([]);

    const handleRefresh = (e) => {
        e.preventDefault();
        if (isRefreshing) return;
        setIsRefreshing(true);

        setTimeout(() => {
            // Pick a random set of users without duplicates
            const shuffled = [...suggestedUsers].sort(() => 0.5 - Math.random());
            setDisplayedUsers(shuffled.slice(0, count));
            setIsRefreshing(false);
        }, 600);
    };

    const toggleFollow = (userId, e) => {
        e.preventDefault();
        e.stopPropagation();
        setFollowedIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <div className="bg-white dark:bg-[#09090b] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-main/10 dark:bg-main/20 flex items-center justify-center text-main">
                        <i className="ri-user-add-line text-[16px]"></i>
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">Who to follow</h3>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-main hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-all cursor-pointer"
                        title="Refresh suggestions"
                        disabled={isRefreshing}
                    >
                        <i className={`ri-refresh-line text-[16px] block ${isRefreshing ? 'animate-spin text-main' : ''}`}></i>
                    </button>

                </div>
            </div>

            <div className="space-y-4.5">
                {isRefreshing ? (
                    // Skeleton loader state inside the widget card container
                    [...Array(count)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-1 animate-pulse">
                            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800/60" />
                                <div className="min-w-0 flex-1">
                                    <div className="w-24 h-3.5 bg-gray-100 dark:bg-gray-800/60 rounded mb-2" />
                                    <div className="w-16 h-2.5 bg-gray-100/80 dark:bg-gray-800/40 rounded" />
                                </div>
                            </div>
                            <div className="w-16 h-7 bg-gray-100 dark:bg-gray-800/60 rounded-full" />
                        </div>
                    ))
                ) : (
                    displayedUsers.map((user) => {
                        const isFollowing = followedIds.includes(user.id);
                        const getInitials = (name) => name ? name[0].toUpperCase() : 'U';

                        return (
                            <div
                                key={user.id}
                                className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-gray-50/80 dark:hover:bg-[#16181c]/40 transition-all duration-200"
                            >
                                <Link
                                    to={`/${user.username}`}
                                    className="flex items-center gap-3 min-w-0 flex-1 mr-2"
                                >
                                    <div className="relative shrink-0">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                className="w-10 h-10 rounded-full object-cover bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-[#2d2d2d] group-hover:scale-105 transition-transform duration-200"
                                                alt={user.name}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-main/10 dark:bg-main/25 flex items-center justify-center font-bold text-main shrink-0 text-sm group-hover:scale-105 transition-transform duration-200">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#09090b] rounded-full"></span>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[13.5px] font-bold text-gray-900 dark:text-white truncate group-hover:text-main transition-colors leading-tight">
                                            {user.name}
                                        </h4>
                                        <p className="text-[12px] text-gray-500 truncate mt-0.5">
                                            @{user.username}
                                        </p>
                                    </div>
                                </Link>

                                <button
                                    onClick={(e) => toggleFollow(user.id, e)}
                                    className={`px-4 py-1.5 rounded-full font-bold text-[12px] tracking-wide transition-all duration-200 shrink-0 cursor-pointer ${isFollowing
                                            ? 'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50/10'
                                            : 'bg-main text-white hover:bg-main/90 hover:shadow-sm hover:shadow-main/20 active:scale-95'
                                        }`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SuggestedUsersWidget;


// src/components/ui/UserListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserListItem = ({ user, currentUser, onToggleFollow }) => {
    if (!user) return null;

    const getInitials = (name) => {
        return name ? name[0].toUpperCase() : 'U';
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#1f1f1f] hover:bg-gray-50/50 dark:hover:bg-[#16181c]/30">
            <Link to={`/${user.username}`} className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main shrink-0 text-sm">
                    {getInitials(user.name)}
                </div>
                <div className="min-w-0 flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white truncate hover:underline text-[14px]">
                        {user.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-gray-500 truncate">@{user.username}</span>
                        {user.followsYou && (
                            <span className="text-[10px] bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-gray-500 font-semibold shrink-0">
                                Follows you
                            </span>
                        )}
                    </div>
                </div>
            </Link>
            {user.username !== currentUser?.username && (
                <button
                    onClick={() => onToggleFollow && onToggleFollow(user)}
                    className={`px-4 py-1.5 rounded-full font-bold text-[13px] transition-colors duration-200 cursor-pointer ${
                        user.isFollowing
                            ? 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50/10'
                            : 'bg-main text-white hover:bg-main-hover'
                    }`}
                >
                    {user.isFollowing ? 'Following' : 'Follow'}
                </button>
            )}
        </div>
    );
};

export default UserListItem;

// src/components/feed/PostCard.jsx
import React from 'react';
import { API_BASE_URL, USER_AVATAR } from '../../api/api-config';

const PostCard = ({ post }) => {
    return (
        <div className="bg-white dark:bg-[#161a29] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-5 overflow-hidden transition-all hover:shadow-md">
            {/* Post Header */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={post.UserProfileImageUrl ? `${API_BASE_URL}/${post.UserProfileImageUrl}` : USER_AVATAR}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                        alt={post.ByUserName}
                    />
                    <div>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white leading-none">{post.ByUserName || 'Anonymous'}</h4>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1 block">2 hours ago</span>
                    </div>
                </div>
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 transition-all">
                    <i className="ri-more-2-line text-xl"></i>
                </button>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.Content}
                </p>
            </div>

            {/* Post Actions */}
            <div className="px-5 py-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 group">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <i className="ri-heart-line text-lg"></i>
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors">12</span>
                    </button>
                    <button className="flex items-center gap-2 group">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 group-hover:bg-main group-hover:text-white transition-all">
                            <i className="ri-chat-3-line text-lg"></i>
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-main transition-colors">4</span>
                    </button>
                </div>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-[#0b0f1a] text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all">
                    <i className="ri-share-forward-line text-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default PostCard;

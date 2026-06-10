import React, { useState } from 'react';
import { API_BASE_URL, USER_AVATAR } from '../../api/api-config';

const PostCard = ({ post }) => {
    const [expanded, setExpanded] = useState(false);

    // Parse content for @mentions and #hashtags
    const parseContent = (text) => {
        if (!text) return null;

        // Split by both @mentions and #hashtags, keeping the match
        const parts = text.split(/(@\w+|#\w+)/g);

        return parts.map((part, index) => {
            if (part.startsWith('@') || part.startsWith('#')) {
                return (
                    <span key={index} className="text-main hover:underline cursor-pointer">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    const isLongText = post.Content?.length > 280 || (post.Content?.match(/\n/g) || []).length > 4;

    return (
        <article className="bg-white dark:bg-[#09090b] border-b border-gray-100 dark:border-[#1f1f1f] p-4 flex gap-3 transition-colors hover:bg-gray-50 dark:hover:bg-[#16181c] cursor-pointer">
            {/* Avatar */}
            <div className="shrink-0">
                <img
                    src={post.UserProfileImageUrl ? `${API_BASE_URL}/${post.UserProfileImageUrl}` : USER_AVATAR}
                    className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-800"
                    alt={post.ByUserName}
                />
            </div>

            {/* Right side content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[15px] truncate">
                        <span className="font-bold text-gray-900 dark:text-white hover:underline truncate">
                            {post.ByUserName || 'Anonymous'}
                        </span>
                        <span className="text-gray-500 truncate hidden sm:inline-block">
                            @{post.ByUserName?.replace(/\s+/g, '').toLowerCase() || 'user'}
                        </span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 hover:underline">2h</span>
                    </div>
                    <button className="w-8 h-8 rounded-full hover:bg-main/10 text-gray-500 hover:text-main flex items-center justify-center transition-colors -mr-2 shrink-0">
                        <i className="ri-more-line text-xl"></i>
                    </button>
                </div>

                {/* Post Body */}
                <div className="text-[15px] text-gray-900 dark:text-white mt-0.5 whitespace-pre-wrap leading-normal break-words">
                    <div className={expanded ? '' : 'line-clamp-4'}>
                        {parseContent(post.Content)}
                    </div>
                    {isLongText && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                            className="text-main hover:underline mt-1 text-[15px] font-medium block"
                        >
                            {expanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 text-gray-500 max-w-md">
                    <button className="flex items-center gap-1 group hover:text-main transition-colors">
                        <div className="w-8 h-8 rounded-full group-hover:bg-main/10 flex items-center justify-center transition-colors">
                            <i className="ri-chat-1-line text-[18px]"></i>
                        </div>
                        <span className="text-[13px]">4</span>
                    </button>

                    <button className="flex items-center gap-1 group hover:text-red-500 transition-colors">
                        <div className="w-8 h-8 rounded-full group-hover:bg-red-500/10 flex items-center justify-center transition-colors">
                            <i className="ri-heart-line text-[18px]"></i>
                        </div>
                        <span className="text-[13px]">12</span>
                    </button>

                    <button className="w-8 h-8 rounded-full hover:bg-main/10 hover:text-main flex items-center justify-center transition-colors">
                        <i className="ri-bookmark-line text-[18px]"></i>
                    </button>



                    <button className="flex items-center gap-1 group hover:text-main transition-colors">
                        <div className="w-8 h-8 rounded-full group-hover:bg-main/10 flex items-center justify-center transition-colors">
                            <i className="ri-share-forward-line text-[18px]"></i>
                        </div>
                        <span className="text-[13px]">4</span>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default PostCard;

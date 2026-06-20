// src/components/feed/repost-card.jsx
import React from 'react';
import { API_BASE_URL, USER_AVATAR } from '../../api/apiConfig';
import { getTimeAgo, formatUtcToLocal } from '../../utils/dateFormatter';
import PostContent from './PostContent';

const RepostCard = ({ post, isDetail = false }) => {
    if (!post) return null;

    const [expanded, setExpanded] = React.useState(false);
    const isLongText = post.Content?.length > 280 || (post.Content?.match(/\n/g) || []).length > 4;

    return (
        <div className="border border-gray-150 dark:border-zinc-800 rounded-2xl p-4 mt-3 hover:bg-gray-50/50 dark:hover:bg-[#16181c]/30 transition-all duration-200 text-left">
            {/* Header: Avatar, Name, Username, Time */}
            <div className="flex items-center gap-2 mb-2 text-[14px]">
                <img
                    src={post.UserProfileImageUrl ? `${API_BASE_URL}/${post.UserProfileImageUrl}` : USER_AVATAR}
                    className="w-5 h-5 rounded-full object-cover bg-gray-200 dark:bg-gray-800"
                    alt={post.ByUserName}
                />
                <span className="font-bold text-gray-900 dark:text-white hover:underline truncate">
                    {post.ByUserName || 'Anonymous'}
                </span>
                <span className="text-gray-500 truncate hidden sm:inline-block">
                    @{post.ByUserName?.replace(/\s+/g, '').toLowerCase() || 'user'}
                </span>
                <span className="text-gray-500">·</span>
                <time
                    className="text-gray-500 text-[13px]"
                    datetime={post.CreatedAt}
                    title={post.CreatedAt ? formatUtcToLocal(post.CreatedAt) : ''}
                >
                    {getTimeAgo(post.CreatedAt) || post.TimeAgo}
                </time>
            </div>

            {/* Repost Content & Media (collapsible unless on detail view) */}
            <PostContent
                content={post.Content}
                media={post.Media}
                expanded={isDetail ? true : expanded}
                isLongText={isDetail ? false : isLongText}
                setExpanded={isDetail ? undefined : setExpanded}
            />
        </div>
    );
};

export default RepostCard;

// src/components/feed/PostCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, USER_AVATAR } from '../../api/apiConfig';
import { getTimeAgo, formatUtcToLocal } from '../../utils/dateFormatter';
import PostContent from './PostContent';
import RepostCard from './RepostCard';

import {
    MessageCircle,
    Repeat2,
    Heart,
    Bookmark,
    Forward,
    MoreHorizontal,
} from 'lucide-react';

const PostCard = ({ post, isDetail = false }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const isLongText = post.Content?.length > 280 || (post.Content?.match(/\n/g) || []).length > 4;

    const handleCardClick = (e) => {
        if (isDetail) return;
        const selection = window.getSelection().toString();
        if (selection) return;
        const isInteractive = e.target.closest('button, a, img, video, span, pre, code');
        if (!isInteractive) {
            navigate(`/post/${post.Id}`);
        }
    };

    return (
        <article
            onClick={handleCardClick}
            className={`bg-white dark:bg-[#09090b] border-b border-gray-100 dark:border-[#1f1f1f] p-4 flex gap-3 transition-colors ${isDetail ? 'cursor-default' : 'hover:bg-gray-50 dark:hover:bg-[#16181c] cursor-pointer'
                }`}
        >
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
                        <time
                            datetime={post.CreatedAt}
                            title={post.CreatedAt ? formatUtcToLocal(post.CreatedAt) : ''}
                        >
                            {getTimeAgo(post.CreatedAt) || post.TimeAgo}
                        </time>
                    </div>
                    <button className="w-8 h-8 rounded-xl hover:bg-main/10 text-gray-500 hover:text-main flex items-center justify-center transition-colors -mr-2 shrink-0">
                        <MoreHorizontal size={15} />
                    </button>
                </div>

                {/* Post Body */}
                <div className="text-[15px]  text-gray-900 dark:text-white mt-0.5 leading-normal break-words [overflow-wrap:anywhere] [word-break:break-word]">
                    <PostContent
                        content={post.Content}
                        media={post.Media}
                        expanded={isDetail ? true : expanded}
                        isLongText={isDetail ? false : isLongText}
                        setExpanded={isDetail ? undefined : setExpanded}
                    />

                    {/* Repost Card */}
                    {(post.RepostedPost || post.ParentPost) && (
                        <RepostCard post={post.RepostedPost || post.ParentPost} isDetail={isDetail} />
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between my-3  text-gray-500 ">
                    <div className='flex items-center gap-6'>
                        <button className="flex items-center gap-1 group hover:text-red-500 transition-colors">
                            <div className="flex items-center justify-center transition-colors">
                                <Heart size={20} />
                            </div>
                            <span className="text-[14px]">12</span>
                        </button>
                        <button className="flex items-center gap-1 group hover:text-main transition-colors">
                            <div className="flex items-center justify-center transition-colors">
                                <Forward size={20} />
                            </div>
                            <span className="text-[14px]">12</span>
                        </button>

                        <button className="flex items-center gap-1 group hover:text-main transition-colors">
                            <div className="flex items-center justify-center transition-colors">
                                <MessageCircle size={20} />
                            </div>
                            <span className="text-[14px]">4</span>
                        </button>

                        <button className="flex items-center gap-1 group hover:text-main transition-colors">
                            <div className="flex items-center justify-center transition-colors">
                                <Repeat2 size={20} />
                            </div>
                            <span className="text-[14px]">4</span>
                        </button>


                    </div>

                    <button className="flex items-center gap-1 group hover:text-main transition-colors">
                        <div className="flex items-center justify-center transition-colors">
                            <Bookmark size={20} />
                        </div>
                        <span className="text-[14px]">4</span>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default PostCard;

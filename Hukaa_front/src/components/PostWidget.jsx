import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, POST_SHARE_URL } from '../api/client';
import CommentPopup from './CommentPopup';
import SharePopup from './SharePopup';
import ImageGalleryPopup from './ImageGalleryPopup';

const PostWidget = ({ post, profileData }) => {
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const reactionTimeoutRef = useRef(null);

    const reactions = [
        { type: 'Like', icon: '👍', color: 'text-blue-600' },
        { type: 'Love', icon: '❤️', color: 'text-red-500' },
        { type: 'Haha', icon: '😆', color: 'text-yellow-500' },
        { type: 'Wow', icon: '😮', color: 'text-yellow-600' },
        { type: 'Sad', icon: '😢', color: 'text-blue-400' },
        { type: 'Angry', icon: '😡', color: 'text-orange-600' }
    ];

    const handleReactionMouseEnter = () => {
        if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
        setShowReactions(true);
    };

    const handleReactionMouseLeave = () => {
        reactionTimeoutRef.current = setTimeout(() => {
            setShowReactions(false);
        }, 300);
    };

    const selectReaction = (reaction) => {
        setSelectedReaction(reaction);
        setShowReactions(false);
    };

    const tempComments = [
        { id: 1, user: 'Argos Morrie', text: 'Great post!', time: '2 mins ago' },
        { id: 2, user: 'Julie Morley', text: 'Totally agree with you.', time: '5 mins ago' },
        { id: 3, user: 'Julie Morley', text: 'This looks amazing! Keep it up.', time: '10 mins ago' },
        { id: 4, user: 'Julie Morley', text: 'Wait, is this from the new update?', time: '15 mins ago' },
        { id: 5, user: 'Julie Morley', text: 'I love the design here.', time: '20 mins ago' }
    ];

    const tempFriends = [
        { id: 1, name: 'Shawn Lynch', image: '/src/assets/images/user/user-42.jpg' },
        { id: 2, name: 'Kenneth Perry', image: '/src/assets/images/user/user-43.jpg' }
    ];

    const mediaItems = post.media || (post.imageUrl ? [{ url: post.imageUrl, type: 'image' }] : []);

    const openGallery = (index) => {
        setSelectedMediaIndex(index);
        setShowGallery(true);
    };

    const renderMedia = () => {
        if (mediaItems.length === 0) return null;

        const gridClass = mediaItems.length === 1 ? 'grid-cols-1' : 'grid-cols-2';

        return (
            <div className={`grid ${gridClass} gap-3 rounded-2xl overflow-hidden mb-4 max-h-[400px]`}>
                {mediaItems.slice(0, 2).map((item, index) => (
                    <div
                        key={index}
                        onClick={() => openGallery(index)}
                        className={`relative group cursor-pointer overflow-hidden ${mediaItems.length === 1 ? 'aspect-video' : 'aspect-square'}`}
                    >
                        {item.type === 'video' ? (
                            <video src={item.url.startsWith('http') || item.url.startsWith('/') ? item.url : `${IMAGE_BASE_URL}/${item.url}`} className="w-full h-full object-cover" />
                        ) : (
                            <img
                                // src={item.url.startsWith('http') || item.url.startsWith('/src') ? item.url : `${IMAGE_BASE_URL}/${item.url}`}
                                src={`https://localhost:7124/posts/images/0efe2d7e-9b1b-4a5f-826d-1e229c2f58fe.jpg`}
                                alt={`post media ${index}`}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

                        {/* Overlay on the 2nd image if there are more than 2 items */}
                        {index === 1 && mediaItems.length > 2 && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                                <div className="flex flex-col items-center">
                                    <span className="text-white text-3xl font-extrabold">+{mediaItems.length - 2}</span>
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider">View All</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm mb-6 border border-gray-100 overflow-visible relative group/widget">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                        <Link to="/profile">
                            <img
                                src={post.userImage ? `${IMAGE_BASE_URL}/${post.userImage}` : (profileData?.profileImagePath ? `${IMAGE_BASE_URL}/${profileData.profileImagePath}` : "/src/assets/images/user/user-1.jpg")}
                                className="w-full h-full object-cover"
                                alt="user"
                            />
                        </Link>
                    </div>
                    <div>
                        <Link to="/profile" className="font-bold text-gray-800 hover:text-blue-600 block leading-tight transition-colors">
                            {post.userName || profileData?.profileName || 'Julie R. Morleyv'}
                        </Link>
                        <span className="text-xs text-gray-400 font-medium flex items-center">
                            {post.createAt && !post.createAt.startsWith('0001') ?
                                (typeof post.createAt === 'string' && post.createAt.includes('-') ? new Date(post.createAt).toLocaleDateString() : post.createAt)
                                : '10 Mins Ago'}
                            <span className="mx-1">•</span>
                            <i className="ri-earth-line text-[10px]"></i>
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600"
                    >
                        <i className="flaticon-menu text-lg"></i>
                    </button>

                    {showOptions && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                                        <i className="flaticon-edit"></i>
                                    </div>
                                    <span className="font-semibold">Edit Post</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors border-t border-gray-50">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3">
                                        <i className="flaticon-garbage"></i>
                                    </div>
                                    <span className="font-semibold">Delete Post</span>
                                </button>
                                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors border-t border-gray-50">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mr-3">
                                        <i className="flaticon-star"></i>
                                    </div>
                                    <span className="font-semibold">Toggle Archive</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="px-4 pb-2">
                <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
                    {post.content || 'Donec rutrum congue leo eget malesuada. Nulla quis lorem ut libero malesuada feugiat.'}
                </p>
                {renderMedia()}
            </div>

            <div className="px-4 py-3 border-t border-gray-50 flex justify-between items-center relative bg-gray-50/30 rounded-b-2xl">
                <div className="flex space-x-12">
                    <div
                        className="relative"
                        onMouseEnter={handleReactionMouseEnter}
                        onMouseLeave={handleReactionMouseLeave}
                    >
                        <button
                            onClick={() => selectedReaction ? setSelectedReaction(null) : selectReaction(reactions[0])}
                            className={`flex items-center space-x-2 font-bold transition-all py-1 px-2 rounded-lg hover:bg-white hover:shadow-sm ${selectedReaction ? selectedReaction.color : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            <span className="text-xl">
                                {selectedReaction ? selectedReaction.icon : <i className="flaticon-like"></i>}
                            </span>
                            <span className="text-sm uppercase tracking-wide">
                                {selectedReaction ? selectedReaction.type : 'Like'}
                            </span>
                            <span className="text-xs font-medium text-gray-400">
                                ({post.totalReactionCount || 1499})
                            </span>
                        </button>

                        {showReactions && (
                            <div
                                className="absolute bottom-full left-0 mb-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-gray-100 flex items-center space-x-1 animate-fade-in-up z-50"
                                onMouseEnter={handleReactionMouseEnter}
                                onMouseLeave={handleReactionMouseLeave}
                            >
                                {reactions.map((r) => (
                                    <button
                                        key={r.type}
                                        onClick={() => selectReaction(r)}
                                        className="w-10 h-10 flex items-center justify-center text-3xl hover:scale-150 transition-all duration-300 hover:-translate-y-2 origin-bottom"
                                        title={r.type}
                                    >
                                        {r.icon}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowComments(true)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-bold transition-all py-1 px-2 rounded-lg hover:bg-white hover:shadow-sm"
                    >
                        <i className="flaticon-comment text-xl"></i>
                        <span className="text-sm uppercase tracking-wide">Comment</span>
                        <span className="text-xs font-medium text-gray-400">({post.commentCount || 599})</span>
                    </button>

                    <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 font-bold transition-all py-1 px-2 rounded-lg hover:bg-white hover:shadow-sm"
                    >
                        <i className="flaticon-share text-xl"></i>
                        <span className="text-sm uppercase tracking-wide">Share</span>
                        <span className="text-xs font-medium text-gray-400">({post.shareCount || 24})</span>
                    </button>
                </div>
            </div>

            <CommentPopup
                isOpen={showComments}
                onClose={() => setShowComments(false)}
                comments={tempComments}
            />
            <SharePopup
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                friends={tempFriends}
                postLink={`${IMAGE_BASE_URL}${POST_SHARE_URL}${post.id}`}
            />
            <ImageGalleryPopup
                isOpen={showGallery}
                onClose={() => setShowGallery(false)}
                media={mediaItems.map(m => ({ ...m, url: m.url.startsWith('http') || m.url.startsWith('/') ? m.url : `${IMAGE_BASE_URL}/${m.url}` }))}
                initialIndex={selectedMediaIndex}
            />
        </div>
    );
};

export default PostWidget;

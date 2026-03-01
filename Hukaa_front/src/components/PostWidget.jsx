import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, POST_SHARE_URL, FRONT_URL, USER_AVATAR } from '../api/client';
import { updatePost, deletePost, toggleArchivePost, reactToPost, toggleSavePost } from '../api/post';
import CommentPopup from './Popups/CommentPopup';
import SharePopup from './Popups/SharePopup';
import ImageGalleryPopup from './Popups/ImageGalleryPopup';
import { useToast } from '../context/ToastContext';

const PostWidget = ({ post, onDelete, onUpdate, onArchive, onSaveToggle }) => {
    const [myReaction, setMyReaction] = useState(post.myReaction);
    const [isSaved, setIsSaved] = useState(post.isSaved || post.saved || false);
    const [reactionCount, setReactionCount] = useState(post.reactionCount || post.totalReactionCount || 0);
    const [commentCount, setCommentCount] = useState(post.commentCount || 0);
    const [showReactions, setShowReactions] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const reactionTimeoutRef = useRef(null);

    // Post Management State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { showToast, showConfirm } = useToast();
    const maxChars = 1000;
    const SUMMARY_LIMIT = 250;

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

    const selectReaction = async (reactionType) => {
        try {
            const response = await reactToPost(post.id, reactionType);
            if (response.success) {
                setMyReaction(response.data.myReaction);
                setReactionCount(response.data.reactionCount);
            }
        } catch (error) {
            console.error('Failed to update reaction:', error);
        } finally {
            setShowReactions(false);
        }
    };

    const longPressTimeoutRef = useRef(null);
    const isLongPressActive = useRef(false);

    const handleTouchStart = () => {
        // Prevent default only if we want to block scroll, but here we just want to start a timer
        isLongPressActive.current = false;
        longPressTimeoutRef.current = setTimeout(() => {
            isLongPressActive.current = true;
            setShowReactions(true);
        }, 500); // 500ms for long press
    };

    const handleTouchEnd = () => {
        if (longPressTimeoutRef.current) {
            clearTimeout(longPressTimeoutRef.current);
        }
    };


    const handleLikeClick = () => {
        // If it was a long press that triggered reactions, don't execute normal click
        if (isLongPressActive.current) {
            isLongPressActive.current = false;
            return;
        }

        if (myReaction !== null) {
            selectReaction(myReaction);
        } else {
            selectReaction(1);
        }
    };

    const tempFriends = [];

    const mediaItems = post.postFiles && post.postFiles.length > 0 ? post.postFiles.map(file => ({
        url: file.filePath,
        type: file.fileType === 1 ? 'image' : 'video'
    })) : (post.media || (post.imageUrl ? [{ url: post.imageUrl, type: 'image' }] : []));

    const openGallery = (index) => {
        setSelectedMediaIndex(index);
        setShowGallery(true);
    };

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('/src') || url.startsWith('blob:')) return url;
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        return `${IMAGE_BASE_URL}/${cleanUrl}`;
    };

    const handleEditStart = () => {
        setIsEditing(true);
        setEditContent(post.content || '');
        setShowOptions(false);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditContent(post.content || '');
    };

    const handleUpdateSubmit = async () => {
        const trimmed = editContent.trim();
        if (!trimmed && mediaItems.length === 0) return;
        setIsUpdating(true);
        try {
            const response = await updatePost(post.id, trimmed);
            if (response.success) {
                setIsEditing(false);
                if (onUpdate) onUpdate(response.data.post);
            }
        } catch (error) {
            console.error('Failed to update post:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeletePost = () => {
        showConfirm(
            'Delete Post',
            'This action is permanent and cannot be undone. Are you sure you want to delete this post?',
            async () => {
                setIsDeleting(true);
                try {
                    const response = await deletePost(post.id);
                    if (response.success) {
                        showToast('Post deleted successfully');
                        if (onDelete) onDelete(post.id);
                    } else {
                        showToast(response.message || 'Failed to delete post', 'error');
                    }
                } catch (error) {
                    console.error('Failed to delete post:', error);
                    showToast('An error occurred while deleting post', 'error');
                } finally {
                    setIsDeleting(false);
                }
            }
        );
    };

    const handleToggleArchiveClick = () => {
        const isArchivingAction = !post.isArchived;
        showConfirm(
            isArchivingAction ? 'Archive Post' : 'Unarchive Post',
            `Are you sure you want to ${isArchivingAction ? 'archive' : 'unarchive'} this post?`,
            async () => {
                setIsArchiving(true);
                try {
                    const response = await toggleArchivePost(post.id, isArchivingAction);
                    if (response.success) {
                        showToast(`Post ${isArchivingAction ? 'archived' : 'unarchived'} successfully`);
                        if (onArchive) onArchive(post.id, isArchivingAction);
                    } else {
                        showToast(response.message || 'Operation failed', 'error');
                    }
                } catch (error) {
                    console.error('Failed to archive post:', error);
                    showToast('An error occurred during archival', 'error');
                } finally {
                    setIsArchiving(false);
                }
            }
        );
    };

    const handleToggleSave = async () => {
        try {
            const response = await toggleSavePost(post.id);
            if (response.success) {
                const newSaveState = !isSaved;
                setIsSaved(newSaveState);
                showToast(response.message || (newSaveState ? 'Post saved successfully' : 'Post removed from saved'), 'success', 3000, 'top-right');

                // Notify parent about save state change
                if (onSaveToggle) {
                    onSaveToggle(post.id, newSaveState);
                }
            } else {
                showToast(response.message || 'Failed to save post', 'error', 3000, 'top-right');
            }
        } catch (error) {
            console.error('Failed to toggle save:', error);
            showToast('An error occurred', 'error', 3000, 'top-right');
        }
    };

    const renderMedia = () => {
        if (mediaItems.length === 0) return null;
        const gridClass = mediaItems.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
        return (
            <div className={`grid ${gridClass} gap-3 rounded-2xl overflow-hidden mb-4 max-h-[500px]`}>
                {mediaItems.slice(0, 2).map((item, index) => (
                    <div
                        key={index}
                        onClick={() => openGallery(index)}
                        className={`relative group cursor-pointer overflow-hidden ${mediaItems.length === 1 ? 'aspect-auto' : 'aspect-square'}`}
                    >
                        {item.type === 'video' ? (
                            <video src={getMediaUrl(item.url)} className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src={getMediaUrl(item.url)}
                                alt={`post media ${index}`}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
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

    const needsReadMore = post.content && (post.content.length > SUMMARY_LIMIT || post.content.split('\n').length > 5);
    const displayContent = needsReadMore && !isExpanded
        ? post.content.substring(0, SUMMARY_LIMIT) + '...'
        : post.content;

    return (
        <div className="bg-white rounded-3xl shadow-sm mb-4 md:mb-6 border border-gray-100 overflow-visible relative group/widget transition-all hover:shadow-xl hover:shadow-gray-100/50">

            <div className="p-5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-100 transition-transform hover:scale-105">
                        <Link to="/profile">
                            <img
                                src={post.userImage ? `${IMAGE_BASE_URL}/${post.userImage}` : USER_AVATAR}
                                className="w-full h-full object-cover"
                                alt="user"
                            />
                        </Link>
                    </div>
                    <div>
                        <Link to={`/profile/${post.userId}`} className="font-bold text-[15px] text-gray-800 hover:text-main block leading-tight transition-colors">
                            {post.userName || 'USER NAME'}
                        </Link>
                        <span className="text-[11px] text-gray-400 font-bold flex items-center mt-0.5">
                            {post.createdAt && !post.createdAt.startsWith('0001') ?
                                new Date(post.createdAt).toLocaleDateString() :
                                (post.createAt && !post.createAt.startsWith('0001') ?
                                    (typeof post.createAt === 'string' && post.createAt.includes('-') ? new Date(post.createAt).toLocaleDateString() : post.createAt) :
                                    'Recently')}
                            <span className="mx-1.5 opacity-30">•</span>
                            <i className={`text-[12px] text-gray-400 ${post.isArchived ? 'ri-lock-line' : 'ri-earth-line'}`}></i>
                        </span>
                    </div>
                </div>

                <div className="relative">
                    {post.isOwner && (
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${showOptions ? 'bg-main text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                            disabled={isDeleting || isArchiving}
                        >
                            <i className="ri-more-2-line text-xl"></i>
                        </button>
                    )}

                    {showOptions && post.isOwner && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)}></div>
                            <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-fade-in-up">
                                <button
                                    onClick={handleEditStart}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-main flex items-center rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center mr-3 group-hover:bg-main group-hover:text-white transition-all shadow-sm">
                                        <i className="ri-edit-line text-lg"></i>
                                    </div>
                                    <span className="font-bold">Edit Post</span>
                                </button>

                                <button
                                    onClick={handleToggleArchiveClick}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-main flex items-center rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center mr-3 group-hover:bg-main group-hover:text-white transition-all shadow-sm">
                                        <i className={post.isArchived ? 'ri-lock-unlock-line text-lg' : 'ri-lock-line text-lg'}></i>
                                    </div>
                                    <span className="font-bold">
                                        {isArchiving ? (post.isArchived ? 'Unarchiving...' : 'Archiving...') : (post.isArchived ? 'Unarchive' : 'Archive Post')}
                                    </span>
                                </button>

                                <div className="h-px bg-gray-50 my-2 mx-2"></div>

                                <button
                                    onClick={() => { handleDeletePost(); setShowOptions(false); }}
                                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-red-50 text-red-400 flex items-center justify-center mr-3 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                                        <i className="ri-delete-bin-line text-lg"></i>
                                    </div>
                                    <span className="font-bold">Delete Post</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="px-5 pb-2">
                {isEditing ? (
                    <div className="space-y-4">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value.substring(0, maxChars))}
                            className="w-full bg-gray-50 border-2 border-gray-100 text-gray-700 resize-none rounded-2xl p-5 min-h-[140px] focus:ring-4 focus:ring-blue-50 focus:border-main focus:bg-white outline-none transition-all placeholder:text-gray-400 text-[15px] leading-relaxed font-medium"
                            autoFocus
                            placeholder="What's on your mind?"
                        ></textarea>
                        <div className="flex justify-between items-center pb-4">
                            <span className={`text-[11px] font-bold tracking-widest uppercase ${editContent.length >= maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                                {editContent.length} / {maxChars}
                            </span>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleEditCancel}
                                    className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSubmit}
                                    disabled={isUpdating}
                                    className="px-8 py-2.5 text-sm font-bold bg-main text-white rounded-xl hover:bg-optional transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Update Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-5 px-1">
                        <p className="text-gray-700 whitespace-pre-wrap leading-[1.7] text-[15.5px] font-medium tracking-tight">
                            {displayContent}
                        </p>
                        {needsReadMore && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-main font-bold hover:underline text-sm focus:outline-none mt-2 block active:scale-95 transition-all"
                            >
                                {isExpanded ? 'Show less' : 'Read full story'}
                            </button>
                        )}
                    </div>
                )}
                {renderMedia()}
            </div>

            <div className="px-5 py-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/20 rounded-b-3xl">
                <div className="flex w-full justify-between items-center">
                    <div
                        className="relative"
                        onMouseEnter={handleReactionMouseEnter}
                        onMouseLeave={handleReactionMouseLeave}
                    >
                        <button
                            onClick={handleLikeClick}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            className={`flex items-center space-x-2 font-bold transition-all py-2 px-4 rounded-xl hover:bg-white hover:shadow-md group ${myReaction !== null ? reactions.find(r => (reactions.indexOf(r) + 1) === myReaction)?.color || 'text-main' : 'text-gray-500 hover:text-main'}`}
                        >
                            <span className="text-xl transform group-hover:scale-125 transition-transform">
                                {myReaction !== null ? (reactions.find(r => (reactions.indexOf(r) + 1) === myReaction)?.icon || reactions[0].icon) : <i className="ri-thumb-up-line"></i>}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
                                {myReaction !== null ? (reactions.find(r => (reactions.indexOf(r) + 1) === myReaction)?.type || 'Like') : 'Like'}
                            </span>
                            <span className="text-xs font-bold opacity-40">
                                {reactionCount > 0 ? reactionCount : ''}
                            </span>
                        </button>

                        {showReactions && (
                            <div
                                className="absolute bottom-full left-0 mb-4 p-2 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-white/50 flex items-center space-x-1 animate-zoom-in z-50 origin-bottom-left"
                                onMouseEnter={handleReactionMouseEnter}
                                onMouseLeave={handleReactionMouseLeave}
                            >
                                {reactions.map((r, index) => (
                                    <button
                                        key={r.type}
                                        onClick={() => selectReaction(index + 1)}
                                        className="w-11 h-11 flex items-center justify-center text-3xl hover:scale-150 transition-all duration-300 hover:-translate-y-3 origin-bottom p-1"
                                        title={r.type}
                                    >
                                        <span className="filter drop-shadow-sm">{r.icon}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowComments(true)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-main font-bold transition-all py-2 px-4 rounded-xl hover:bg-white hover:shadow-md group"
                    >
                        <i className="ri-chat-3-line text-xl group-hover:scale-110 transition-transform"></i>
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Comment</span>
                        <span className="text-xs font-bold opacity-40">{commentCount > 0 ? commentCount : ''}</span>
                    </button>

                    <button
                        onClick={handleToggleSave}
                        className={`flex items-center space-x-2 font-bold transition-all py-2 px-4 rounded-xl hover:bg-white hover:shadow-md group ${isSaved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
                        title={isSaved ? 'Unsave Post' : 'Save Post'}
                    >
                        <i className={`${isSaved ? 'ri-star-fill' : 'ri-star-line'} text-xl group-hover:scale-110 transition-transform`}></i>
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
                            {isSaved ? 'Saved' : 'Save'}
                        </span>
                    </button>

                    <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 font-bold transition-all py-2 px-4 rounded-xl hover:bg-white hover:shadow-md group"
                    >
                        <i className="ri-share-forward-line text-xl group-hover:scale-110 transition-transform"></i>
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Share</span>
                        <span className="text-xs font-bold opacity-40">{post.shareCount > 0 ? post.shareCount : ''}</span>
                    </button>
                </div>
            </div>

            <CommentPopup
                isOpen={showComments}
                onClose={() => setShowComments(false)}
                postId={post.id}
                onCommentCountChange={setCommentCount}
            />
            <SharePopup
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                friends={tempFriends}
                postLink={`${FRONT_URL}${POST_SHARE_URL}${post.id}`}
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

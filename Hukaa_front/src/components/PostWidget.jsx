import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, POST_SHARE_URL, FRONT_URL } from '../api/client';
import { updatePost, deletePost, toggleArchivePost, reactToPost } from '../api/post';
import CommentPopup from './CommentPopup';
import SharePopup from './SharePopup';
import ImageGalleryPopup from './ImageGalleryPopup';

const PostWidget = ({ post, profileData, onDelete, onUpdate, onArchive }) => {
    const [myReaction, setMyReaction] = useState(post.myReaction);
    const [reactionCount, setReactionCount] = useState(post.totalReactionCount || 0);
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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const maxChars = 1000;
    const SUMMARY_LIMIT = 150;

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

    const handleLikeClick = () => {
        if (myReaction !== null) {
            // If already reacted, delete reaction by sending same or null? 
            // The prompt says "delete my reaction" with the same endpoint.
            // Usually sending same reaction toggles it off or sending null.
            // Given the response examples: null means deleted.
            selectReaction(myReaction); // Backend likely toggles if same
        } else {
            selectReaction(1); // Default Like
        }
    };

    const tempComments = [];
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

    // Post Management Handlers
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
            // alert('Failed to update post'); // Avoiding alert
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteClick = async () => {
        setIsDeleting(true);
        try {
            const response = await deletePost(post.id);
            if (response.success) {
                if (onDelete) onDelete(post.id);
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            setShowDeleteConfirm(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleArchiveClick = async () => {
        setIsArchiving(true);
        try {
            // If the post is already archived (in archived view), we want to unarchive it (isArchive: false)
            // Otherwise, we archive it (isArchive: true)
            const newArchiveStatus = !post.isArchived;
            const response = await toggleArchivePost(post.id, newArchiveStatus);
            if (response.success) {
                if (onArchive) onArchive(post.id, newArchiveStatus);
            }
        } catch (error) {
            console.error('Failed to archive post:', error);
        } finally {
            setIsArchiving(false);
        }
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
                            <video src={getMediaUrl(item.url)} className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src={getMediaUrl(item.url)}
                                alt={`post media ${index}`}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
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

    const needsReadMore = post.content && (post.content.length > SUMMARY_LIMIT || post.content.split('\n').length > 4);
    const displayContent = needsReadMore && !isExpanded
        ? post.content.substring(0, SUMMARY_LIMIT) + '...'
        : post.content;

    return (
        <div className={`bg-white rounded-2xl shadow-sm mb-6 border border-gray-100 overflow-visible relative group/widget  ${showDeleteConfirm ? "h-[300px]" : ""}`}  >
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <i className="flaticon-trash text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Post?</h3>
                    <p className="text-gray-500 mb-6 max-w-[250px]">This action cannot be undone. Are you sure you want to delete this post?</p>
                    <div className="flex space-x-3 w-full max-w-[280px]">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}

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
                            {post.createdAt && !post.createdAt.startsWith('0001') ?
                                new Date(post.createdAt).toLocaleDateString() :
                                (post.createAt && !post.createAt.startsWith('0001') ?
                                    (typeof post.createAt === 'string' && post.createAt.includes('-') ? new Date(post.createAt).toLocaleDateString() : post.createAt) :
                                    'Recently')}
                            <span className="mx-1">•</span>
                            <i className="ri-earth-line text-[10px]"></i>
                        </span>
                    </div>
                </div>

                <div className="relative">
                    {post.isOwner && (
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600"
                            disabled={isDeleting || isArchiving}
                        >
                            <i className="flaticon-menu text-lg"></i>
                        </button>
                    )}

                    {showOptions && post.isOwner && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)}></div>
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                                <button
                                    onClick={handleEditStart}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                                        <i className="flaticon-edit"></i>
                                    </div>
                                    <span className="font-semibold">Edit Post</span>
                                </button>

                                <button
                                    onClick={handleToggleArchiveClick}
                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center transition-colors "
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center mr-3">
                                        <i className={`${post.isArchived ? 'flaticon-global' : 'flaticon-private'}`}></i>
                                    </div>
                                    <span className="font-semibold">
                                        {isArchiving ? (post.isArchived ? 'Unarchiving...' : 'Archiving...') : (post.isArchived ? 'Unarchive' : 'Archive')}
                                    </span>
                                </button>

                                <button
                                    onClick={() => { setShowDeleteConfirm(true); setShowOptions(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors "
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-3">
                                        <i className="flaticon-trash"></i>
                                    </div>
                                    <span className="font-semibold">Delete Post</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="px-4 pb-2">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value.substring(0, maxChars))}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-700 resize-none rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            autoFocus
                        ></textarea>
                        <div className="flex justify-between items-center">
                            <span className={`text-[11px] font-bold tracking-tight ${editContent.length >= maxChars ? 'text-red-500' : 'text-gray-400'}`}>
                                {editContent.length} / {maxChars}
                            </span>
                            <div className="flex space-x-2 pb-3">
                                <button
                                    onClick={handleEditCancel}
                                    className="px-4 py-1.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSubmit}
                                    disabled={isUpdating}
                                    className="px-6 py-1.5 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 disabled:opacity-50"
                                >
                                    {isUpdating ? 'Saving...' : 'Update'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed inline">
                            {displayContent}
                        </p>
                        {needsReadMore && (
                            <div className="flex ">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-blue-600 font-bold hover:underline text-sm focus:outline-none ml-2"
                                >
                                    {isExpanded ? 'Show less' : 'Read more'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
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
                            onClick={handleLikeClick}
                            className={`flex items-center space-x-2 font-bold transition-all py-1 px-2 rounded-lg hover:bg-white hover:shadow-sm ${myReaction !== null ? reactions.find(r => (reactions.indexOf(r) + 1) === myReaction)?.color || 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            <span className="text-xl">
                                {myReaction !== null ? (reactions.find(r => (reactions.indexOf(r) + 1) === myReaction)?.icon || reactions[0].icon) : <i className="flaticon-like"></i>}
                            </span>
                            <span className="text-sm uppercase tracking-wide">
                                {myReaction !== null ? (reactions.find(r => (reactions.indexOf(r) + 1) === myReaction)?.type || 'Like') : 'Like'}
                            </span>
                            <span className="text-xs font-medium text-gray-400">
                                ({reactionCount})
                            </span>
                        </button>

                        {showReactions && (
                            <div
                                className="absolute bottom-full left-0 mb-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-gray-100 flex items-center space-x-1 animate-fade-in-up z-50"
                                onMouseEnter={handleReactionMouseEnter}
                                onMouseLeave={handleReactionMouseLeave}
                            >
                                {reactions.map((r, index) => (
                                    <button
                                        key={r.type}
                                        onClick={() => selectReaction(index + 1)}
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
                        <span className="text-xs font-medium text-gray-400">({post.commentCount || 0})</span>
                    </button>

                    <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 font-bold transition-all py-1 px-2 rounded-lg hover:bg-white hover:shadow-sm"
                    >
                        <i className="flaticon-share text-xl"></i>
                        <span className="text-sm uppercase tracking-wide">Share</span>
                        <span className="text-xs font-medium text-gray-400">({post.shareCount || 0})</span>
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

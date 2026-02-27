import React, { useState, useEffect, useRef } from 'react';
import { getPostComments, createComment, deleteComment, updateComment } from '../../api/comment';
import { IMAGE_BASE_URL } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import CommentSkeleton from '../Skeleton/CommentSkeleton';

const CommentPopup = ({ isOpen, onClose, postId, onCommentCountChange }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const { showToast, showConfirm } = useToast();
    const dropdownRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newComment]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveDropdownId(null);
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            window.addEventListener('mousedown', handleClickOutside);
            fetchComments();
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, postId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await getPostComments(postId);
            if (response.success) {
                setComments(response.data);
                if (onCommentCountChange) onCommentCountChange(response.data.length);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async () => {
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (editingComment) {
                const response = await updateComment(editingComment.id, newComment.trim());
                if (response.success) {
                    setComments(comments.map(c => c.id === editingComment.id ? response.data : c));
                    setEditingComment(null);
                    setNewComment('');
                }
            } else {
                const response = await createComment(postId, newComment.trim());
                if (response.success) {
                    const updatedComments = [...comments, response.data];
                    setComments(updatedComments);
                    setNewComment('');
                    if (onCommentCountChange) onCommentCountChange(updatedComments.length);
                }
            }
        } catch (error) {
            console.error('Failed to process comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        showConfirm(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            async () => {
                try {
                    const response = await deleteComment(commentId);
                    if (response === null || response.success) {
                        const updatedComments = comments.filter(c => c.id !== commentId);
                        setComments(updatedComments);
                        if (onCommentCountChange) onCommentCountChange(updatedComments.length);
                        showToast('Comment deleted successfully');
                    } else {
                        showToast(response.message || 'Failed to delete comment', 'error');
                    }
                } catch (error) {
                    console.error('Failed to delete comment:', error);
                    showToast('An error occurred while deleting comment', 'error');
                } finally {
                    setActiveDropdownId(null);
                }
            }
        );
    };

    const handleEditStart = (comment) => {
        setEditingComment(comment);
        setNewComment(comment.content);
        setActiveDropdownId(null);
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setNewComment('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-1000 p-4 transition-all duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-xl text-gray-800">Comments</h3>
                        <p className="text-sm text-gray-500">{comments.length} people commented on this post</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="grow overflow-y-auto p-6 space-y-6 min-h-[210px]">
                    {isLoading ? (
                        <CommentSkeleton count={3} />
                    ) : comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="flex space-x-4 group">
                                <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-blue-600 font-bold border border-white shadow-sm overflow-hidden">
                                    {comment.userImage ? (
                                        <img src={`${IMAGE_BASE_URL}/${comment.userImage}`} alt={comment.userName} className="w-full h-full object-cover" />
                                    ) : (
                                        (comment.userName || 'U').charAt(0)
                                    )}
                                </div>
                                <div className="grow space-y-1">
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 border border-gray-100 group-hover:bg-gray-100 transition-colors relative">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-sm text-gray-900 hover:text-blue-600 cursor-pointer">{comment.userName}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                                                </span>
                                                {comment.isOwner && (
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdownId(activeDropdownId === comment.id ? null : comment.id);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                                        >
                                                            <i className="ri-more-fill font-bold"></i>
                                                        </button>
                                                        {activeDropdownId === comment.id && (
                                                            <div
                                                                ref={dropdownRef}
                                                                className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 animate-fade-in-up"
                                                            >
                                                                <button
                                                                    onClick={() => handleEditStart(comment)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center font-semibold"
                                                                >
                                                                    <i className="ri-edit-line mr-2"></i> Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center font-semibold"
                                                                >
                                                                    <i className="ri-delete-bin-2-line mr-2"></i> Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-[15px] leading-relaxed break-all">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                            <i className="ri-chat-3-line text-6xl mb-4 opacity-20"></i>
                            <p className="text-lg">No comments yet. Be the first to join the conversation!</p>
                        </div>
                    )}
                </div>

                {/* Footer / Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    {editingComment && (
                        <div className="flex justify-between items-center mb-2 px-2">
                            <span className="text-xs font-bold text-blue-600 flex items-center">
                                <i className="ri-edit-line mr-1"></i> Editing comment...
                            </span>
                            <button
                                onClick={handleCancelEdit}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <div className="flex space-x-3 items-center justify-center">
                        <div className="grow bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50/50 transition-all p-2">
                            <textarea
                                ref={textareaRef}
                                placeholder="Add a friendly comment..."
                                className="w-full bg-transparent border-none outline-none py-1 px-2 text-gray-700 placeholder-gray-400 resize-none max-h-32 min-h-[44px] leading-normal"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAction();
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={handleAction}
                            disabled={isSubmitting || !newComment.trim()}
                            className="shrink-0 bg-blue-600 text-white rounded-xl px-6 py-3 text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none h-[44px] flex items-center justify-center min-w-[100px]"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                editingComment ? 'Update' : 'Post'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentPopup;

import React, { useEffect } from 'react';

const CommentPopup = ({ isOpen, onClose, comments = [] }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-1000 p-4 transition-all duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-xl text-gray-800">Comments</h3>
                        <p className="text-sm text-gray-500">{comments.length} people commented on this post</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="grow overflow-y-auto p-6 space-y-6">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="flex space-x-4 group">
                                <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-blue-600 font-bold border border-white shadow-sm overflow-hidden">
                                    {comment.userImage ? (
                                        <img src={comment.userImage} alt={comment.user} className="w-full h-full object-cover" />
                                    ) : (
                                        comment.user.charAt(0)
                                    )}
                                </div>
                                <div className="grow space-y-1">
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 border border-gray-100 group-hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-sm text-gray-900 hover:text-blue-600 cursor-pointer">{comment.user}</p>
                                            <span className="text-[10px] text-gray-400 font-medium">{comment.time}</span>
                                        </div>
                                        <p className="text-gray-700 text-[15px] leading-relaxed">{comment.text}</p>
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
                <div className="p-5 border-t border-gray-100 bg-white">
                    <div className="flex items-center space-x-3 bg-gray-100 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                        <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            U
                        </div>
                        <input
                            type="text"
                            placeholder="Add a friendly comment..."
                            className="grow bg-transparent border-none outline-none py-2 px-1 text-gray-700 placeholder-gray-400"
                        />
                        <button className="bg-blue-600 text-white rounded-xl px-5 py-2 text-sm font-bold hover:bg-blue-700 shadow-md transform hover:scale-105 transition-all">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentPopup;

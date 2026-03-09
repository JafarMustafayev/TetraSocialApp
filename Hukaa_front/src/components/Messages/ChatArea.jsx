import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import ChatAreaSkeleton from '../Skeleton/ChatAreaSkeleton';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const ChatArea = ({ selectedId, setSelectedId, initialMessage, setInitialMessage }) => {
    const {
        conversations, messages,
        fetchMessages, messagesLoading,
        messagesHasMore, deleteConversation,
        tempChat, sendMessage, markAsRead,
        setSelectedId: setContextSelectedId
    } = useChat();
    const { showToast, showConfirm } = useToast();
    const [messageText, setMessageText] = useState('');

    // Handle message pre-filling and input clearing on chat switch
    const lastId = useRef(selectedId);
    useEffect(() => {
        if (initialMessage) {
            setMessageText(initialMessage);
            if (setInitialMessage) setInitialMessage('');
        } else if (selectedId !== lastId.current) {
            // Only clear if the chat actually switched and no template was provided
            setMessageText('');
        }
        lastId.current = selectedId;
    }, [selectedId, initialMessage, setInitialMessage]);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollRef = useRef(null);
    const moreMenuRef = useRef(null);
    const scrollHeightRef = useRef(0);
    const scrollTimeoutRef = useRef(null);
    const [visibleDates, setVisibleDates] = useState(new Set());
    const [visibleGroups, setVisibleGroups] = useState(new Set());
    const textareaRef = useRef(null);
    const isInitialLoad = useRef(true);

    const activeChat = conversations.find(c => c.conversationId === selectedId) || (tempChat?.conversationId === selectedId ? tempChat : null);

    // Sync selectedId with context for unread count logic
    useEffect(() => {
        setContextSelectedId(selectedId);
    }, [selectedId, setContextSelectedId]);

    useEffect(() => {
        if (selectedId) {
            isInitialLoad.current = true;
            markAsRead(selectedId);
            // Even if we have a real-time message in state, we need to fetch history if not already done
            if (messagesHasMore[selectedId] === undefined) {
                fetchMessages(selectedId, true);
            }
        }
    }, [selectedId, markAsRead, messagesHasMore]);

    // Preserve scroll position when loading older messages
    useEffect(() => {
        if (scrollRef.current && !isInitialLoad.current && messages[selectedId]) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            const heightDiff = newScrollHeight - scrollHeightRef.current;
            scrollRef.current.scrollTop = scrollRef.current.scrollTop + heightDiff;
        }
        scrollHeightRef.current = scrollRef.current?.scrollHeight || 0;
    }, [messages[selectedId]]);

    useEffect(() => {
        if (scrollRef.current && isInitialLoad.current && messages[selectedId]) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            isInitialLoad.current = false;
        }
    }, [selectedId, messages[selectedId]]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop } = scrollRef.current;

        // Fetch older messages when reaching top
        if (scrollTop < 100 && !messagesLoading && messagesHasMore[selectedId]) {
            scrollHeightRef.current = scrollRef.current.scrollHeight;
            fetchMessages(selectedId);
        }

        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1500);
    };

    const currentMessages = messages[selectedId] || [];
    const groupedMessages = useMemo(() => {
        return currentMessages.reduce((groups, message) => {
            if (!message.sentAt) return groups;
            const dateObj = new Date(message.sentAt);
            const date = dateObj.toLocaleDateString('en-US', { month: 'long', day: '2-digit' });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }, [currentMessages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!messageText.trim() || !activeChat) return;

        const currentText = messageText.trim();
        setMessageText('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            await sendMessage(
                currentText,
                activeChat.user.id,
                activeChat.isTemp ? null : activeChat.conversationId
            );
        } catch (error) {
            console.error('Failed to send message:', error);
            // Optionally restore text on failure
            setMessageText(currentText);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const height = Math.min(textareaRef.current.scrollHeight, 24 * 5);
            textareaRef.current.style.height = `${height}px`;
        }
    }, [messageText]);

    useEffect(() => {
        if (!activeChat) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const date = entry.target.getAttribute('data-date');
                    const isSeparator = entry.target.classList.contains('date-separator');

                    if (isSeparator) {
                        setVisibleDates(prev => {
                            const next = new Set(prev);
                            if (entry.isIntersecting) next.add(date);
                            else next.delete(date);
                            return next;
                        });
                    } else {
                        setVisibleGroups(prev => {
                            const next = new Set(prev);
                            if (entry.isIntersecting) next.add(date);
                            else next.delete(date);
                            return next;
                        });
                    }
                });
            },
            {
                root: scrollRef.current,
                threshold: 0.1,
                rootMargin: '30px 0px 30px 0px'
            }
        );

        const separators = document.querySelectorAll('.date-separator');
        const groups = document.querySelectorAll('.date-group');

        separators.forEach(s => observer.observe(s));
        groups.forEach(g => observer.observe(g));

        return () => {
            separators.forEach(s => observer.unobserve(s));
            groups.forEach(g => observer.unobserve(g));
            observer.disconnect();
        };
    }, [activeChat, groupedMessages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteChat = () => {
        if (isDeleting) return;

        showConfirm(
            'Delete Conversation',
            'Are you sure you want to delete this conversation? This action cannot be undone.',
            async () => {
                setIsDeleting(true);
                const success = await deleteConversation(selectedId);
                if (success) {
                    showToast('Conversation deleted successfully', 'success');
                    setSelectedId(null);
                } else {
                    showToast('Failed to delete conversation', 'error');
                }
                setIsDeleting(false);
                setShowMoreMenu(false);
            }
        );
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex-col items-center justify-center p-8 text-center bg-gray-50/50 relative z-10 hidden md:flex">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                    <i className="ri-chat-smile-2-line text-4xl md:text-5xl text-main/20"></i>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Your Messages</h3>
                <p className="text-gray-500 text-sm max-w-[300px]">Select a conversation from the left to start chatting or see your history.</p>
            </div>
        );
    }

    return (
        <div className={`flex-1 flex flex-col bg-[#e5ddd5] dark:bg-[#0b141a] relative h-full min-w-0 ${!selectedId ? 'max-md:hidden' : ''}`}>
            {/* Chat Header - Fixed at Top */}
            <div className="h-[70px] px-4 md:px-6 rounded-b-2xl bg-white/40 dark:bg-[#202c33]/80 border-b border-gray-400 backdrop-blur-sm flex items-center justify-between shrink-0 z-30">
                <div className="flex items-center">
                    <button
                        onClick={() => setSelectedId(null)}
                        className="mr-3 w-9 h-9 flex items-center justify-center border-2 border-gray-100 rounded-2xl text-gray-500 transition-all active:scale-95 md:hidden"
                    >
                        <i className="ri-arrow-left-s-line text-2xl"></i>
                    </button>
                    <Link to={`/profile/${activeChat.user.id}`} className="flex items-center">
                        <div className="relative">
                            <img
                                src={activeChat.user.profileImageUrl ? `${IMAGE_BASE_URL}/${activeChat.user.profileImageUrl}` : USER_AVATAR}
                                alt={activeChat.user.userName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 m-0">{activeChat.user.userName}</h3>
                            <span className="text-[12px] text-green-500 font-medium">{activeChat.online ? 'Online' : ''}</span>
                        </div>
                    </Link>
                </div>

                <div className="relative" ref={moreMenuRef}>
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                    >
                        <i className="ri-more-2-fill text-xl"></i>
                    </button>

                    {showMoreMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#202c33] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden py-1 transform transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={handleDeleteChat}
                                disabled={isDeleting}
                                className="w-[90%] my-1 rounded-2xl mx-auto  px-4 py-3 flex items-center gap-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                            >
                                <i className="ri-delete-bin-line text-lg"></i>
                                {isDeleting ? 'Deleting...' : 'Delete Chat'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages Area - Scrollable */}
            {messagesLoading && (!messages[selectedId] || messages[selectedId].length === 0) ? (
                <ChatAreaSkeleton />
            ) : (
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 relative z-10"
                >
                    {messagesLoading && messages[selectedId]?.length > 0 && (
                        <div className="flex justify-center p-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-main"></div>
                        </div>
                    )}
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date} data-date={date} className="relative date-group">
                            <div
                                data-date={date}
                                className="sticky top-2 z-20 flex justify-center date-separator"
                            >
                                <span className={`px-4 py-1.5 bg-white/90 dark:bg-[#202c33]/90 backdrop-blur-sm border border-gray-100/20 shadow-sm rounded-xl text-[12px] font-semibold text-gray-500 dark:text-gray-400 capitalize transition-all duration-200 transform ${isScrolling || (visibleGroups.size > 1 && visibleDates.has(date)) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    {date}
                                </span>
                            </div>

                            {msgs.map((msg) => (
                                <MessageBubble
                                    key={msg.messageId}
                                    msg={msg}
                                    isSender={msg.isOwner}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Chat Input - Fixed at Bottom */}
            <div className="p-3 bg-gray-300/60 dark:bg-[#202c33]/80 backdrop-blur-xs rounded-t-2xl border-t border-gray-400 z-30">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-2 md:space-x-4">
                    <div className="flex-1">
                        <textarea
                            ref={textareaRef}
                            rows="1"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                            className="w-full ring-1 ring-gray-400 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 md:px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-main/20 transition-all shadow-inner resize-none min-h-[48px] max-h-[150px] overflow-y-auto"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-main text-white shadow-lg shadow-blue-100 hover:bg-optional disabled:opacity-50 disabled:shadow-none transition-all duration-300 active:scale-95 mb-2"
                    >
                        <i className="ri-send-plane-2-fill text-xl"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;

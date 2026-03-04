import React, { useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import ConversationSkeleton from '../Skeleton/ConversationSkeleton';

const ConversationList = ({ selectedId, setSelectedId }) => {
    const { conversations, fetchConversations, loading, hasMore } = useChat();
    const listScrollRef = useRef(null);

    // Initial loading skeletons
    if (loading && conversations.length === 0) {
        return (
            <div className={`w-full md:w-[350px] border-r border-gray-100 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 md:p-6 border-b border-gray-50 bg-gray-50/30">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Messages</h2>
                    <div className="h-11 bg-white border border-gray-100 rounded-xl"></div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {[...Array(8)].map((_, i) => <ConversationSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    const handleListScroll = () => {
        if (!listScrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = listScrollRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
            fetchConversations();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderLastMessageContent = (lastMessage) => {
        if (!lastMessage) return '';
        if (lastMessage.type === 2) return 'post shared';
        return lastMessage.content;
    };

    const renderTicks = (lastMessage) => {
        if (!lastMessage || !lastMessage.isOwner) return null;
        return (
            <i className={`ri-check-double-line ml-1 text-[14px] ${lastMessage.isRead ? 'text-blue-500' : 'text-gray-400'}`}></i>
        );
    };

    return (
        <div className={`w-full md:w-[350px] border-r border-gray-100 flex flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 md:p-6 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center justify-start mb-4 md:mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full h-11 bg-white border border-gray-100 rounded-xl pl-11 pr-4 text-sm focus:border-main outline-none transition-all"
                    />
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto custom-scrollbar p-2"
                ref={listScrollRef}
                onScroll={handleListScroll}
            >
                {conversations.map((chat) =>
                (
                    console.log(chat),
                    <div
                        key={chat.conversationId}
                        onClick={() => setSelectedId(chat.conversationId)}
                        className={`flex items-center px-4 py-3 md:py-2 rounded-2xl cursor-pointer transition-all duration-300 hover:bg-[#acacad] dark:hover:bg-[#182041] mb-1 last:mb-0 group ${selectedId === chat.conversationId ? 'bg-[#d3d5d8] dark:bg-[#15253b]' : ''}`}
                    >
                        <div className="relative shrink-0">
                            <img
                                src={chat.user.profileImageUrl ? `${IMAGE_BASE_URL}${chat.user.profileImageUrl}` : USER_AVATAR}
                                alt={chat.user.userName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-main transition-colors">{chat.user.userName}</h4>
                                <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap ml-2">
                                    {formatDate(chat.lastMessage?.sentAt)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center min-w-0">

                                    {renderTicks(chat.lastMessage)}
                                    <p className="text-[13px] truncate text-gray-500 ml-1">
                                        {renderLastMessageContent(chat.lastMessage)}
                                    </p>
                                </div>
                                {chat.unreadMessagesCount > 0 && (
                                    <span className="ml-2 w-5 h-5 flex items-center justify-center bg-main text-white text-[10px] font-bold rounded-full">
                                        {chat.unreadMessagesCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="mt-2">
                        {[...Array(3)].map((_, i) => <ConversationSkeleton key={i} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationList;

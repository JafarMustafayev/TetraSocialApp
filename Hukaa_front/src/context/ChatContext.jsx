import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getConversations, getMessages, deleteConversation as deleteConversationApi } from '../api/chat';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({}); // { conversationId: [messages] }
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesHasMore, setMessagesHasMore] = useState({}); // { conversationId: boolean }
    const { user } = useAuth();
    const isFetching = useRef(false);
    const isFetchingMessages = useRef(false);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    const fetchConversations = useCallback(async (reset = false) => {
        if (isFetching.current || (!hasMore && !reset)) return;

        isFetching.current = true;
        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const response = await getConversations(currentPage);

            if (response.success || response.data) {
                const newData = response.data || [];
                if (reset) {
                    setConversations(newData);
                    setPage(2);
                    setHasMore(newData.length > 0);
                } else {
                    setConversations(prev => [...prev, ...newData]);
                    setPage(prev => prev + 1);
                    if (newData.length === 0) setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [page, hasMore]);

    const fetchMessages = useCallback(async (conversationId, reset = false) => {
        if (!conversationId || isFetchingMessages.current || (!messagesHasMore[conversationId] && !reset && messages[conversationId])) return;

        isFetchingMessages.current = true;
        setMessagesLoading(true);
        try {
            const currentMessages = messages[conversationId] || [];
            const nextPage = reset ? 1 : Math.floor(currentMessages.length / 50) + 1;
            const response = await getMessages(conversationId, nextPage, 50);

            if (response.success || response.data) {
                const newData = response.data || [];
                setMessages(prev => ({
                    ...prev,
                    [conversationId]: reset ? newData : [...newData, ...(prev[conversationId] || [])]
                }));

                setMessagesHasMore(prev => ({
                    ...prev,
                    [conversationId]: newData.length === 50
                }));

                // Reset unread count locally
                if (reset) {
                    setConversations(prev => prev.map(conv =>
                        conv.conversationId === conversationId
                            ? { ...conv, unreadMessagesCount: 0 }
                            : conv
                    ));
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setMessagesLoading(false);
            isFetchingMessages.current = false;
        }
    }, [messages, messagesHasMore]);

    const deleteConversation = useCallback(async (conversationId) => {
        try {
            const response = await deleteConversationApi(conversationId);
            if (response.success) {
                setConversations(prev => prev.filter(conv => conv.conversationId !== conversationId));
                setMessages(prev => {
                    const newMessages = { ...prev };
                    delete newMessages[conversationId];
                    return newMessages;
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            return false;
        }
    }, []);

    // Fetch conversations on load
    useEffect(() => {
        if (user) {
            fetchConversations(true);
        } else {
            setConversations([]);
            setTotalUnreadCount(0);
        }
    }, [user]); // Only re-fetch when user changes

    // Calculate total unread count
    useEffect(() => {
        const count = conversations.reduce((acc, conv) => acc + (conv.unreadMessagesCount || 0), 0);
        setTotalUnreadCount(count);
    }, [conversations]);

    const value = {
        conversations,
        messages,
        loading,
        hasMore,
        messagesLoading,
        messagesHasMore,
        totalUnreadCount,
        fetchConversations,
        fetchMessages,
        deleteConversation,
        setConversations,
        setMessages
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

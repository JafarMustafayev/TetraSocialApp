import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getConversations, getMessages, deleteConversation as deleteConversationApi } from '../api/chat';
import { useAuth } from './AuthContext';
import signalRService from '../api/signalr';
import { SIGNALR_CHAT_HUB_URL, IMAGE_BASE_URL } from '../api/client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({}); // { conversationId: [messages] }
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesHasMore, setMessagesHasMore] = useState({}); // { conversationId: boolean }
    const [tempChat, setTempChat] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const { user } = useAuth();
    const isFetching = useRef(false);
    const isFetchingMessages = useRef(false);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    const startNewChat = useCallback((otherUser) => {
        const existingConv = conversations.find(c => c.user.id === otherUser.id);
        if (existingConv) {
            setTempChat(null);
            return existingConv.conversationId;
        }

        const newTempChat = {
            conversationId: `new_${otherUser.id}`,
            user: {
                id: otherUser.id,
                userName: otherUser.userName,
                profileImageUrl: otherUser.profileImageUrl || otherUser.profilePhoto
            },
            isTemp: true,
            lastMessage: null,
            unreadMessagesCount: 0
        };

        setTempChat(newTempChat);
        return newTempChat.conversationId;
    }, [conversations]);

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
                setMessages(prev => {
                    const combined = reset ? newData : [...newData, ...(prev[conversationId] || [])];
                    return {
                        ...prev,
                        [conversationId]: combined.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
                    };
                });

                setMessagesHasMore(prev => ({
                    ...prev,
                    [conversationId]: newData.length === 50
                }));

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

    const sendMessage = useCallback(async (content, receiverId, conversationId) => {
        try {
            const payload = {
                content,
                receiverId,
                conversationId: conversationId && conversationId.startsWith('new_') ? null : conversationId,
                postId: null
            };
            await signalRService.invoke('chat', 'SendMessage', payload);
        } catch (err) {
            console.error('Failed to send message via SignalR:', err);
            throw err;
        }
    }, []);

    const markAsRead = useCallback(async (conversationId) => {
        if (!conversationId || conversationId.startsWith('new_')) return;
        try {
            await signalRService.invoke('chat', 'MarkAsRead', { conversationId });
        } catch (err) {
            console.error('Failed to mark as read via SignalR:', err);
        }
    }, []);

    const handleMessagesRead = useCallback((data) => {
        const { conversationId } = data;

        // 1. Update conversations list: set unread to 0 and mark last message as read
        setConversations(prev => prev.map(conv => {
            if (conv.conversationId === conversationId) {
                return {
                    ...conv,
                    unreadMessagesCount: 0,
                    lastMessage: conv.lastMessage ? { ...conv.lastMessage, isRead: true } : null
                };
            }
            return conv;
        }));

        // 2. If it's the current active chat, invoke MarkAsRead back per user request
        if (selectedId === conversationId) {
            markAsRead(conversationId);

            // Also update any messages in state to show they are read
            setMessages(prev => {
                if (!prev[conversationId]) return prev;
                return {
                    ...prev,
                    [conversationId]: prev[conversationId].map(m => ({ ...m, isRead: true }))
                };
            });
        }
    }, [selectedId, markAsRead]);

    const handleReceiveMessage = useCallback((message) => {
        let convId = message.conversationId;

        if (!convId) {
            if (message.isOwner) {
                convId = selectedId;
            } else {
                const conversation = conversations.find(c => c.user.id === message.senderId);
                convId = conversation?.conversationId;

                if (!convId && tempChat && tempChat.user.id === message.senderId) {
                    convId = tempChat.conversationId;
                }
            }
        }

        if (!convId) {
            fetchConversations(true);
            return;
        }

        // 1. Add message to state and sort
        setMessages(prev => {
            const existing = prev[convId] || [];
            if (existing.some(m => m.messageId === message.messageId)) return prev;
            const updated = [...existing, message];
            return {
                ...prev,
                [convId]: updated.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
            };
        });

        // 2. Update conversations list incrementally
        setConversations(prev => {
            const index = prev.findIndex(c => c.conversationId === convId);
            const isCurrentlySelected = selectedId === convId;

            if (index !== -1) {
                const updated = [...prev];
                const conv = { ...updated[index] };
                conv.lastMessage = message;
                if (message.conversationId && conv.conversationId !== message.conversationId) {
                    conv.conversationId = message.conversationId;
                }
                if (!isCurrentlySelected && !message.isOwner) {
                    conv.unreadMessagesCount = (conv.unreadMessagesCount || 0) + 1;
                }
                updated.splice(index, 1);
                return [conv, ...updated];
            } else if (tempChat && tempChat.conversationId === convId) {
                const newRealConv = {
                    ...tempChat,
                    conversationId: message.conversationId || tempChat.conversationId,
                    lastMessage: message,
                    isTemp: false
                };
                return [newRealConv, ...prev];
            }
            return prev;
        });

        // Clear tempChat if matched
        setTempChat(prev => {
            if (prev && (prev.user.id === message.senderId || prev.user.id === message.receiverId)) {
                return null;
            }
            return prev;
        });
    }, [conversations, selectedId, tempChat, fetchConversations]);

    // Hub Connection
    useEffect(() => {
        if (user) {
            const hubUrl = IMAGE_BASE_URL + SIGNALR_CHAT_HUB_URL;
            signalRService.startConnection('chat', hubUrl);

            return () => {
                signalRService.stopConnection('chat');
            };
        }
    }, [user]);

    // Hub Listeners
    useEffect(() => {
        if (user) {
            signalRService.on('chat', 'ReceiveMessage', handleReceiveMessage);
            signalRService.on('chat', 'MessagesRead', handleMessagesRead);
            return () => {
                signalRService.off('chat', 'ReceiveMessage', handleReceiveMessage);
                signalRService.off('chat', 'MessagesRead', handleMessagesRead);
            };
        }
    }, [user, handleReceiveMessage, handleMessagesRead]);

    // Initial fetch
    useEffect(() => {
        if (user) {
            fetchConversations(true);
        } else {
            setConversations([]);
            setTotalUnreadCount(0);
        }
    }, [user]);

    useEffect(() => {
        const count = conversations.reduce((acc, conv) => acc + (conv.unreadMessagesCount || 0), 0);
        setTotalUnreadCount(count);
    }, [conversations]);

    // RAM Optimization: Clear messages history for previous chats
    const prevSelectedId = useRef(selectedId);
    useEffect(() => {
        if (prevSelectedId.current && prevSelectedId.current !== selectedId) {
            const oldId = prevSelectedId.current;
            setMessages(prev => {
                const updated = { ...prev };
                delete updated[oldId];
                return updated;
            });
            setMessagesHasMore(prev => {
                const updated = { ...prev };
                delete updated[oldId];
                return updated;
            });
        }
        prevSelectedId.current = selectedId;
    }, [selectedId]);

    const value = {
        conversations,
        messages,
        loading,
        hasMore,
        messagesLoading,
        messagesHasMore,
        totalUnreadCount,
        tempChat,
        selectedId,
        setSelectedId,
        fetchConversations,
        fetchMessages,
        deleteConversation,
        startNewChat,
        sendMessage,
        markAsRead,
        setConversations,
        setMessages,
        setTempChat
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

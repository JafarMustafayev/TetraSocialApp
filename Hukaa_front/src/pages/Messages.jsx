import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import ConversationList from '../components/Messages/ConversationList';
import ChatArea from '../components/Messages/ChatArea';

const Messages = () => {
    const { fetchConversations, setSelectedId: setContextSelectedId, conversations } = useChat();
    const [selectedId, setSelectedId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [initialMessage, setInitialMessage] = useState('');

    useEffect(() => {
        fetchConversations(true);
    }, []);

    // Handle query parameters for starting a chat with a specific user
    useEffect(() => {
        const userId = searchParams.get('userId');
        const message = searchParams.get('message');

        if (userId && conversations.length > 0) {
            const existingConv = conversations.find(c => c.user.id === userId);
            if (existingConv) {
                setSelectedId(existingConv.conversationId);
            }
            // If they don't have an existing chat, the logic in ChatContext
            // for startNewChat would be needed here if we wanted to open a temp chat.
            // For now, selecting existing one or waiting for user interaction works.

            if (message) {
                setInitialMessage(message);
            }

            // Clear params to avoid re-triggering
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, conversations]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="flex bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden  h-[calc(100vh-112px)] md:h-[calc(100vh-110px)] animate-fade-in-up">
            <ConversationList selectedId={selectedId} setSelectedId={setSelectedId} />
            <ChatArea
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                initialMessage={initialMessage}
                setInitialMessage={setInitialMessage}
            />
        </div>
    );
};

export default Messages;

import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ConversationList from '../components/Messages/ConversationList';
import ChatArea from '../components/Messages/ChatArea';

const Messages = () => {
    const { fetchConversations, setSelectedId: setContextSelectedId } = useChat();
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchConversations(true);
    }, []);

    // Also update context if needed, though we use local state for navigation
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
            <ChatArea selectedId={selectedId} setSelectedId={setSelectedId} />
        </div>
    );
};

export default Messages;

import React, { useState } from 'react';
import ConversationList from '../components/messages/ConversationList';
import ChatPanel from '../components/messages/ChatPanel';

const mockConversations = [
  {
    id: 1,
    name: 'Prototürk AI',
    username: '@prototurk_ai',
    avatar: 'PR',
    lastMessage: 'You: This message is for testing',
    lastMessageAt: 'Today',
    unreadCount: 0,
    isArchived: false,
    isPinned: true,
    isMuted: false,
  },
  {
    id: 2,
    name: 'Jafar Mustafayev',
    username: '@JafarMustafayev',
    avatar: 'JM',
    lastMessage: 'Hello, how are you?',
    lastMessageAt: 'Today',
    unreadCount: 2,
    isArchived: false,
    isPinned: false,
    isMuted: false,
  },
  {
    id: 3,
    name: 'Archive Group',
    username: '@archive_group',
    avatar: 'AG',
    lastMessage: 'This is an archived message.',
    lastMessageAt: 'Yesterday',
    unreadCount: 0,
    isArchived: true,
    isPinned: false,
    isMuted: true,
  }
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const mockMessages = {
  1: [

    {
      id: 2,
      conversationId: 1,
      senderId: 'me',
      text: 'Hello, this is the first test message',
      createdAt: yesterday.toISOString(),
      status: 'read',
      isMine: true
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 'me',
      text: 'This message is for testing',
      createdAt: today.toISOString(),
      status: 'delivered',
      isMine: true
    }
  ],
  2: [
    {
      id: 4,
      conversationId: 2,
      senderId: 'other',
      text: 'Conversation with Prototürk AI started',
      createdAt: twoDaysAgo.toISOString(),
      isSystem: true
    }
  ],
  3: []
};

const Messages = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [messagesData, setMessagesData] = useState(mockMessages);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [openConversationMenuId, setOpenConversationMenuId] = useState(null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const messages = selectedConversationId ? (messagesData[selectedConversationId] || []) : [];

  const handleSendMessage = (text, attachments = null) => {
    if (!selectedConversationId) return;

    const newMessage = {
      id: Date.now(),
      conversationId: selectedConversationId,
      senderId: 'me',
      text: text,
      attachments: attachments,
      createdAt: new Date().toISOString(),
      status: 'sent',
      isMine: true
    };

    setMessagesData(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage]
    }));

    // Optionally update the conversation list lastMessage preview
    setConversations(prev => prev.map(c => {
      if (c.id === selectedConversationId) {
        return {
          ...c,
          lastMessage: (attachments && attachments.length > 0) ? '📎 Attachment(s) sent' : `You: ${text}`,
          lastMessageAt: 'Just now'
        };
      }
      return c;
    }));
  };

  const handleAction = (action, conversationId) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        if (action === 'pin') return { ...c, isPinned: !c.isPinned };
        if (action === 'mute') return { ...c, isMuted: !c.isMuted };
        if (action === 'archive') return { ...c, isArchived: !c.isArchived };
      }
      return c;
    }));
    setOpenConversationMenuId(null);
  };

  const handleDelete = (conversationId) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
    }
    setOpenConversationMenuId(null);
  };

  return (
    <div className="flex-1 flex min-w-0 h-[calc(100vh-60px)] md:h-screen overflow-hidden bg-white dark:bg-black">
      {/* Conversation List Sidebar */}
      <div
        className={`w-full md:w-[250px] lg:w-[300px] shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 ${selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
      >
        <ConversationList
          conversations={conversations}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          openConversationMenuId={openConversationMenuId}
          setOpenConversationMenuId={setOpenConversationMenuId}
          handleAction={handleAction}
          handleDelete={handleDelete}
        />
      </div>

      {/* Chat Detail Panel */}
      <div
        className={`flex-1 min-w-0 flex flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'
          }`}
      >
        <ChatPanel
          conversation={selectedConversation}
          messages={messages}
          onBack={() => setSelectedConversationId(null)}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Messages;

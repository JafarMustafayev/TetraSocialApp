// src/components/messages/ConversationList.jsx
import { Search, MailPlus, ChevronDown } from 'lucide-react';
import ConversationItem from './ConversationItem';
import Tabs from '../ui/Tabs';

const ConversationList = ({
  conversations,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedConversationId,
  setSelectedConversationId,
  openConversationMenuId,
  setOpenConversationMenuId,
  handleAction,
  handleDelete
}) => {
  // Filter conversations based on tab and search
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'archived' ? c.isArchived : !c.isArchived;
    return matchesSearch && matchesTab;
  });

  const messageTabs = [
    { id: 'all', label: 'All chats' },
    { id: 'archived', label: 'Archived' }
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Messages</h2>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-full transition-colors">
            <span>All</span>
            <ChevronDown size={16} />
          </button>
          <button className="p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <MailPlus size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500 dark:text-gray-400 group-focus-within:text-main transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-full leading-5 bg-gray-100 dark:bg-[#202327] text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-black focus:border-main focus:ring-1 focus:ring-main sm:text-sm transition-all"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-2">
        <Tabs tabs={messageTabs} activeTab={activeTab} onChange={setActiveTab} className="bg-transparent! " />
      </div>



      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              isMenuOpen={openConversationMenuId === conversation.id}
              onMenuToggle={setOpenConversationMenuId}
              onAction={handleAction}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              No chats found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try searching for something else.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
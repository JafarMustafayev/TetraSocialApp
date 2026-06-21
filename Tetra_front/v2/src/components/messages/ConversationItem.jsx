// src/components/messages/ConversationItem.jsx
import React, { useEffect, useRef } from 'react';
import { MoreHorizontal, Pin, BellOff, Archive, Trash2 } from 'lucide-react';

const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
  isMenuOpen,
  onMenuToggle,
  onAction,
  onDelete
}) => {
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (isMenuOpen) {
          onMenuToggle(null);
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        onMenuToggle(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, onMenuToggle]);

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center p-4 cursor-pointer transition-colors duration-200 group
        ${isSelected
          ? 'bg-gray-100 dark:bg-gray-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-900'}
        ${isMenuOpen ? 'z-20 bg-gray-100 dark:bg-gray-800' : 'z-0'}
      `}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold shrink-0">
        {conversation.avatar}
      </div>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1 relative">
          <h3 className="font-semibold text-[15px] truncate text-gray-900 dark:text-gray-100 pr-8">
            {conversation.name}
          </h3>
          <span className={`text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2 absolute right-0 top-1 transition-opacity ${isMenuOpen ? 'opacity-0' : 'group-hover:opacity-0 opacity-100'}`}>
            {conversation.lastMessageAt}
          </span>
        </div>
        <p className="text-[14px] text-gray-500 dark:text-gray-400 truncate pr-6">
          {conversation.lastMessage}
        </p>
      </div>

      {/* 3 dots menu button */}
      <div
        className={`absolute right-4 top-4 flex items-center justify-center
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
          transition-opacity duration-200`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle(isMenuOpen ? null : conversation.id);
          }}
          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors bg-white dark:bg-black md:bg-transparent md:dark:bg-transparent shadow-sm md:shadow-none"
        >
          <MoreHorizontal size={18} />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-8 w-48 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onAction('pin', conversation.id)}
              className="flex items-center px-4 py-3 mx-1 my-0.5 rounded-lg text-[15px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Pin size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
              {conversation.isPinned ? 'Unpin' : 'Pin'}
            </button>
            <button
              onClick={() => onAction('mute', conversation.id)}
              className="flex items-center px-4 py-3 mx-1 my-0.5 rounded-lg text-[15px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <BellOff size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
              {conversation.isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button
              onClick={() => onAction('archive', conversation.id)}
              className="flex items-center px-4 py-3 mx-1 my-0.5 rounded-lg text-[15px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Archive size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
              {conversation.isArchived ? 'Unarchive' : 'Archive'}
            </button>
            <button
              onClick={() => onDelete(conversation.id)}
              className="flex items-center px-4 py-3 mx-1 my-0.5 rounded-lg text-[15px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={18} className="mr-3 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;

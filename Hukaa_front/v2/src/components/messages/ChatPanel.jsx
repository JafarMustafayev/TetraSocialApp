// src/components/messages/ChatPanel.jsx
import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Search, MoreHorizontal, ChevronDown } from 'lucide-react';
import MessageComposer from './MessageComposer';
import MessageBubble from './MessageBubble';
import ImageModal from '../ui/ImageModal';
import { groupMessagesByDate } from '../../utils/dateFormatter';

const ChatPanel = ({ conversation, messages, onBack, onSendMessage }) => {
  const scrollRef = useRef(null);
  const observerRef = useRef(null);

  const [floatingDate, setFloatingDate] = useState(null);
  const [isFloatingDateVisible, setIsFloatingDateVisible] = useState(false);
  const hideTimeoutRef = useRef(null);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);

  // State for image modal
  const [galleryData, setGalleryData] = useState(null); // { images: [], index: 0 }

  // Group messages
  const groupedMessages = groupMessagesByDate(messages);

  // Auto scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;

      if (!isScrolledUp) {
        // If already at bottom, scroll down to show new message
        scrollRef.current.scrollTop = scrollHeight;
      } else {
        // If scrolled up, show "new message" indicator
        setShowNewMessageIndicator(true);
      }
    }
  }, [messages]);

  // Handle conversation change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowNewMessageIndicator(false);
    }
  }, [conversation]);

  // Scroll handler for floating date
  useEffect(() => {
    const handleScroll = () => {
      // Show indicator
      if (!isFloatingDateVisible && floatingDate) {
        setIsFloatingDateVisible(true);
      }

      // Clear previous timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Hide indicator after 1.5s of no scrolling
      hideTimeoutRef.current = setTimeout(() => {
        setIsFloatingDateVisible(false);
      }, 1500);

      // Also hide new message indicator if scrolled to bottom
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollHeight - scrollTop - clientHeight <= 20) {
          setShowNewMessageIndicator(false);
        }
      }
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener('scroll', handleScroll);
      }
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [floatingDate, isFloatingDateVisible]);

  // Intersection Observer for Date Separators
  useEffect(() => {
    const options = {
      root: scrollRef.current,
      rootMargin: '0px 0px -90% 0px', // Trigger when element is near the top
      threshold: 0
    };

    const callback = (entries) => {
      // Find the currently intersecting or most recently intersected date group
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const dateStr = entry.target.getAttribute('data-date');
          setFloatingDate(dateStr);
        }
      });
    };

    observerRef.current = new IntersectionObserver(callback, options);

    const separators = document.querySelectorAll('.date-separator-marker');
    separators.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [groupedMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setShowNewMessageIndicator(false);
    }
  };

  const handleSend = (text, imgUrl) => {
    onSendMessage(text, imgUrl);
    // Force scroll to bottom when user sends a message
    setTimeout(scrollToBottom, 50);
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-black h-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Select a chat
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Choose an existing conversation or start a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#E5DDD5] dark:bg-[#0b141a] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-[#f0f2f5] dark:bg-[#202c33] sticky top-0 z-20 h-[60px]">
        {/* Back button (Mobile only) */}
        <button
          onClick={onBack}
          className="md:hidden mr-2 p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={20} />
        </button>

        {/* User Info */}
        <div className="flex items-center flex-1 min-w-0 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold mr-3 shrink-0">
            {conversation.avatar}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
              {conversation.name}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate leading-tight">
              {conversation.username}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 ml-4 text-gray-600 dark:text-[#aebac1]">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hidden sm:block">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Floating Date Indicator */}
      <div
        className={`absolute top-[70px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300 ${isFloatingDateVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="bg-white/80 dark:bg-[#182229]/90 backdrop-blur-sm shadow-sm text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-lg">
          {floatingDate}
        </div>
      </div>

      {/* Messages List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar flex flex-col relative"
      >
        {groupedMessages.map((group) => (
          <div key={group.date} className="flex flex-col date-separator-marker" data-date={group.date}>

            {/* Date Separator Pill */}
            <div className="flex justify-center my-3">
              <span className="bg-white/80 dark:bg-[#182229]/90 shadow-sm text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-lg uppercase">
                {group.date}
              </span>
            </div>

            {/* Messages in Group */}
            {group.messages.map((msg, index) => {
              // System Message
              if (msg.isSystem) {
                return (
                  <></>
                );
              }

              // Determine spacing based on previous message sender
              const prevMsg = index > 0 ? group.messages[index - 1] : null;
              const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId || prevMsg.isSystem;

              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isFirstInGroup={isFirstInGroup}
                  onImageClick={(images, index) => setGalleryData({ images, index })}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* New Message Indicator */}
      {showNewMessageIndicator && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-[80px] right-4 bg-white dark:bg-[#202c33] text-gray-600 dark:text-[#aebac1] p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-colors z-10"
        >
          <ChevronDown size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-main rounded-full border-2 border-white dark:border-[#202c33]"></span>
        </button>
      )}

      {/* Composer */}
      <div className="bg-[#f0f2f5] dark:bg-[#202c33]">
        <MessageComposer onSend={handleSend} />
      </div>

      {/* Image Modal */}
      {galleryData && (
        <ImageModal
          images={galleryData.images}
          initialIndex={galleryData.index}
          onClose={() => setGalleryData(null)}
        />
      )}
    </div>
  );
};

export default ChatPanel;

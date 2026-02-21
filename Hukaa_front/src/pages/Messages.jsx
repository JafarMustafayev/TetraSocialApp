import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, USER_AVATAR } from '../api/client';

const Messages = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const scrollRef = useRef(null);

    // ... conversations and messages mock data ...
    // (keeping them the same as before)
    const conversations = [
        { id: 1, name: 'James Vanwin', avatar: USER_AVATAR, lastMessage: 'Hello, dear I want talk to you?', time: '7:45 AM', online: true, unread: 2 },
        { id: 2, name: 'Sandra Cross', avatar: USER_AVATAR, lastMessage: 'Sure, I can help with that.', time: 'Yesterday', online: false, unread: 0 },
        { id: 3, name: 'Jose Marroquin', avatar: USER_AVATAR, lastMessage: 'Check out the new designs!', time: '2 days ago', online: true, unread: 0 },
        { id: 4, name: 'Sarah Connor', avatar: USER_AVATAR, lastMessage: 'I will be there in 5 mins.', time: 'Monday', online: true, unread: 5 }
    ];

    const messages = [
        { id: 1, senderId: 1, text: 'Hello, dear I want talk to you?', time: '7:45 AM' },
        { id: 2, senderId: 0, text: 'Said how can I cooperate with you?', time: '7:46 AM' },
        { id: 3, senderId: 1, text: 'I need some ideas from you about my design', time: '7:47 AM' },
        { id: 4, senderId: 0, text: 'What you want to know about design', time: '7:48 AM' },
        { id: 5, senderId: 1, text: 'With everything I know about design, I can help you in many ways', time: '7:50 AM' },
        { id: 6, senderId: 0, text: "Ok, I'm taking note I'm telling you everything I need", time: '7:51 AM' },
        { id: 7, senderId: 1, text: 'I am waiting for your note, I am waiting for your note , I am waiting for your note ,I am waiting for your note I am waiting for your note, I am waiting for your note , I am waiting for your note ,I am waiting for your note I am waiting for your note, I am waiting for your note , I am waiting for your note ,I am waiting for your note I am waiting for your note, I am waiting for your note , I am waiting for your note ,I am waiting for your note', time: '7:52 AM' },
        { id: 8, senderId: 0, text: 'What makes you different from other learning platforms?', time: '7:55 AM' }
    ];

    const activeChat = conversations.find(c => c.id === selectedId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedId]);

    // Handle ESC key to close chat
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const textareaRef = useRef(null);

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!messageText.trim()) return;
        console.log('Sending message:', messageText);
        setMessageText('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
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
            const height = Math.min(textareaRef.current.scrollHeight, 24 * 5); // Approximately 5 rows
            textareaRef.current.style.height = `${height}px`;
        }
    }, [messageText]);

    return (
        <div className="flex bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-140px)] animate-fade-in-up">
            {/* Sidebar - Conversation List */}
            <div className={`w-full lg:w-[350px] border-r border-gray-100 flex flex-col ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-[#3644D9] hover:bg-[#3644D9] hover:text-white transition-all duration-300">
                            <i className="ri-edit-line text-lg"></i>
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full h-11 bg-white border border-gray-100 rounded-xl pl-11 pr-4 text-sm focus:border-[#3644D9] outline-none transition-all"
                        />
                        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {conversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedId(chat.id)}
                            className={`flex items-center px-4 py-2  rounded-2xl cursor-pointer transition-all duration-300 mb-1 last:mb-0 group ${selectedId === chat.id ? 'bg-[#d3d5d8]' : 'hover:bg-gray-200'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <img
                                    src={chat.avatar}
                                    alt={chat.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                {chat.online && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-[15px] font-bold text-gray-800 truncate group-hover:text-[#3644D9] transition-colors">{chat.name}</h4>
                                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap ml-2">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-[13px] truncate ${chat.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                        {chat.lastMessage}
                                    </p>
                                    {chat.unread > 0 && (
                                        <span className="ml-2 w-5 h-5 flex items-center justify-center bg-[#3644D9] text-white text-[10px] font-bold rounded-full">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[80px] px-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="mr-4 w-9 h-9  flex items-center justify-center border-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-[#3644D9] hover:text-white transition-all"
                                >
                                    <i className="ri-arrow-left-s-line text-2xl"></i>
                                </button>
                                <div className="relative ml-3">
                                    <img
                                        src={activeChat.avatar}
                                        alt={activeChat.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {activeChat.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-base font-bold text-gray-800 m-0">{activeChat.name}</h3>
                                    <span className="text-[12px] text-green-500 font-medium">{activeChat.online ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>

                        </div>

                        {/* Messages Body */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4"
                        >
                            <div className="flex justify-center my-6">
                                <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-[11px] font-bold text-gray-400 uppercase tracking-wider">Today</span>
                            </div>

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[60%] ${msg.senderId === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`shrink-0 ${msg.senderId === 0 ? 'ml-3' : 'mr-3'}`}>
                                            <img
                                                src={msg.senderId === 0 ? USER_AVATAR : activeChat.avatar}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                                onError={(e) => { e.target.src = USER_AVATAR }}
                                            />
                                        </div>
                                        <div>
                                            <div className={`px-3 py-2 rounded-2xl shadow-sm text-[14px] leading-relaxed text-white ${msg.senderId === 0
                                                ? 'bg-[#3644D9]  rounded-tr-none'
                                                : 'bg-gray-700  border border-gray-100 rounded-tl-none'
                                                }`}>
                                                <p>{msg.text}</p>
                                            </div>
                                            <span className={`text-[10px] mt-1.5 block font-bold text-gray-400 ${msg.senderId === 0 ? 'text-right' : 'text-left'}`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
                            <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                                <div className="flex items-center pb-1">
                                    <button type="button" className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 hover:text-[#3644D9] transition-all">
                                        <i className="ri-image-line text-xl"></i>
                                    </button>
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={textareaRef}
                                        rows="1"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your message..."
                                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#3644D9]/20 transition-all shadow-inner resize-none min-h-[48px] overflow-y-auto"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#3644D9] text-white shadow-lg shadow-blue-100 hover:bg-[#2E3AB8] disabled:opacity-50 disabled:shadow-none transition-all duration-300"
                                >
                                    <i className="ri-send-plane-2-fill text-xl"></i>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                            <i className="ri-chat-smile-2-line text-5xl text-[#3644D9]/20"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Your Messages</h3>
                        <p className="text-gray-500 max-w-[300px]">Select a conversation from the left to start chatting or see your history.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;

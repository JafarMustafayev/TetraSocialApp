import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR } from '../api/client';

const ConnectionsPopup = ({ isOpen, onClose, initialTab = 'followers', followers = [], following = [] }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            setActiveTab(initialTab);
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, initialTab, onClose]);

    if (!isOpen) return null;

    const currentList = activeTab === 'followers' ? followers : following;

    // Dummy data if empty for demonstration (can be replaced with real data fetching)
    const displayList = currentList && currentList.length > 0 ? currentList : [
        { id: 1, name: 'Shawn Lynch', location: 'New York, USA', img: USER_AVATAR },
        { id: 2, name: 'Kenneth Perry', location: 'London, UK', img: USER_AVATAR },
        { id: 3, name: 'Marvin McKinney', location: 'Tokyo, Japan', img: USER_AVATAR },
        { id: 4, name: 'Bessie Cooper', location: 'Paris, France', img: USER_AVATAR },
    ];

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-fade-in-up flex flex-col h-[85vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Connections</h3>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-50 px-6">
                    <button
                        className={`flex-1 py-4 font-bold text-[15px] transition-all relative ${activeTab === 'followers'
                            ? 'text-main after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-main after:rounded-t-full'
                            : 'text-gray-400 hover:text-main'
                            }`}
                        onClick={() => setActiveTab('followers')}
                    >
                        Followers
                    </button>
                    <button
                        className={`flex-1 py-4 font-bold text-[15px] transition-all relative ${activeTab === 'following'
                            ? 'text-main after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-main after:rounded-t-full'
                            : 'text-gray-400 hover:text-main'
                            }`}
                        onClick={() => setActiveTab('following')}
                    >
                        Following
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto grow p-6 custom-scrollbar">
                    <div className="space-y-6">
                        {displayList.map((user) => (
                            <div key={user.id} className="flex items-center justify-between group">
                                <div className="flex items-center">
                                    <div className="shrink-0">
                                        <img src={user.img} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-main/20 transition-all" alt={user.name} />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-[15px] font-bold text-gray-800 hover:text-main transition-colors leading-tight">{user.name}</h4>
                                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{user.location}</span>
                                    </div>
                                </div>
                                <button className="px-4 py-1.5 text-xs font-bold text-main bg-blue-50 rounded-xl hover:bg-main hover:text-white transition-all shadow-sm shadow-blue-100/50">
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                    <p className="text-xs text-gray-400 font-medium">To see more details, visit your friends page</p>
                </div>
            </div>
        </div>
    );
};

export default ConnectionsPopup;

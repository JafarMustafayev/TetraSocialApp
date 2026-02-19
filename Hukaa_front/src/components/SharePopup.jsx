import React, { useEffect } from 'react';

const SharePopup = ({ isOpen, onClose, friends = [], postLink }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-1000 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-xl text-gray-800">Share with Friends</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                <div className="p-4 bg-blue-50/50 flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-xl border border-blue-100 grow flex items-center justify-between">
                        <span className="text-sm text-gray-500 truncate mr-4">{postLink}</span>
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex items-center"
                            onClick={() => {
                                navigator.clipboard.writeText(postLink);
                            }}>
                            <i className="ri-file-copy-line mr-1"></i> Copy Link
                        </button>
                    </div>
                </div>

                <div className="grow overflow-y-auto p-4 space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Recent Contacts</p>
                    {friends.map(friend => (
                        <div key={friend.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200">
                                    <img src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors block">{friend.name}</span>
                                    <span className="text-xs text-gray-400">Suggest for you</span>
                                </div>
                            </div>
                            <button className="bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-xl text-sm font-bold transition-all border border-gray-200 hover:border-blue-600">
                                Send
                            </button>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default SharePopup;

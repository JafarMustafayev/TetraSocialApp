import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacySettings = () => {
    const navigate = useNavigate();

    const items = [
        { id: 'last_seen', title: 'Who can see last seen', value: 'Everyone' },
        { id: 'number', title: 'Who can see my number', value: 'Nobody' },
        { id: 'email', title: 'Who can see my email', value: 'My Contacts' },
        { id: 'online', title: 'Who can see online indicator', value: 'Everyone' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-main hover:text-white transition-all">
                    <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Privacy Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Control your visibility</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#161a29] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {items.map((item, index) => (
                    <div key={item.id} className={`p-6 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#111420] transition-all cursor-pointer ${index !== items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white text-base">{item.title}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-main">{item.value}</span>
                            <i className="ri-arrow-right-s-line text-gray-300 dark:text-gray-600 text-2xl"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrivacySettings;

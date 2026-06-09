// src/components/widgets/SuggestedUsersWidget.jsx
import React from 'react';
import { USER_AVATAR } from '../../api/api-config';

const SuggestedUsersWidget = ({ count = 10 }) => {
    const suggestions = [
        { id: 1, name: 'Anar Aliyev', username: 'anar_a' },
        { id: 2, name: 'Leyla Guliyeva', username: 'leyla_g' },
        { id: 3, name: 'Tural Hasanov', username: 'tural_h' },
        { id: 4, name: 'Anar Aliyev', username: 'anar_a' },
        { id: 5, name: 'Anar Aliyev', username: 'anar_a' },

    ];

    return (
        <div className="bg-white dark:bg-[#161a29] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Who to follow</h3>
                <button className="text-[10px] font-bold text-main uppercase hover:underline">View All</button>
            </div>
            <div className="space-y-4">
                {suggestions.slice(0, count).map((user) => (
                    <div key={user.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <img src={USER_AVATAR} className="w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800" alt={user.name} />
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-gray-800 dark:text-white truncate">{user.name}</h4>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">@{user.username}</p>
                            </div>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-blue-900/20 text-main hover:bg-main hover:text-white transition-all">
                            <i className="ri-user-add-line text-sm"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUsersWidget;

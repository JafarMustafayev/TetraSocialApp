import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const ActivitiesSidebar = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const isSettings = location.pathname === '/settings';
    const isActivities = location.pathname === '/my-activities';

    const currentTab = searchParams.get('tab');
    const currentSection = searchParams.get('section');

    const activityItems = [
        { id: 'liked', label: 'Liked posts', icon: 'ri-heart-line' },
        { id: 'saved', label: 'Saved posts', icon: 'ri-star-line' },
        { id: 'archived', label: 'Archived posts', icon: 'ri-archive-line' },
    ];

    const settingItems = [
        { id: 'profile-information', label: 'Profile Information', icon: 'ri-user-line' },
        { id: 'profile-photos', label: 'Profile Photos', icon: 'ri-image-line' },
        { id: 'work-experience', label: 'Work Experience', icon: 'ri-briefcase-line' },
        { id: 'change-username', label: 'Change Username', icon: 'ri-id-card-line' },
        { id: 'privacy', label: 'Privacy Settings', icon: 'ri-shield-user-line' },
        { id: 'change-password', label: 'Change Password', icon: 'ri-lock-password-line' },
    ];

    const menuItems = isActivities ? activityItems : (isSettings ? settingItems : []);
    const paramKey = isActivities ? 'tab' : 'section';
    const activeId = isActivities ? (currentTab || 'liked') : (currentSection || null);

    if (!isSettings && !isActivities) return null;

    return (
        <div className="fixed left-[165px] top-[85px] h-[calc(100vh-85px)] w-[240px] z-50 transition-all duration-300 hidden lg:block border-l border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="h-full flex flex-col">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        {isSettings ? 'Settings' : 'Activities'}
                    </h3>
                </div>
                <nav className="flex-1 overflow-y-auto custom-scrollbar p-3">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={`${location.pathname}?${paramKey}=${item.id}`}
                                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all group relative ${activeId === item.id
                                        ? 'text-[#3644D9] bg-blue-50'
                                        : 'text-gray-500 hover:text-[#3644D9] hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all ${activeId === item.id
                                        ? 'bg-[#3644D9] text-white shadow-lg shadow-blue-100'
                                        : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-[#3644D9]'
                                        }`}>
                                        <i className={`${item.icon} text-base`}></i>
                                    </div>
                                    <span>{item.label}</span>
                                    {activeId === item.id && (
                                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#3644D9] shadow-[0_0_10px_rgba(54,68,217,0.5)]"></div>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ActivitiesSidebar;

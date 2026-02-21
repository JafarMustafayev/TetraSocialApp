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
        { id: 'liked', label: 'Liked posts', icon: 'flaticon-heart-shape-outline' },
        { id: 'saved', label: 'Saved posts', icon: 'flaticon-star' },
        { id: 'archived', label: 'Archived posts', icon: 'flaticon-private' },
    ];

    const settingItems = [
        { id: 'profile-information', label: 'Profile Information', icon: 'flaticon-user' },
        { id: 'profile-photos', label: 'Profile Photos', icon: 'flaticon-image' },
        { id: 'work-experience', label: 'Work Experience', icon: 'flaticon-calendar' },
        { id: 'change-username', label: 'Change Username', icon: 'flaticon-edit' },
        { id: 'privacy', label: 'Privacy Settings', icon: 'flaticon-privacy' },
        { id: 'change-password', label: 'Change Password', icon: 'flaticon-settings' },
    ];

    const menuItems = isActivities ? activityItems : (isSettings ? settingItems : []);
    const paramKey = isActivities ? 'tab' : 'section';
    const activeId = isActivities ? (currentTab || 'liked') : (currentSection || null);

    if (!isSettings && !isActivities) return null;

    return (
        <div className="fixed left-[165px] top-[5.30rem] h-full w-[250px] z-1 transition-all duration-400 hidden lg:block border-l border-gray-100">
            <div className="h-full relative bg-white overflow-hidden shadow-[0_8px_10px_0_rgba(183,192,206,0.1)] max-h-[calc(100%-80px)] transition-all duration-400 pt-2">
                <div className="px-6 py-4 border-b border-gray-50 mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isSettings ? 'Settings' : 'Activities'}
                    </h3>
                </div>
                <ul className="list-none h-full overflow-y-auto custom-scrollbar ">
                    {menuItems.map((item) => (
                        <li key={item.id} className="mb-1 last:mb-0 relative group w-full">
                            <Link
                                to={`${location.pathname}?${paramKey}=${item.id}`}
                                className={`flex items-center px-6 py-3 text-[14px] w-full font-bold transition-all duration-400 ${activeId === item.id ? 'text-[#3644D9] bg-[#F4F7FC]' : 'text-[#515355] hover:text-[#3644D9] hover:bg-[#F9FBFF]'
                                    }`}
                            >
                                <i className={`${item.icon} mr-4 text-lg ${activeId === item.id ? 'text-[#3644D9]' : 'text-gray-400'}`}></i>
                                <span>{item.label}</span>
                                {activeId === item.id && (
                                    <span className="absolute right-0 top-0 h-full w-[3px] bg-[#3644D9]"></span>
                                )}
                            </Link>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
};

export default ActivitiesSidebar;

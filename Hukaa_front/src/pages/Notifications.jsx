import React, { useState } from 'react';
import NotificationsList from '../components/Notifications/NotificationsList';
import FollowerRequests from '../components/Notifications/FollowerRequests';
import PeopleMightKnow from '../components/Notifications/PeopleMightKnow';

const Notifications = () => {
    const [activeTab, setActiveTab] = useState('notifications');

    const tabs = [
        { id: 'notifications', label: 'All', icon: 'ri-notification-3-line' },
        { id: 'requests', label: 'Requests', icon: 'ri-user-follow-line' },
        { id: 'suggestions', label: 'Suggestions', icon: 'ri-group-line' },
    ];

    return (
        <div className="container mx-auto h-full">
            {/* Mobile Tab Bar */}
            <div className="lg:hidden sticky top-[95px] z-[999] bg-[#F4F7FC] py-3 -mx-4 px-4 overflow-x-auto whitespace-nowrap custom-scrollbar mb-4">
                <div className="flex space-x-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-main text-white shadow-md'
                                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                                }`}
                        >
                            <i className={`${tab.icon} mr-2 text-sm`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop View (Grid) */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6 animate-fade-in-up items-stretch">
                <div className="lg:col-span-1 h-full">
                    <NotificationsList />
                </div>
                <div className="lg:col-span-1 h-full">
                    <FollowerRequests />
                </div>
                <div className="lg:col-span-1 h-full">
                    <PeopleMightKnow />
                </div>
            </div>

            {/* Mobile View (Tabbed) */}
            <div className="lg:hidden animate-fade-in-up">
                {activeTab === 'notifications' && <NotificationsList />}
                {activeTab === 'requests' && <FollowerRequests />}
                {activeTab === 'suggestions' && <PeopleMightKnow />}
            </div>
        </div>
    );
};

export default Notifications;

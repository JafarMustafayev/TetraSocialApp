import React from 'react';
import NotificationsList from '../components/Notifications/NotificationsList';
import FollowerRequests from '../components/Notifications/FollowerRequests';
import PeopleMightKnow from '../components/Notifications/PeopleMightKnow';

const Notifications = () => {
    return (
        <div className="container mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up items-stretch">
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
        </div>
    );
};

export default Notifications;

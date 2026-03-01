import React from 'react';

const NotificationSkeleton = () => (
    <div className="p-4 flex items-center animate-pulse">
        <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
        <div className="ml-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
            <div className="h-2 bg-gray-50 rounded w-1/4 mt-2"></div>
        </div>
    </div>
);

export default NotificationSkeleton;

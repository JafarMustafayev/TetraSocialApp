import React from 'react';

const ChatAreaSkeleton = () => {
    return (
        <div className="flex-1 p-4 space-y-4 overflow-hidden animate-pulse">
            <div className="flex justify-start">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700/50 rounded-2xl"></div>
            </div>
            <div className="flex justify-end">
                <div className="h-10 w-32 bg-main/20 rounded-2xl"></div>
            </div>
            <div className="flex justify-start">
                <div className="h-10 w-56 bg-gray-200 dark:bg-gray-700/50 rounded-2xl"></div>
            </div>
            <div className="flex justify-end">
                <div className="h-10 w-40 bg-main/20 rounded-2xl"></div>
            </div>
            <div className="flex justify-start">
                <div className="h-20 w-64 bg-gray-200 dark:bg-gray-700/50 rounded-2xl"></div>
            </div>
            <div className="flex justify-end">
                <div className="h-10 w-32 bg-main/20 rounded-2xl"></div>
            </div>
            <div className="flex justify-start">
                <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700/50 rounded-2xl"></div>
            </div>
        </div>
    );
};

export default ChatAreaSkeleton;

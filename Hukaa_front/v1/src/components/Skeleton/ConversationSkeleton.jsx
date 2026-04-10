import React from 'react';

const ConversationSkeleton = () => {
    return (
        <div className="flex items-center px-4 py-3 rounded-2xl animate-pulse mb-1">
            <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
            <div className="ml-4 flex-1">
                <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-10 bg-gray-100 rounded"></div>
                </div>
                <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
            </div>
        </div>
    );
};

export default ConversationSkeleton;

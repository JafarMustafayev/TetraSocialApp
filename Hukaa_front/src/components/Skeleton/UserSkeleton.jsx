import React from 'react';

const UserSkeleton = ({ count = 5 }) => {
    return (
        <>
            {Array(count).fill(0).map((_, index) => (
                <div key={index} className="p-4 flex items-center animate-pulse">
                    <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-gray-100"></div>
                </div>
            ))}
        </>
    );
};

export default UserSkeleton;

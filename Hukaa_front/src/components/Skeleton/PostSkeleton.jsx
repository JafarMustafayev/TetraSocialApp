import React from 'react';

const PostSkeleton = ({ count = 1 }) => {
    return (
        <div className="space-y-6">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-3 w-20 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="h-20 bg-gray-50 rounded-lg mb-4"></div>
                    <div className="flex space-x-4 justify-between">
                        <div className="h-8 w-24 bg-gray-100 rounded"></div>
                        <div className="h-8 w-24 bg-gray-100 rounded"></div>
                        <div className="h-8 w-24 bg-gray-100 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostSkeleton;

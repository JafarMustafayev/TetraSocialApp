import React from 'react';

const CommentSkeleton = ({ count = 3 }) => {
    return (
        <div className="space-y-6 animate-pulse w-full">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="flex space-x-4">
                    {/* Circle Avatar Placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>

                    {/* Content Placeholder */}
                    <div className="grow space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-3 w-12 bg-gray-100 rounded"></div>
                        </div>
                        <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 border border-gray-100 min-h-[60px] space-y-2">
                            <div className="h-3 w-full bg-gray-100 rounded"></div>
                            <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentSkeleton;

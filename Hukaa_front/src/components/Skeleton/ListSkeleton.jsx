import React from 'react';

const ListSkeleton = ({ count = 3, showButton = true }) => {
    return (
        <div className="space-y-4 w-full animate-pulse">
            {[...Array(count)].map((_, index) => (
                <div key={index} className="flex items-center p-4">
                    {/* Circle Avatar Placeholder */}
                    <div className="shrink-0 w-12 h-12 bg-gray-200 rounded-full"></div>

                    {/* Text Placeholder */}
                    <div className="ml-4 grow space-y-2">
                        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                    </div>

                    {/* Button Placeholder */}
                    {showButton && (
                        <div className="shrink-0 h-8 w-20 bg-gray-100 rounded-xl ml-2"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ListSkeleton;

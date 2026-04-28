import React from 'react';
import Skeleton from '../../ui/Skeleton';

const SearchSkeleton = ({ count = 3 }) => {
    return (
        Array.from({ length: count }).map((_, index) => (
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Skeleton className="w-10 h-10 rounded-full shrink-0 border-2 border-white dark:border-gray-800" />
                <div className="flex-1 min-w-0">
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-16 h-3" />
                </div>
            </div>
        ))
    );
};

export default SearchSkeleton;

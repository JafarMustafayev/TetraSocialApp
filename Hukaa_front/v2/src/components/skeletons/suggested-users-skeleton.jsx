// src/components/skeletons/suggested-users-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const SuggestedUsersSkeleton = ({ count = 3 }) => {
    return (
        <div className="bg-white dark:bg-[#09090b] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] p-5">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-32 h-4 rounded" />
            </div>
            <div className="space-y-4">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                                <Skeleton className="w-24 h-3 rounded mb-2" />
                                <Skeleton className="w-16 h-2 rounded" />
                            </div>
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUsersSkeleton;

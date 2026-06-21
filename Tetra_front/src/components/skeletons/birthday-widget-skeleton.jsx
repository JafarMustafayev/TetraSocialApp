// src/components/skeletons/birthday-widget-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const BirthdayWidgetSkeleton = () => {
    return (
        <div className="bg-white dark:bg-[#09090b] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] p-5">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>
            <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl border border-gray-100 dark:border-[#1f1f1f]">
                        <div className="flex-1">
                            <Skeleton className="w-32 h-3 rounded mb-2" />
                            <Skeleton className="w-20 h-2 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BirthdayWidgetSkeleton;

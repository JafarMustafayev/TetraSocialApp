// src/components/skeletons/profile-header-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const ProfileHeaderSkeleton = () => {
    return (
        <div className="w-full">
            {/* Banner Skeleton */}
            <div className="w-full h-44 md:h-60 bg-gray-150 dark:bg-[#16181c] animate-pulse" />
            
            {/* Avatar & Action Button Skeleton */}
            <div className="flex justify-between items-end px-4 relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#09090b] -mt-12 md:-mt-16 bg-gray-200 dark:bg-neutral-800 animate-pulse shrink-0" />
                <div className="h-9 w-28 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse mb-3" />
            </div>
            
            {/* Profile Details Skeleton */}
            <div className="p-4 space-y-3">
                <div className="space-y-1.5">
                    <div className="h-6 w-44 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
                <div className="h-4 w-full max-w-[85%] bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="flex gap-4">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default ProfileHeaderSkeleton;

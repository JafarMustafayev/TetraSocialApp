// src/components/skeletons/user-list-item-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const UserListItemSkeleton = () => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#1f1f1f] animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800" />
                <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-800 rounded" />
                </div>
            </div>
            <div className="h-7 w-20 bg-gray-200 dark:bg-neutral-800 rounded-full" />
        </div>
    );
};

export default UserListItemSkeleton;

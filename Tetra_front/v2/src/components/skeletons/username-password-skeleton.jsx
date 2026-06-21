// src/components/skeletons/username-password-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const UsernamePasswordSkeleton = ({ onBack }) => {
    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
            <div className="px-4 pt-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Username and password</h2>
            </div>
            <div className="p-4 md:px-6 md:py-2 max-w-[600px] space-y-6">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-[48px] w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-[48px] w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default UsernamePasswordSkeleton;

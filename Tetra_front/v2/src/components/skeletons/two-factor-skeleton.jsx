// src/components/skeletons/two-factor-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const TwoFactorSkeleton = ({ onBack }) => {
    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
            <div className="px-4 pt-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
            </div>
            <div className="p-4 md:p-6 max-w-[600px] space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-[#1f1f1f] mt-8">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-[36px] w-24 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default TwoFactorSkeleton;

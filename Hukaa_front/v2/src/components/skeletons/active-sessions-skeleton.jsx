// src/components/skeletons/active-sessions-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const ActiveSessionsSkeleton = ({ onBack }) => {
    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
            </div>

            <div className="p-4 md:p-6 max-w-[800px] space-y-4">
                <div className="mb-6">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 dark:border-[#1f1f1f] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between bg-gray-50/50 dark:bg-[#16181c]/50">
                        <div className="flex items-start gap-4 w-full">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="space-y-2 w-full max-w-[300px]">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-44" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveSessionsSkeleton;

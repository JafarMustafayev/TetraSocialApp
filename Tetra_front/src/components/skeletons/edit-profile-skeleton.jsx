// src/components/skeletons/edit-profile-skeleton.jsx
import React from 'react';
import Skeleton from './Skeleton';

const EditProfileSkeleton = ({ onBack }) => {
    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            {/* Header/title area */}
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors animate-pulse"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <Skeleton className="h-6 w-32" />
            </div>

            <div className="p-4 md:px-6 md:py-2 max-w-[600px] space-y-6">
                {/* Section title */}
                <Skeleton className="h-6 w-20" />

                {/* Cover photo block */}
                <div className="space-y-3">
                    <Skeleton className="h-[15px] w-24" />
                    <Skeleton className="w-full h-40 rounded-2xl" />
                    {/* Cover action buttons */}
                    <div className="flex gap-3">
                        <Skeleton className="h-[36px] w-32 rounded-full" />
                        <Skeleton className="h-[36px] w-20 rounded-full" />
                    </div>
                </div>

                {/* Avatar block */}
                <div className="space-y-3">
                    <Skeleton className="h-[15px] w-24" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                        {/* Avatar action buttons */}
                        <div className="flex gap-3">
                            <Skeleton className="h-[36px] w-32 rounded-full" />
                            <Skeleton className="h-[36px] w-20 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Name input */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-[48px] w-full rounded-xl" />
                </div>

                {/* Bio textarea */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-10" />
                    <Skeleton className="h-[100px] w-full rounded-xl" />
                </div>

                {/* Website input */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-[48px] w-full rounded-xl" />
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                    <Skeleton className="h-[36px] w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default EditProfileSkeleton;

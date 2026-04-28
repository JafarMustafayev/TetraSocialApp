import React from 'react';
import Skeleton from '../ui/Skeleton';

const PostSkeleton = ({ count = 3 }) => {
    return (
        [...Array(count)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-[#10172b] rounded-2xl p-4 md:p-6 mb-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div>
                            <Skeleton className="w-32 h-4 mb-2" />
                            <Skeleton className="w-20 h-3" />
                        </div>
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>

                <div className="mb-4">
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-3/4 h-4" />
                </div>

                <Skeleton className="w-full h-[250px] rounded-xl mb-4" />

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-[#1f1f1f]">
                    <Skeleton className="w-16 h-8 rounded-full" />
                    <Skeleton className="w-16 h-8 rounded-full" />
                    <Skeleton className="w-16 h-8 rounded-full ml-auto" />
                </div>
            </div>
        ))
    );
};

export default PostSkeleton;

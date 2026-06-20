// src/components/skeletons/post-skeleton.jsx
import Skeleton from './Skeleton';

const PostSkeleton = ({ count = 3 }) => {
    return (
        [...Array(count)].map((_, index) => (
            <article key={index} className="bg-white dark:bg-[#09090b] border-b border-gray-100 dark:border-[#1f1f1f] p-4 flex gap-3 animate-pulse">
                {/* Avatar */}
                <div className="shrink-0">
                    <Skeleton className="w-10 h-10 rounded-full!" />
                </div>

                {/* Right side content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="w-24 h-4 rounded" />
                        <Skeleton className="w-16 h-3 rounded" />
                    </div>

                    {/* Post Body */}
                    <div className="space-y-2 mt-2">
                        <Skeleton className="w-full h-3 rounded" />
                        <Skeleton className="w-[90%] h-3 rounded" />
                        <Skeleton className="w-[60%] h-3 rounded" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 ">
                        <div className='flex items-center gap-8'>
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="w-6 h-6 rounded-full" />
                            <Skeleton className="w-6 h-6 rounded-full" />
                        </div>
                        <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                </div>
            </article>
        ))
    );
};

export default PostSkeleton;

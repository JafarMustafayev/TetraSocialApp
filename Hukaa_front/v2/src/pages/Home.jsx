// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import { PostSkeleton } from '../components/skeletons/index.js';
import BirthdayWidget from '../components/widgets/BirthdayWidget';
import SuggestedUsersWidget from '../components/widgets/SuggestedUsersWidget';

const Home = () => {
    // Mock posts for view-only mode
    const [posts, setPosts] = useState([
        { Id: 1, ByUserName: 'Jafar Mustafayev', Content: 'Welcome to Hukaa V2! Everything is built with Tailwind CSS.', UserProfileImageUrl: null },
        { Id: 2, ByUserName: 'Admin', Content: 'This is a mock post to test the feed layout.', UserProfileImageUrl: null },
    ]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false); // Disable infinite scroll for now as per user request (view only)

    return (
        <div className="flex justify-center w-full gap-0 lg:gap-4 xl:gap-8">
            {/* Feed Area */}
            <div className="w-full max-w-[700px] border-x border-gray-100 dark:border-neutral-800 min-h-screen">
                {/* Tabs */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-[#1f1f1f]">
                    <div className="flex h-[53px] overflow-x-auto hide-scrollbar">
                        <button className="flex-1 min-w-[80px] font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#16181c] transition-colors relative">
                            New
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-main rounded-full"></div>
                        </button>
                        <button className="flex-1 min-w-[80px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-[#16181c] transition-colors">
                            Trending
                        </button>
                        <button className="flex-1 min-w-[80px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-[#16181c] transition-colors">
                            Following
                        </button>
                        <button className="flex-1 min-w-[80px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-[#16181c] transition-colors">
                            For you
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-100 dark:border-[#1f1f1f]">
                    <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
                </div>

                <div className="w-full">
                    {loading ? (
                        <PostSkeleton count={3} />
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post.Id} post={post} />
                        ))
                    )}

                    {!hasMore && posts.length > 0 && (
                        <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                            You've reached the end of the feed
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar Widgets */}
            <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 pt-4">
                <div className="sticky top-4 space-y-4">
                    <BirthdayWidget count={5} />
                    <SuggestedUsersWidget count={10} />

                    <footer className="px-4">
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                            <button className="text-[13px] text-gray-500 hover:underline">Terms of Service</button>
                            <button className="text-[13px] text-gray-500 hover:underline">Privacy Policy</button>
                            <button className="text-[13px] text-gray-500 hover:underline">Cookie Policy</button>
                            <button className="text-[13px] text-gray-500 hover:underline">Accessibility</button>
                            <button className="text-[13px] text-gray-500 hover:underline">Ads info</button>
                            <span className="text-[13px] text-gray-500">© 2026 Hukaa Corp.</span>
                        </div>
                    </footer>
                </div>
            </aside>
        </div>
    );
};

export default Home;

// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import PostSkeleton from '../components/feed/PostSkeleton';
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
        <div className="flex flex-col lg:flex-row lg:gap-6">
            <div className="contents lg:block lg:flex-1 lg:min-w-0">
                <div className="order-1 lg:order-0 w-full lg:mb-0">
                    <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
                </div>

                <div className="order-3 lg:order-0 w-full space-y-6">
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

            <aside className="contents lg:block lg:w-[320px] lg:shrink-0">
                <div className="contents lg:block lg:sticky lg:top-[100px]">
                    <div className="order-2 lg:order-0 w-full  lg:mb-0 space-y-6">
                        <BirthdayWidget count={5} />
                        <SuggestedUsersWidget count={10} />
                    </div>

                    <footer className="order-4 lg:order-0 w-full mt-2 lg:mt-8 px-5 pb-6 lg:pb-0">
                        <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 mb-4">
                            <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-main">Privacy</button>
                            <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-main">Terms</button>
                            <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-main">About</button>
                            <button className="text-[10px] font-bold text-gray-400 uppercase hover:text-main">Cookies</button>
                        </div>
                        <p className="text-[10px] text-center lg:text-left font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">© 2026 Hukaa Social</p>
                    </footer>
                </div>
            </aside>
        </div>
    );
};

export default Home;

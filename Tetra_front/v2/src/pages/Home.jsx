// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import { PostSkeleton } from '../components/skeletons/index.js';
import Tabs from '../components/ui/Tabs.jsx';
import { getAllPosts } from '../api/post.api.js';

const Home = () => {
    // Mock posts for view-only mode
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false); // Disable infinite scroll for now as per user request (view only)
    const [activeTab, setActiveTab] = useState('new');

    const homeTabs = [
        { id: 'new', label: 'New' },
        { id: 'following', label: 'Following' },
        { id: 'foryou', label: 'For you' }
    ];

    useEffect(() => {
        document.title = "Tetra";
        setLoading(true);
        getAllPosts().then((res) => {
            setPosts(res.Data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="flex justify-center w-full ">
            {/* Feed Area */}
            <div className="w-full border-x border-gray-100 dark:border-neutral-800 min-h-screen">
                {/* Tabs */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md">
                    <Tabs tabs={homeTabs} activeTab={activeTab} onChange={setActiveTab} />
                </div>

                <div className="border-b  border-gray-100 dark:border-[#1f1f1f]">
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


        </div>
    );
};

export default Home;

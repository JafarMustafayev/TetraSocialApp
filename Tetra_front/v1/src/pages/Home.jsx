import React, { useState, useEffect } from 'react';
import PostWidget from '../components/PostWidget';
import CreatePostWidget from '../components/CreatePostWidget';
import PostSkeleton from '../components/Skeleton/PostSkeleton';
import { getFeeds } from '../api/post';
import SuggestedUsersWidget from '../components/Widgets/SuggestedUsersWidget';
import BirthdayWidget from '../components/Widgets/BirthdayWidget';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeeds = async (pageNum) => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await getFeeds(pageNum);
            if (response && response.success) {
                const newPosts = response.data;
                if (newPosts.length === 0) {
                    setHasMore(false);
                } else {
                    setPosts(prev => {
                        const combined = [...prev, ...newPosts];
                        const uniqueMap = new Map();
                        combined.forEach(p => uniqueMap.set(p.id, p));
                        return Array.from(uniqueMap.values()).sort((a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        );
                    });
                    setPage(pageNum + 1);
                }
            }
        } catch (error) {
            console.error('Error fetching feeds:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeds(1);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
                fetchFeeds(page);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, loading, hasMore]);

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handlePostDeleted = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handlePostArchived = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    return (
        <div className="flex flex-wrap -mx-3">
            <div className="w-full lg:w-3/4 px-3">
                <div className="news-feed-area">
                    <CreatePostWidget onPostCreated={handlePostCreated} />

                    {/* Mobile Only Widgets */}
                    <div className="lg:hidden space-y-4 mb-6">
                        <BirthdayWidget />
                        <SuggestedUsersWidget maxItems={3} />
                    </div>

                    {posts.map(post => (
                        <PostWidget
                            key={post.id}
                            post={post}
                            onDelete={handlePostDeleted}
                            onUpdate={handlePostUpdated}
                            onArchive={handlePostArchived}
                        />
                    ))}

                    {loading && <PostSkeleton count={2} />}

                    {!hasMore && posts.length > 0 && (
                        <div className="py-10 text-center text-gray-400 font-medium">
                            No more posts to show
                        </div>
                    )}

                    {!loading && posts.length === 0 && (
                        <div className="p-10 text-center bg-white rounded-lg border border-dashed border-gray-200">
                            <p className="text-gray-400">No feeds to display yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/4 px-3 ">
                <aside className="widget-area sticky top-25">
                    <BirthdayWidget />
                    <SuggestedUsersWidget maxItems={5} />
                </aside>
            </div>
        </div>
    );
};

export default Home;

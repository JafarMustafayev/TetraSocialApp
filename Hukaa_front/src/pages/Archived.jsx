import React, { useState, useEffect } from 'react';
import { getArchivedPosts } from '../api/post';
import { getMyProfile } from '../api/profile';
import PostWidget from '../components/PostWidget';
import PostSkeleton from '../components/Skeleton/PostSkeleton';

const Archived = () => {
    const [posts, setPosts] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [postsPage, setPostsPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const profileResponse = await getMyProfile();
                if (profileResponse.success) {
                    setProfileData(profileResponse.data);
                }
                await fetchPosts(1);
            } catch (err) {
                console.error('Error loading archived page:', err);
                setError('Failed to load archived posts');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const fetchPosts = async (page) => {
        if (isPostsLoading || !hasMorePosts) return;

        setIsPostsLoading(true);
        try {
            const response = await getArchivedPosts(page);
            if (response && response.success) {
                const newPosts = response.data;
                if (newPosts.length === 0) {
                    setHasMorePosts(false);
                } else {
                    setPosts(prev => {
                        const combined = [...prev, ...newPosts];
                        const uniqueMap = new Map();
                        combined.forEach(p => uniqueMap.set(p.id, p));
                        return Array.from(uniqueMap.values()).sort((a, b) =>
                            new Date(b.createdAt || b.createAt) - new Date(a.createdAt || a.createAt)
                        );
                    });
                    setPostsPage(prev => prev + 1);
                }
            }
        } catch (err) {
            console.error('Error fetching archived posts:', err);
        } finally {
            setIsPostsLoading(false);
        }
    };

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
                fetchPosts(postsPage);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [postsPage, isPostsLoading, hasMorePosts]);

    const handlePostDeleted = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    const handlePostUnarchived = (postId) => {
        // When unarchived, remove from this view
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto px-4 mt-10">
            <PostSkeleton count={3} />
        </div>
    );
    if (error) return <div className="p-10 text-center text-red-500 font-bold bg-red-50 rounded-3xl border border-red-100 m-6">{error}</div>;

    return (
        <div className="animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 px-2">
                    <h2 className="text-2xl font-bold text-gray-800 font-heading tracking-tight">Archived Posts</h2>
                    <div className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold border border-orange-100 shadow-sm transition-all hover:scale-105">
                        {posts.length} Posts Archived
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="ri-archive-line text-4xl text-gray-300"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 font-heading tracking-tight">No Archived Posts</h3>
                        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                            Posts you archive will appear here. You can hide them from your timeline without deleting them forever.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostWidget
                                key={post.id}
                                post={{ ...post, isArchived: true }}
                                profileData={profileData}
                                onDelete={handlePostDeleted}
                                onUpdate={handlePostUpdated}
                                onArchive={handlePostUnarchived}
                            />
                        ))}

                        {isPostsLoading && (
                            <div className="p-8 text-center text-gray-400 font-medium">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-[#3644D9] rounded-full mr-3" role="status"></div>
                                <span>Loading more posts...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archived;

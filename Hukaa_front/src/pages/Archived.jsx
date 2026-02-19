import React, { useState, useEffect } from 'react';
import { getArchivedPosts } from '../api/post';
import { getMyProfile } from '../api/profile';
import PostWidget from '../components/PostWidget';

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

    if (loading) return <div className="p-5 text-center">Loading archived posts...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;

    return (
        <div className="content-page-box-area">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="section-title flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Archived Posts</h2>
                            <p className="text-sm text-gray-500">{posts.length} Posts Archived</p>
                        </div>

                        {posts.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="flaticon-star text-3xl text-gray-300"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Archived Posts</h3>
                                <p className="text-gray-500">Posts you archive will appear here. You can hide them from your timeline without deleting them.</p>
                            </div>
                        ) : (
                            <div className="archived-posts-list">
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
                                    <div className="p-4 text-center text-gray-400 font-medium">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-600 rounded-full mr-2" role="status"></div>
                                        Loading more posts...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Archived;

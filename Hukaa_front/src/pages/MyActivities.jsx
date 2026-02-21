import { getLikedPosts, getSavedPosts, getArchivedPosts } from '../api/post';
import { getMyProfile } from '../api/profile';
import PostWidget from '../components/PostWidget';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MyActivities = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'liked';

    const [posts, setPosts] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'liked', label: 'Liked Posts', icon: 'ri-heart-3-line' },
        { id: 'saved', label: 'Saved Posts', icon: 'ri-bookmark-line' },
        { id: 'archived', label: 'Archived Posts', icon: 'ri-lock-line' },
    ];

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const profileResponse = await getMyProfile();
                if (profileResponse.success) {
                    setProfileData(profileResponse.data);
                }
                loadTabPosts(activeTab, 1, true);
            } catch (err) {
                console.error('Error loading initial data:', err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (!loading) {
            loadTabPosts(activeTab, 1, true);
        }
    }, [activeTab]);

    const loadTabPosts = async (tab, pageNum, isInitial = false) => {
        if (isPostsLoading && !isInitial) return;

        setIsPostsLoading(true);
        if (isInitial) {
            setPosts([]);
            setPage(1);
            setHasMore(true);
        }

        try {
            let response;
            if (tab === 'liked') response = await getLikedPosts(pageNum);
            else if (tab === 'saved') response = await getSavedPosts(pageNum);
            else if (tab === 'archived') response = await getArchivedPosts(pageNum);

            if (response && response.success) {
                const newPosts = response.data;
                if (newPosts.length === 0) {
                    setHasMore(false);
                } else {
                    setPosts(prev => {
                        const combined = isInitial ? newPosts : [...prev, ...newPosts];
                        const uniqueMap = new Map();
                        combined.forEach(p => uniqueMap.set(p.id, p));
                        return Array.from(uniqueMap.values()).sort((a, b) =>
                            new Date(b.createdAt || b.createAt) - new Date(a.createdAt || a.createAt)
                        );
                    });
                    setPage(pageNum + 1);
                }
            } else {
                // If endpoint doesn't exist yet, we'll see 404 or success false
                if (isInitial) setPosts([]);
                setHasMore(false);
            }
        } catch (err) {
            console.error(`Error fetching ${tab} posts:`, err);
            if (isInitial) setPosts([]);
            setHasMore(false);
        } finally {
            setIsPostsLoading(false);
        }
    };

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
                if (hasMore && !isPostsLoading) {
                    loadTabPosts(activeTab, page);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [page, isPostsLoading, hasMore, activeTab]);

    const handlePostAction = (postId) => {
        // For My Activities, if something is unliked/unsaved/unarchived, maybe remove it from the list
        // But let's keep it simple for now and just update the UI if needed
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="animate-fade-in-up">
            <div className="max-w-4xl mx-auto">
                {posts.length === 0 && !isPostsLoading ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className={`${tabs.find(t => t.id === activeTab).icon} text-4xl text-gray-300`}></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 font-heading tracking-tight">No {activeTab} posts found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Posts you {activeTab === 'archived' ? 'archive' : activeTab} will appear here. This helps you keep track of your favorites and history.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostWidget
                                key={post.id}
                                post={{ ...post, isArchived: activeTab === 'archived' }}
                                profileData={profileData}
                                onDelete={() => handlePostAction(post.id)}
                                onUpdate={(updated) => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))}
                                onArchive={() => activeTab === 'archived' && handlePostAction(post.id)}
                            />
                        ))}

                        {isPostsLoading && (
                            <div className="p-8 text-center text-gray-400 font-medium">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-[#3644D9] rounded-full mr-3" role="status"></div>
                                <span>Loading posts...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyActivities;

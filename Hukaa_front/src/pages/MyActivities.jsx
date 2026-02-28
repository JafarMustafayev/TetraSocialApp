import { getReactedPosts, getSavedPosts, getArchivedPosts } from '../api/post';
import { getMyProfile } from '../api/profile';
import PostWidget from '../components/PostWidget';
import PostSkeleton from '../components/Skeleton/PostSkeleton';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MyActivities = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'reactions';

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const tabs = [
        { id: 'reactions', label: 'Reactions', icon: 'ri-emotion-line' },
        { id: 'saved', label: 'Saved Posts', icon: 'ri-bookmark-line' },
        { id: 'archived', label: 'Archived Posts', icon: 'ri-lock-line' },
    ];

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {

                await loadTabPosts(activeTab, 1, true);
            } catch (err) {
                console.error("Error fetching initial data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
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
            if (tab === 'reactions') response = await getReactedPosts(pageNum);
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

    if (loading) return (
        <div className="max-w-4xl mx-auto px-4 mt-6">
            <PostSkeleton count={3} />
        </div>
    );

    return (
        <div className="animate-fade-in-up px-0 sm:px-4">
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
                                onDelete={() => handlePostAction(post.id)}
                                onUpdate={(updated) => setPosts(prev => prev.map(p => p.id === updated.id ? updated : p))}
                                onArchive={() => activeTab === 'archived' && handlePostAction(post.id)}
                                onSaveToggle={(postId, isSavedNow) => {
                                    if (activeTab === 'saved' && !isSavedNow) {
                                        handlePostAction(postId);
                                    }
                                }}
                            />
                        ))}

                        {isPostsLoading && <PostSkeleton count={2} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyActivities;

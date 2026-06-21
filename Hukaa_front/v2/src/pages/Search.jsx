import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import Tabs from '../components/ui/Tabs.jsx';
import UserListItem from '../components/ui/UserListItem.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import { UserListItemSkeleton, PostSkeleton } from '../components/skeletons/index.js';
import { searchUsers, searchPosts } from '../api/search.api.js';
import { followUser, unfollowUser } from '../api/account.api.js';

const Search = () => {
    const { user: currentUser } = useAuth();

    // Search query states
    const [searchInput, setSearchInput] = useState('');
    const [query, setQuery] = useState('');

    // Active tab state
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'users';

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    // Data lists
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);

    // Loading & load status states for cache mechanism
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
    const [hasLoadedPosts, setHasLoadedPosts] = useState(false);

    // Tab items
    const searchTabs = [
        { id: 'users', label: 'People' },
        { id: 'posts', label: 'Posts' }
    ];

    // Set page title
    useEffect(() => {
        document.title = "Search";
    }, []);

    // Fetch data based on tab active state and cache status
    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === 'users' && !hasLoadedUsers) {
                setLoadingUsers(true);
                try {
                    const res = await searchUsers(query);
                    if (res.Success) {
                        setUsers(res.Data);
                    } else {
                        toast.error(res.Message || 'Failed to search users.');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('An error occurred while searching users.');
                } finally {
                    setLoadingUsers(false);
                    setHasLoadedUsers(true);
                }
            } else if (activeTab === 'posts' && !hasLoadedPosts) {
                setLoadingPosts(true);
                try {
                    const res = await searchPosts(query);
                    if (res.Success) {
                        setPosts(res.Data);
                    } else {
                        toast.error(res.Message || 'Failed to search posts.');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('An error occurred while searching posts.');
                } finally {
                    setLoadingPosts(false);
                    setHasLoadedPosts(true);
                }
            }
        };

        fetchData();
    }, [query, activeTab, hasLoadedUsers, hasLoadedPosts]);

    // Handle form submit to trigger new search query
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setQuery(searchInput);
        setHasLoadedUsers(false);
        setHasLoadedPosts(false);
    };

    // Toggle follow for users list items
    const handleToggleFollow = async (userInList) => {
        try {
            if (userInList.isFollowing) {
                const res = await unfollowUser(userInList.username);
                if (res.Success) {
                    setUsers(prev => prev.map(u => u.username === userInList.username ? { ...u, isFollowing: false } : u));
                    toast.success(`Unfollowed @${userInList.username}`);
                } else {
                    toast.error(res.Message || 'Unfollow failed.');
                }
            } else {
                const res = await followUser(userInList.username);
                if (res.Success) {
                    setUsers(prev => prev.map(u => u.username === userInList.username ? { ...u, isFollowing: true } : u));
                    toast.success(`Followed @${userInList.username}`);
                } else {
                    toast.error(res.Message || 'Follow failed.');
                }
            }
        } catch (err) {
            toast.error('Action failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center w-full bg-white dark:bg-[#09090b] transition-colors duration-300">
            <div className="w-full border-x border-gray-100 dark:border-neutral-900 min-h-screen pb-10">

                {/* Tabs selection */}
                <Tabs tabs={searchTabs} activeTab={activeTab} onChange={handleTabChange} />
                {/* Search Input Sticky Header */}
                <form onSubmit={handleSearchSubmit} className="sticky top-0 z-20 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md p-3 border-b border-gray-100 dark:border-[#1f1f1f]">
                    <div className="relative flex items-center">
                        <i className="ri-search-line absolute left-4 text-gray-400 dark:text-gray-500 text-[18px]"></i>
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={activeTab === 'users' ? 'Search users...' : 'Search posts...'}
                            className="w-full pl-11 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-[14px] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-main focus:bg-white dark:focus:bg-black transition-all"
                        />
                    </div>
                </form>

                {/* Search Results */}
                <div className="w-full">
                    {activeTab === 'users' ? (
                        loadingUsers ? (
                            [...Array(3)].map((_, i) => <UserListItemSkeleton key={i} />)
                        ) : users.length > 0 ? (
                            users.map(usr => (
                                <UserListItem
                                    key={usr.id}
                                    user={usr}
                                    currentUser={currentUser}
                                    onToggleFollow={handleToggleFollow}
                                />
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                                No users found
                            </div>
                        )
                    ) : (
                        loadingPosts ? (
                            <PostSkeleton count={3} />
                        ) : posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard key={post.Id} post={post} />
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                                No posts found
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;

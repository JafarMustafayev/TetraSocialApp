// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
    getUserProfile,
    followUser,
    unfollowUser
} from '../api/account.api';
import { getUserPosts, getUserArchivedPosts } from '../api/post.api';
import PostCard from '../components/feed/PostCard';
import { PostSkeleton, ProfileHeaderSkeleton } from '../components/skeletons/index.js';
import Tabs from '../components/ui/Tabs.jsx';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // Check if the page is viewing the logged in user
    const isCurrentUser = !username || username.toLowerCase() === 'profile' || username.toLowerCase() === currentUser?.username?.toLowerCase();
    const targetUsername = (isCurrentUser ? currentUser?.username : username) || 'jafarmustafayev';

    // State Variables
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    // Profile Tabs State (personal profile only)
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'posts';
    const showArchive = isCurrentUser && activeTab === 'archive';
    const [archivePosts, setArchivePosts] = useState([]);
    const [archiveLoading, setArchiveLoading] = useState(false);
    const [hasLoadedArchive, setHasLoadedArchive] = useState(false);

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    // Redirect /profile to dynamic username
    useEffect(() => {
        if (username && username.toLowerCase() === 'profile' && currentUser?.username) {
            navigate(`/${currentUser.username}`, { replace: true });
        }
        document.title = "@" + targetUsername;
    }, [username, currentUser, navigate]);

    // Load Profile and Posts on username change
    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            if (!targetUsername || targetUsername.toLowerCase() === 'profile') return;
            setLoading(true);
            setPostsLoading(true);
            setError(null);

            // Reset tab and archive state when changing profiles
            setSearchParams({}, { replace: true });
            setArchivePosts([]);
            setHasLoadedArchive(false);

            try {
                // Fetch profile data
                const profileRes = await getUserProfile(targetUsername);
                if (profileRes.Success) {
                    setProfile(profileRes.Data);

                    // Fetch posts only if profile exists
                    const postsRes = await getUserPosts(targetUsername);
                    if (postsRes.Success) {
                        setPosts(postsRes.Data);
                    } else {
                        toast.error(postsRes.Message || 'Failed to load posts.');
                    }
                } else {
                    setError(profileRes.Message || 'User not found.');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while loading profile.');
            } finally {
                setLoading(false);
                setPostsLoading(false);
            }
        };

        fetchProfileAndPosts();
    }, [targetUsername]);

    // Load archived posts when switching to archive tab (lazy-loading with caching)
    useEffect(() => {
        if (!isCurrentUser || activeTab !== 'archive' || hasLoadedArchive) return;

        const fetchArchive = async () => {
            setArchiveLoading(true);
            try {
                const res = await getUserArchivedPosts();
                if (res.Success) {
                    setArchivePosts(res.Data);
                } else {
                    toast.error(res.Message || 'Failed to load archived posts.');
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred while loading archived posts.');
            } finally {
                setArchiveLoading(false);
                setHasLoadedArchive(true);
            }
        };

        fetchArchive();
    }, [activeTab, isCurrentUser, hasLoadedArchive]);

    // Follow/Unfollow Handler for Profile
    const handleToggleFollow = async () => {
        if (!profile) return;

        const isCurrentlyFollowing = profile.isFollowing;
        try {
            if (isCurrentlyFollowing) {
                const res = await unfollowUser(profile.username);
                if (res.Success) {
                    setProfile(prev => ({
                        ...prev,
                        isFollowing: false,
                        followersCount: Math.max(0, prev.followersCount - 1)
                    }));
                    toast.success(`Unfollowed @${profile.username}`);
                }
            } else {
                const res = await followUser(profile.username);
                if (res.Success) {
                    setProfile(prev => ({
                        ...prev,
                        isFollowing: true,
                        followersCount: prev.followersCount + 1
                    }));
                    toast.success(`Followed @${profile.username}`);
                }
            }
        } catch (err) {
            toast.error('Action failed. Please try again.');
        }
    };

    const handleOpenFollow = (tab) => {
        navigate(`/${targetUsername}/${tab}`);
    };

    // Fallback for avatar initials
    const getInitials = (name) => {
        return name ? name[0].toUpperCase() : 'U';
    };

    return (
        <div className="flex justify-center w-full bg-white dark:bg-[#09090b] transition-colors duration-300">

            {/* Main Profile Feed Area */}
            <div className="w-full border-x border-gray-100 dark:border-neutral-900 min-h-screen pb-10">

                {loading ? (
                    <ProfileHeaderSkeleton />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center h-full min-h-[50vh] ">
                        <div className='p-10 rounded-4xl border-2 border-gray-100 dark:border-neutral-900 shadow-lg dark:shadow-black/20'>
                            <div className='flex gap-2 items-center justify-center'>
                                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500 mb-6">
                                    <i className="ri-error-warning-line text-3xl"></i>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                    User @{targetUsername} not found
                                </h2>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-[15px]">
                                The account you are looking for doesn't exist or is not available. Please verify the URL or try searching again.
                            </p>
                            <Link
                                to="/feed"
                                className="bg-main text-white hover:bg-main-hover px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors duration-200"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full border-b border-gray-100 dark:border-[#1f1f1f] pb-4">
                            {/* Banner */}
                            <div className="w-full h-44 md:h-60 relative overflow-hidden">
                                {profile?.coverPhoto ? (
                                    <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-main/40 via-gray-100 dark:via-zinc-800 to-gray-250 dark:to-zinc-900" />
                                )}
                            </div>

                            {/* Avatar & Actions Row */}
                            <div className="px-4 flex justify-between items-end relative">
                                {/* Avatar */}
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-[#09090b] -mt-12 md:-mt-16 bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main text-3xl md:text-4xl shadow-md overflow-hidden shrink-0 z-10">
                                    {profile?.profilePhoto ? (
                                        <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(profile?.name)
                                    )}
                                </div>

                                {/* Edit or Follow/Message buttons */}
                                <div className="flex gap-2 mb-3">
                                    {!isCurrentUser && (
                                        <>
                                            {/* Follow Button */}
                                            <button
                                                onClick={handleToggleFollow}
                                                className={`px-5 py-1.5 rounded-full font-bold text-[14px] transition-colors duration-200 ${profile?.isFollowing
                                                    ? 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50/10'
                                                    : 'bg-main text-white hover:bg-main-hover'
                                                    }`}
                                            >
                                                {profile?.isFollowing ? 'Following' : 'Follow'}
                                            </button>

                                            {/* Message Button */}
                                            <Link
                                                to="/messages"
                                                className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#16181c] px-4 py-1.5 rounded-full font-bold text-[14px] flex items-center gap-1.5 transition-colors duration-200"
                                            >
                                                <i className="ri-chat-1-line text-lg leading-none"></i>
                                                <span>Message</span>
                                            </Link>

                                            {/* Actions Button */}
                                            <button className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors">
                                                <i className="ri-more-line text-xl"></i>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* User Meta */}
                            <div className="px-4 mt-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight">
                                        {profile?.name}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[15px] text-gray-500 font-semibold">
                                        @{profile?.username}
                                    </span>
                                    {profile?.followsYou && (
                                        <span className="text-[11px] bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md font-bold text-gray-500 dark:text-gray-400">
                                            Follows you
                                        </span>
                                    )}
                                </div>

                                {/* Bio */}
                                {profile?.bio && (
                                    <p className="text-[15px] text-gray-900 dark:text-white mt-3 font-medium whitespace-pre-line leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )}

                                {/* Additional info: Links and Dates */}
                                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3.5 text-[14px] text-gray-500 font-medium">
                                    {profile?.website && (
                                        <a
                                            href={profile.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-main hover:underline"
                                        >
                                            <i className="ri-link text-gray-500 text-[16px]"></i>
                                            <span>{profile.website}</span>
                                        </a>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <i className="ri-calendar-line text-[16px]"></i>
                                        <span>{profile?.joinedDate}</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 mt-4 text-[14px] text-gray-500 font-medium">
                                    <button
                                        onClick={() => handleOpenFollow('following')}
                                        className="hover:underline text-left group"
                                    >
                                        <span className="font-extrabold text-gray-900 dark:text-white group-hover:text-main">
                                            {profile?.followingCount}
                                        </span>{' '}
                                        following
                                    </button>
                                    <button
                                        onClick={() => handleOpenFollow('followers')}
                                        className="hover:underline text-left group"
                                    >
                                        <span className="font-extrabold text-gray-900 dark:text-white group-hover:text-main">
                                            {profile?.followersCount}
                                        </span>{' '}
                                        followers
                                    </button>
                                    <span className="cursor-default">
                                        <span className="font-extrabold text-gray-900 dark:text-white">
                                            {posts.length}
                                        </span>{' '}
                                        posts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Tabs (Only visible for the current user's own profile) */}
                        {isCurrentUser && (
                            <Tabs
                                tabs={[
                                    { id: 'posts', label: 'Posts' },
                                    { id: 'archive', label: 'Archive' }
                                ]}
                                activeTab={activeTab}
                                onChange={handleTabChange}
                            />
                        )}

                        {/* Posts List View */}
                        <div className="w-full">
                            {!showArchive ? (
                                postsLoading ? (
                                    <PostSkeleton count={3} />
                                ) : posts.length > 0 ? (
                                    posts.map(post => (
                                        <PostCard key={post.Id} post={post} />
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                                        No posts to show
                                    </div>
                                )
                            ) : (
                                archiveLoading ? (
                                    <PostSkeleton count={3} />
                                ) : archivePosts.length > 0 ? (
                                    archivePosts.map(post => (
                                        <PostCard key={post.Id} post={post} />
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                                        No archived posts to show
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;

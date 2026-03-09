import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/profile';
import { getUserPosts } from '../api/post';
import { followUser, unfollowUser, cancelFollowRequest } from '../api/follow';
import { IMAGE_BASE_URL, USER_AVATAR, COVER_IMAGE } from '../api/client';
import PostWidget from '../components/PostWidget';
import ConnectionsPopup from '../components/Popups/ConnectionsPopup';
import PostSkeleton from '../components/Skeleton/PostSkeleton';
import ProfileHeaderSkeleton from '../components/Skeleton/ProfileHeaderSkeleton';

const UserProfile = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('timeline');
    const [isConnectionsPopupOpen, setIsConnectionsPopupOpen] = useState(false);
    const [connectionsPopupTab, setConnectionsPopupTab] = useState('followers');
    const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

    // Posts state
    const [posts, setPosts] = useState([]);
    const [postsPage, setPostsPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Redirect to own profile if userId matches current user's ID
    useEffect(() => {
        if (user && user.id === userId) {
            navigate('/profile', { replace: true });
        }
    }, [user, userId, navigate]);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getUserProfile(userId);
            if (response && response.success) {
                const data = response.data;
                setProfileData({
                    ...data,
                    isFollowing: data.followStatus === 1
                });
                // Reset posts only when user manually refreshes or user changes
                // If it's a real-time update, we might want to keep posts or just refresh them
                setPostsPage(1);
                setHasMorePosts(true);
            } else {
                setError('Failed to load profile data');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message || 'An error occurred while fetching profile');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Fast real-time update listener
    useEffect(() => {
        const handleFollowUpdate = (e) => {
            const { userId: updatedUserId } = e.detail;
            if (updatedUserId === userId) {
                // Re-fetch profile to update followStatus and reveal content
                fetchProfile();
            }
        };

        window.addEventListener('followStatusUpdate', handleFollowUpdate);
        return () => window.removeEventListener('followStatusUpdate', handleFollowUpdate);
    }, [userId, fetchProfile]);

    const fetchPosts = async (page) => {
        if (isPostsLoading || !hasMorePosts || (profileData?.isPrivateProfile && !profileData?.isFollowing)) return;

        setIsPostsLoading(true);
        try {
            const response = await getUserPosts(userId, page);
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
            console.error('Error fetching posts:', err);
        } finally {
            setIsPostsLoading(false);
        }
    };

    useEffect(() => {
        if (profileData && (!profileData.isPrivateProfile || profileData.isFollowing)) {
            fetchPosts(1);
        }
    }, [profileData]);

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
                if (activeTab === 'timeline' && !isPostsLoading && hasMorePosts) {
                    fetchPosts(postsPage);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [postsPage, isPostsLoading, hasMorePosts, activeTab]);

    const handleFollowToggle = async () => {
        setIsActionLoading(true);
        try {
            if (profileData.followStatus === 1) {
                // Unfollow requires confirmation
                setShowUnfollowConfirm(true);
            } else if (profileData.followStatus === 0) {
                // Cancel pending follow request
                const response = await cancelFollowRequest(userId);
                if (response.success) {
                    setProfileData(prev => ({
                        ...prev,
                        followStatus: 2,
                        isFollowing: false
                    }));
                }
            } else {
                const response = await followUser(userId);
                if (response.success) {
                    const followStatus = response.data?.followStatus;
                    setProfileData(prev => ({
                        ...prev,
                        followStatus: followStatus,
                        isFollowing: followStatus === 1,
                        followersCount: followStatus === 1 ? (prev.followersCount || 0) + 1 : prev.followersCount
                    }));
                }
            }
        } catch (err) {
            console.error('Follow error:', err);
        } finally {
            setIsActionLoading(false);
        }
    };

    const confirmUnfollow = async () => {
        setIsActionLoading(true);
        setShowUnfollowConfirm(false);
        try {
            const response = await unfollowUser(userId);
            if (response.success) {
                setProfileData(prev => ({
                    ...prev,
                    isFollowing: false,
                    followStatus: 2,
                    followersCount: Math.max(0, (prev.followersCount || 0) - 1)
                }));
                // If it was private, clear posts
                if (profileData.isPrivateProfile) {
                    setPosts([]);
                    setHasMorePosts(false);
                }
            }
        } catch (err) {
            console.error('Unfollow error:', err);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleConnectionsChange = (counts) => {
        setProfileData(prev => ({
            ...prev,
            ...counts
        }));
    };

    const getGenderText = (gender) => {
        switch (gender) {
            case 1: return 'Men';
            case 2: return 'Women';
            case 3: return 'Other';
            default: return 'N/A';
        }
    };

    const getRelationshipStatusText = (status) => {
        switch (status) {
            case 1: return 'Single';
            case 2: return 'Married';
            case 3: return 'In Relationship';
            default: return 'N/A';
        }
    };

    if (loading) return <ProfileHeaderSkeleton />;
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
    if (!profileData) return <div className="p-10 text-center text-gray-400">Profile not found.</div>;

    const canSeeContent = !profileData.isPrivateProfile || profileData.isFollowing;

    return (
        <div className="content-page-box-area">
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
                        <img
                            src={profileData.coverImagePath ? `${IMAGE_BASE_URL}/${profileData.coverImagePath}` : COVER_IMAGE}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="px-4 md:px-8 lg:px-12 pb-6 lg:pb-0 relative">
                        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-4">
                            <div className="flex flex-col md:flex-row items-center w-full lg:w-auto">
                                <div className="mt-[-60px] md:mt-[-80px] lg:mt-[-100px] relative w-[130px] md:w-[180px] lg:w-[260px] shrink-0">
                                    <img
                                        src={profileData.profileImagePath ? `${IMAGE_BASE_URL}/${profileData.profileImagePath}` : USER_AVATAR}
                                        alt="profile"
                                        className="w-full h-full aspect-square object-cover border-4 border-white shadow-xl rounded-4xl bg-white"
                                    />
                                </div>
                                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left grow max-w-full overflow-hidden">
                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight truncate">{profileData.profileName}</h2>
                                    <h5 className="text-sm md:text-base text-gray-400 font-medium truncate mb-4 md:mb-2">{profileData.firstName + " " + profileData.lastName}</h5>

                                    <button
                                        onClick={handleFollowToggle}
                                        disabled={isActionLoading}
                                        className={`px-6 md:px-8 py-2 md:py-2.5 rounded-xl font-bold transition-all shadow-lg text-sm md:text-base ${profileData.followStatus === 1
                                            ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'
                                            : profileData.followStatus === 0
                                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 shadow-amber-50'
                                                : 'bg-main text-white hover:bg-blue-700 shadow-blue-100'
                                            }`}
                                    >
                                        {isActionLoading ? '...' : (
                                            profileData.followStatus === 1
                                                ? 'Unfollow'
                                                : profileData.followStatus === 0
                                                    ? 'Cancel Request'
                                                    : 'Follow'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <ul className="flex flex-row items-center justify-between sm:justify-center gap-x-4 md:gap-x-10 lg:gap-x-12 mt-8 lg:mt-0 bg-gray-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl w-full lg:w-auto">
                                <li className="text-center relative flex-1 sm:flex-none">
                                    <span className="block text-lg md:text-xl font-bold text-gray-800 leading-none">{profileData.postCount || 0}</span>
                                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 block">Posts</span>
                                </li>
                                <li className="h-8 w-px bg-gray-200 hidden sm:block"></li>
                                <li className="text-center flex-1 sm:flex-none">
                                    <button
                                        onClick={() => {
                                            if (canSeeContent) {
                                                setConnectionsPopupTab('followers');
                                                setIsConnectionsPopupOpen(true);
                                            }
                                        }}
                                        className={`block w-full ${canSeeContent ? 'group' : 'cursor-not-allowed opacity-75'}`}
                                    >
                                        <span className={`block text-lg md:text-xl font-bold text-gray-800 leading-none ${canSeeContent ? 'group-hover:text-main' : ''} transition-colors uppercase tracking-tight`}>{profileData.followersCount || 0}</span>
                                        <span className={`text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 block ${canSeeContent ? 'group-hover:text-gray-500' : ''} transition-colors`}>Followers</span>
                                    </button>
                                </li>
                                <li className="h-8 w-px bg-gray-200 hidden sm:block"></li>
                                <li className="text-center flex-1 sm:flex-none">
                                    <button
                                        onClick={() => {
                                            if (canSeeContent) {
                                                setConnectionsPopupTab('following');
                                                setIsConnectionsPopupOpen(true);
                                            }
                                        }}
                                        className={`block w-full ${canSeeContent ? 'group' : 'cursor-not-allowed opacity-75'}`}
                                    >
                                        <span className={`block text-lg md:text-xl font-bold text-gray-800 leading-none ${canSeeContent ? 'group-hover:text-main' : ''} transition-colors uppercase tracking-tight`}>{profileData.followingCount || 0}</span>
                                        <span className={`text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 block ${canSeeContent ? 'group-hover:text-gray-500' : ''} transition-colors`}>Following</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {canSeeContent && (
                            <div className="mt-8 md:mt-12 ">
                                <ul className="flex space-x-8" role="tablist">
                                    {['timeline', 'about'].map(tab => (
                                        <li key={tab} className="relative">
                                            <button
                                                className={`py-4 font-bold text-[15px] transition-all relative capitalize ${activeTab === tab
                                                    ? 'text-main after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-main after:rounded-t-full'
                                                    : 'text-gray-500 hover:text-main'
                                                    }`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="tab-content">
                {!canSeeContent ? (
                    <div className="bg-white rounded-3xl px-20 py-10 text-center shadow-sm border border-gray-100 animate-fade-in-up">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="ri-lock-2-line text-5xl text-main"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">This Account is Private</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Follow this account to see their photos and videos.</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'timeline' && (
                            <div className="flex flex-col-reverse lg:flex-row -mx-3">
                                <div className="w-full lg:w-3/4 px-3">
                                    <div className="news-feed-area">
                                        {posts.length > 0 ? (
                                            posts.map(post => (
                                                <PostWidget key={post.id} post={post} profileData={profileData} />
                                            ))
                                        ) : !isPostsLoading && (
                                            <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                                                <i className="ri-camera-line text-5xl text-gray-200 mb-4 block"></i>
                                                <p className="text-gray-400 font-medium">No posts to display yet.</p>
                                            </div>
                                        )}
                                        {isPostsLoading && <PostSkeleton count={2} />}
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/4 px-3 ">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sticky top-25">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-50 flex items-center">
                                            <i className="ri-information-line mr-2 text-main"></i>
                                            About {profileData.firstName}
                                        </h3>
                                        <div className="bg-gray-50/50 p-4 rounded-2xl mb-6">
                                            <p className="text-gray-600 text-sm leading-relaxed italic">
                                                "{profileData.bio || "No bio information provided yet."}"
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center p-3 rounded-xl bg-blue-50/30 transition-colors hover:bg-blue-50/50">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm mr-3">
                                                    <i className="ri-user-heart-line text-main text-sm"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">Status</p>
                                                    <p className="text-gray-700 text-sm font-semibold">{getRelationshipStatusText(profileData.relationshipStatus)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center p-3 rounded-xl bg-purple-50/30 transition-colors hover:bg-purple-50/50">
                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm mr-3">
                                                    <i className="ri-cake-2-line text-purple-500 text-sm"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1">Birthday</p>
                                                    <p className="text-gray-700 text-sm font-semibold">{profileData.birthDay ? new Date(profileData.birthDay).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="flex flex-wrap -mx-3 items-stretch">
                                <div className="w-full lg:w-1/3 px-3">
                                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 h-full">
                                        <h4 className="font-bold text-lg mb-8 text-gray-800 border-b pb-4 border-gray-50 flex items-center">
                                            <i className="ri-contacts-line mr-3 text-main"></i>
                                            Personal Details
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mr-4">
                                                    <i className="ri-user-smile-line text-main"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                                                    <p className="font-semibold text-gray-800">{profileData.firstName} {profileData.lastName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 mr-4">
                                                    <i className="ri-men-line text-pink-500"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
                                                    <p className="font-semibold text-gray-800">{getGenderText(profileData.gender)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mr-4">
                                                    <i className="ri-mail-line text-amber-500"></i>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                                    <p className="font-semibold text-gray-800 truncate">{profileData.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/3 px-3 mt-6 lg:mt-0">
                                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 h-full">
                                        <h4 className="font-bold text-lg mb-8 text-gray-800 border-b pb-4 border-gray-50 flex items-center">
                                            <i className="ri-briefcase-line mr-3 text-main"></i>
                                            Work Experience
                                        </h4>
                                        <div className="space-y-8 relative">
                                            {profileData.experiences && profileData.experiences.length > 0 ? (
                                                <>
                                                    <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-linear-to-b from-blue-50 via-blue-100 to-transparent"></div>
                                                    {profileData.experiences.map(exp => (
                                                        <div key={exp.id} className="relative pl-12 group">
                                                            <div className="absolute left-0 top-1.5 w-10 h-10 bg-white rounded-xl border border-blue-50 flex items-center justify-center z-10 shadow-sm group-hover:border-main transition-colors">
                                                                <div className="w-2.5 h-2.5 bg-main rounded-full animate-pulse-slow"></div>
                                                            </div>
                                                            <div className="bg-gray-50/30 p-5 rounded-2xl group-hover:bg-gray-50/70 transition-colors border border-transparent group-hover:border-gray-100">
                                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                                                    <h5 className="font-bold text-gray-800 text-lg">{exp.position}</h5>
                                                                    <span className="text-[11px] font-bold px-3 py-1 bg-white rounded-full text-main shadow-sm border border-blue-50 mt-2 md:mt-0 self-start md:self-center">
                                                                        {new Date(exp.startAt).getFullYear()} — {exp.isCurrent ? 'Present' : new Date(exp.endAt).getFullYear()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-main font-bold text-sm mb-3 flex items-center">
                                                                    <i className="ri-building-line mr-2"></i>
                                                                    {exp.company}
                                                                </p>
                                                                <p className="text-gray-600 leading-relaxed text-[15px]">{exp.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                        <i className="ri-briefcase-line text-3xl text-gray-300"></i>
                                                    </div>
                                                    <p className="text-gray-400 font-medium">No work experience shared yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Unfollow Confirmation Modal */}
            {showUnfollowConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-2000 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-4xl p-8 max-w-sm w-full shadow-2xl animate-fade-in-up text-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white shadow-lg">
                            <img
                                src={profileData.profileImagePath ? `${IMAGE_BASE_URL}/${profileData.profileImagePath}` : USER_AVATAR}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Unfollow @{profileData.profileName}?</h4>
                        <p className="text-gray-500 text-sm mb-8">You will stop seeing their updates in your timeline. You can always follow them again later.</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmUnfollow}
                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100"
                            >
                                Unfollow
                            </button>
                            <button
                                onClick={() => setShowUnfollowConfirm(false)}
                                className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConnectionsPopup
                isOpen={isConnectionsPopupOpen}
                onClose={() => setIsConnectionsPopupOpen(false)}
                initialTab={connectionsPopupTab}
                userId={userId}
                onCountChange={handleConnectionsChange}
            />
        </div>
    );
};

export default UserProfile;

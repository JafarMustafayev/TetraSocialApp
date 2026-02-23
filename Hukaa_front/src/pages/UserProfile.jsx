import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/profile';
import { getUserPosts } from '../api/post';
import { followUser, unfollowUser } from '../api/follow';
import { IMAGE_BASE_URL, USER_AVATAR, COVER_IMAGE } from '../api/client';
import PostWidget from '../components/PostWidget';
import ConnectionsPopup from '../components/ConnectionsPopup';

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

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await getUserProfile(userId);
                if (response && response.success) {
                    setProfileData(response.data);
                    // Reset posts when user changes
                    setPosts([]);
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
        };

        fetchProfile();
    }, [userId]);

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
            if (profileData.isFollowing) {
                // Unfollow requires confirmation
                setShowUnfollowConfirm(true);
            } else {
                const response = await followUser(userId);
                if (response.success) {
                    setProfileData(prev => ({
                        ...prev,
                        isFollowing: true,
                        followersCount: (prev.followersCount || 0) + 1
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

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-main border-t-transparent"></div>
        </div>
    );
    if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
    if (!profileData) return <div className="p-10 text-center text-gray-400">Profile not found.</div>;

    const canSeeContent = !profileData.isPrivateProfile || profileData.isFollowing;

    return (
        <div className="content-page-box-area">
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="relative w-full h-[300px] overflow-hidden">
                        <img
                            src={profileData.coverImagePath ? `${IMAGE_BASE_URL}/${profileData.coverImagePath}` : COVER_IMAGE}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="px-6 md:px-12 pb-6 md:pb-0 relative">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <div className="mt-[-80px] md:mt-[-100px] relative w-[200px] md:w-[250px] lg:w-[300px] shrink-0 ">
                                <img
                                    src={profileData.profileImagePath ? `${IMAGE_BASE_URL}/${profileData.profileImagePath}` : USER_AVATAR}
                                    alt="profile"
                                    className="w-full h-full object-cover border-4 border-white shadow-md rounded-4xl"
                                />
                            </div>
                            <div className="mt-4 md:mt-2 text-center md:text-left grow md:ml-8">
                                <h2 className="text-2xl font-bold text-gray-800">{profileData.profileName}</h2>
                                <h5 className="text-gray-500 font-medium">{profileData.firstName + " " + profileData.lastName}</h5>

                                <button
                                    onClick={handleFollowToggle}
                                    disabled={isActionLoading}
                                    className={`mt-4 px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg ${profileData.isFollowing
                                        ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'
                                        : 'bg-main text-white hover:bg-blue-700 shadow-blue-100'
                                        }`}
                                >
                                    {isActionLoading ? '...' : (profileData.isFollowing ? 'Unfollow' : 'Follow')}
                                </button>
                            </div>
                            <ul className="flex items-center space-x-6 lg:space-x-12 mt-6 md:mt-0">
                                <li className="text-center relative after:content-[''] after:absolute after:right-[-12px] lg:after:right-[-24px] after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200 last:after:hidden">
                                    <span className="block text-lg font-bold text-gray-800 leading-none">{profileData.postCount || 0}</span>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block">Posts</span>
                                </li>
                                <li className="text-center">
                                    <button onClick={() => setIsConnectionsPopupOpen(true)} className="block group">
                                        <span className="block text-lg font-bold text-gray-800 leading-none group-hover:text-main transition-colors uppercase tracking-tight">{profileData.followersCount || 0}</span>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block group-hover:text-gray-500 transition-colors">Followers</span>
                                    </button>
                                </li>
                                <li className="text-center relative after:content-[''] after:absolute after:right-[-12px] lg:after:right-[-24px] after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200 last:after:hidden">
                                    <button onClick={() => setIsConnectionsPopupOpen(true)} className="block group">
                                        <span className="block text-lg font-bold text-gray-800 leading-none group-hover:text-main transition-colors uppercase tracking-tight">{profileData.followingCount || 0}</span>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block group-hover:text-gray-500 transition-colors">Following</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {canSeeContent && (
                            <div className="mt-8 md:mt-12 border-t border-gray-50">
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
                            <div className="flex flex-wrap -mx-3">
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
                                        {isPostsLoading && (
                                            <div className="flex justify-center py-10">
                                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-main border-t-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/4 px-3">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-50">About {profileData.firstName}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                                            "{profileData.bio || "No bio information provided yet."}"
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm">
                                                <i className="ri-user-heart-line mr-3 text-main"></i>
                                                <span className="text-gray-500">{getRelationshipStatusText(profileData.relationshipStatus)}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <i className="ri-cake-2-line mr-3 text-main"></i>
                                                <span className="text-gray-500">{profileData.birthDay ? new Date(profileData.birthDay).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full lg:w-1/3 px-3">
                                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-lg mb-6 text-gray-800 border-b pb-4 border-gray-50">Personal Details</h4>
                                        <ul className="space-y-4">
                                            <li className="flex justify-between text-sm">
                                                <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Full Name</span>
                                                <span className="font-semibold text-gray-700">{profileData.firstName} {profileData.lastName}</span>
                                            </li>
                                            <li className="flex justify-between text-sm">
                                                <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Gender</span>
                                                <span className="font-semibold text-gray-700">{getGenderText(profileData.gender)}</span>
                                            </li>
                                            <li className="flex justify-between text-sm">
                                                <span className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">Email</span>
                                                <span className="font-semibold text-gray-700 truncate ml-4">{profileData.email || 'N/A'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/3 px-3 mt-6 lg:mt-0">
                                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-lg mb-6 text-gray-800 border-b pb-4 border-gray-50">Work Experience</h4>
                                        <div className="space-y-8">
                                            {profileData.experiences && profileData.experiences.length > 0 ? (
                                                profileData.experiences.map(exp => (
                                                    <div key={exp.id} className="relative pl-8 border-l-2 border-blue-50 py-2">
                                                        <div className="absolute left-[-9px] top-4 w-4 h-4 bg-white border-4 border-main rounded-full"></div>
                                                        <h5 className="font-bold text-gray-800 text-lg">{exp.position}</h5>
                                                        <p className="text-main font-bold text-sm mb-2">{exp.company}</p>
                                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                                                            {new Date(exp.startAt).getFullYear()} — {exp.isCurrent ? 'Present' : new Date(exp.endAt).getFullYear()}
                                                        </p>
                                                        <p className="text-gray-600 leading-relaxed text-[15px]">{exp.description}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 italic py-10 text-center">No work experience shared yet.</p>
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
            />
        </div>
    );
};

export default UserProfile;

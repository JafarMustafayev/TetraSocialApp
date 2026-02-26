import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../api/profile';
import { getMyPosts } from '../api/post';
import { IMAGE_BASE_URL, USER_AVATAR, COVER_IMAGE } from '../api/client';
import PostWidget from '../components/PostWidget';
import CreatePostWidget from '../components/CreatePostWidget';
import ConnectionsPopup from '../components/Popups/ConnectionsPopup';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('timeline');
    const [isConnectionsPopupOpen, setIsConnectionsPopupOpen] = useState(false);
    const [connectionsPopupTab, setConnectionsPopupTab] = useState('followers');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Posts state for infinite scroll
    const [posts, setPosts] = useState([]);
    const [postsPage, setPostsPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isPostsLoading, setIsPostsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getMyProfile();
                if (response && response.success) {
                    setProfileData(response.data);
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
    }, []);

    const fetchPosts = async (page) => {
        if (isPostsLoading || !hasMorePosts) return;

        setIsPostsLoading(true);
        try {
            const response = await getMyPosts(page);
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

    // Load initial posts
    useEffect(() => {
        if (profileData) {
            fetchPosts(1);
        }
    }, [profileData]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
                if (activeTab === 'timeline') {
                    fetchPosts(postsPage);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [postsPage, isPostsLoading, hasMorePosts, activeTab]);

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

    if (loading) return <div className="p-5 text-center">Loading profile...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;
    if (!profileData) return <div className="p-5 text-center">No profile data found.</div>;

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
        setProfileData(prev => ({
            ...prev,
            postCount: (prev.postCount || 0) + 1
        }));
    };

    const handlePostDeleted = (postId) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setProfileData(prev => ({
            ...prev,
            postCount: Math.max(0, (prev.postCount || 0) - 1)
        }));
    };

    const handlePostUpdated = (updatedPost) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };

    const handlePostArchived = (postId) => {
        // For timeline, we hide archived posts
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const handleConnectionsChange = (counts) => {
        setProfileData(prev => ({
            ...prev,
            ...counts
        }));
    };

    const openConnections = (tab) => {
        setConnectionsPopupTab(tab);
        setIsConnectionsPopupOpen(true);
    };

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

                    <div className="px-4 md:px-8 lg:px-12 pb-6 lg:pb-0 relative">
                        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end">
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
                                    <h5 className="text-sm md:text-base text-gray-400 font-medium truncate">{profileData.firstName + " " + profileData.lastName}</h5>
                                </div>
                            </div>

                            <ul className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-10 lg:gap-x-12 mt-8 lg:mt-0 bg-gray-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl w-full lg:w-auto">
                                <li className="text-center relative">
                                    <span className="block text-lg md:text-xl font-bold text-gray-800 leading-none">{profileData.postCount || 0}</span>
                                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 block">Posts</span>
                                </li>
                                <li className="h-8 w-px bg-gray-200 hidden sm:block"></li>
                                <li className="text-center">
                                    <button
                                        onClick={() => openConnections('followers')}
                                        className="block group"
                                    >
                                        <span className="block text-lg md:text-xl font-bold text-gray-800 leading-none group-hover:text-main transition-colors uppercase tracking-tight">{profileData.followersCount || 0}</span>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 block group-hover:text-gray-500 transition-colors">Followers</span>
                                    </button>
                                </li>
                                <li className="h-8 w-px bg-gray-200 hidden sm:block"></li>
                                <li className="text-center">
                                    <button
                                        onClick={() => openConnections('following')}
                                        className="block group"
                                    >
                                        <span className="block text-lg md:text-xl font-bold text-gray-800 leading-none group-hover:text-main transition-colors uppercase tracking-tight">{profileData.followingCount || 0}</span>
                                        <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5 block group-hover:text-gray-500 transition-colors">Following</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 md:mt-12 border-t border-gray-50">
                            <ul className="flex space-x-8" role="tablist">
                                <li className="relative">
                                    <button
                                        className={`py-4 font-bold text-[15px] transition-all relative ${activeTab === 'timeline'
                                            ? 'text-blue-600 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-t-full'
                                            : 'text-gray-500 hover:text-blue-500'
                                            }`}
                                        onClick={() => setActiveTab('timeline')}
                                    >
                                        Timeline
                                    </button>
                                </li>

                                <li className="relative">
                                    <button
                                        className={`py-4 font-bold text-[15px] transition-all relative ${activeTab === 'about'
                                            ? 'text-blue-600 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-blue-600 after:rounded-t-full'
                                            : 'text-gray-500 hover:text-blue-500'
                                            }`}
                                        onClick={() => setActiveTab('about')}
                                    >
                                        About
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tab-content" id="myTabContent">
                {activeTab === 'timeline' && (
                    <div className="tab-pane fade show active" id="timeline" role="tabpanel">
                        <div className="flex flex-wrap -mx-3">
                            <div className="w-full lg:w-3/4 px-3">
                                <div className="news-feed-area">
                                    <CreatePostWidget profileData={profileData} onPostCreated={handlePostCreated} />

                                    {posts && posts.length > 0 ? (
                                        posts.map(post => (
                                            <PostWidget
                                                key={post.id}
                                                post={post}
                                                profileData={profileData}
                                                onDelete={handlePostDeleted}
                                                onUpdate={handlePostUpdated}
                                                onArchive={handlePostArchived}
                                            />
                                        ))
                                    ) : !isPostsLoading && (
                                        <div className="p-10 text-center bg-white rounded-lg border border-dashed border-gray-200">
                                            <p className="text-gray-400">No posts to display yet.</p>
                                        </div>
                                    )}

                                    {isPostsLoading && (
                                        <div className="space-y-6">
                                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="h-20 bg-gray-50 rounded-lg mb-4"></div>
                                                <div className="flex space-x-4 justify-between">
                                                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                                                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                                                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full lg:w-1/4 px-3">
                                <aside className="widget-area">
                                    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-50">Who's Following</h3>
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center">
                                                    <Link to="#" className="relative shrink-0">
                                                        <img src={USER_AVATAR} className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-blue-100 transition-all" alt="image" />
                                                    </Link>
                                                    <div className="ml-3">
                                                        <Link to="#" className="block text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors leading-tight">Shawn Lynch</Link>
                                                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-tighter">New York, USA</span>
                                                    </div>
                                                </div>
                                                <Link to="#" className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Add</Link>
                                            </div>
                                            <div className="flex items-center justify-between group">
                                                <div className="flex items-center">
                                                    <Link to="#" className="relative shrink-0">
                                                        <img src={USER_AVATAR} className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-blue-100 transition-all" alt="image" />
                                                    </Link>
                                                    <div className="ml-3">
                                                        <Link to="#" className="block text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors leading-tight">Kenneth Perry</Link>
                                                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-tighter">London, UK</span>
                                                    </div>
                                                </div>
                                                <Link to="#" className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Add</Link>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="tab-pane fade show active" id="about" role="tabpanel">
                        <div className="flex flex-wrap -mx-3 items-stretch">
                            <div className="w-full lg:w-1/3 px-3">
                                <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 ">
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
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mr-4">
                                                <i className="ri-phone-line text-green-500"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                                <p className="font-semibold text-gray-800">{profileData.myNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mr-4">
                                                <i className="ri-cake-2-line text-purple-500"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Birthday</p>
                                                <p className="font-semibold text-gray-800">{profileData.birthDay ? new Date(profileData.birthDay).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mr-4">
                                                <i className="ri-user-heart-line text-red-500"></i>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Relationship</p>
                                                <p className="font-semibold text-gray-800">{getRelationshipStatusText(profileData.relationshipStatus)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-2/3 px-3 mt-6 lg:mt-0">
                                <div className="space-y-6 flex flex-col h-full">
                                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-lg mb-6 text-gray-800 border-b pb-4 border-gray-50 flex items-center">
                                            <i className="ri-information-line mr-3 text-main"></i>
                                            About Me
                                        </h4>
                                        <div className="bg-gray-50/30 p-6 rounded-2xl border border-gray-50/50">
                                            <p className="text-gray-600 leading-relaxed italic text-lg line-height-relaxed">
                                                "{profileData.bio || "No bio information provided yet."}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 grow">
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
                                                                        {exp.startAt && !exp.startAt.startsWith('0001') ? new Date(exp.startAt).getFullYear() : 'N/A'} — {exp.isCurrent ? 'Present' : (exp.endAt ? new Date(exp.endAt).getFullYear() : 'Present')}
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
                        </div>
                    </div>
                )}
            </div>

            <ConnectionsPopup
                isOpen={isConnectionsPopupOpen}
                onClose={() => setIsConnectionsPopupOpen(false)}
                initialTab={connectionsPopupTab}
                userId={null}
                onCountChange={handleConnectionsChange}
            />
        </div >
    );
};

export default Profile;

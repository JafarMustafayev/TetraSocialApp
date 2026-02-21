import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../api/profile';
import { getMyPosts } from '../api/post';
import { IMAGE_BASE_URL } from '../api/client';
import PostWidget from '../components/PostWidget';
import CreatePostWidget from '../components/CreatePostWidget';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('timeline');
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

    return (
        <div className="content-page-box-area">
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="relative w-full h-[300px] overflow-hidden">
                        <img
                            src={profileData.coverImagePath ? `${IMAGE_BASE_URL}/${profileData.coverImagePath}` : "/src/assets/images/my-profile-bg.jpg"}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="px-6 md:px-12 pb-6 md:pb-0 relative">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mt-[-80px] md:mt-[-100px] relative w-[200px] md:w-[250px] lg:w-[300px] shrink-0">
                                <img
                                    src={profileData.profileImagePath ? `${IMAGE_BASE_URL}/${profileData.profileImagePath}` : "/src/assets/images/my-profile.jpg"}
                                    alt="profile"
                                    className="w-full h-full object-cover border-4 border-white shadow-md rounded-4xl"
                                />
                            </div>
                            <div className="mt-4 md:mt-2 text-center md:text-left grow md:ml-8">
                                <h2 className="text-2xl font-bold text-gray-800">{profileData.profileName}</h2>
                                <h5 className="text-gray-500 font-medium">{profileData.firstName + " " + profileData.lastName}</h5>
                            </div>
                            <ul className="flex items-center space-x-6 lg:space-x-12 mt-6 md:mt-0">
                                <li className="text-center relative after:content-[''] after:absolute after:right-[-12px] lg:after:right-[-24px] after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200 last:after:hidden">
                                    <span className="block text-lg font-bold text-gray-800 leading-none">{profileData.postCount || 0}</span>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block">Posts</span>
                                </li>
                                <li className="text-center relative after:content-[''] after:absolute after:right-[-12px] lg:after:right-[-24px] after:top-1/4 after:h-1/2 after:w-px after:bg-gray-200 last:after:hidden">
                                    <Link to="#" className="block group">
                                        <span className="block text-lg font-bold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">{profileData.followingCount || 0}</span>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block group-hover:text-gray-500 transition-colors">Following</span>
                                    </Link>
                                </li>
                                <li className="text-center">
                                    <Link to="#" className="block group">
                                        <span className="block text-lg font-bold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">{profileData.followersCount || 0}</span>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block group-hover:text-gray-500 transition-colors">Followers</span>
                                    </Link>
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
                <div className={`tab-pane fade ${activeTab === 'timeline' ? 'show active' : ''}`} id="timeline" role="tabpanel">
                    <div className="row">
                        <div className="col-lg-9 col-md-12">
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
                                        {[1, 2].map(i => (
                                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                                                    </div>
                                                </div>
                                                <div className="h-20 bg-gray-50 rounded-lg mb-4"></div>
                                                <div className="flex space-x-4">
                                                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                                                    <div className="h-8 w-24 bg-gray-100 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-12">
                            <aside className="widget-area">
                                <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-50">Who's Following</h3>
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center">
                                                <Link to="#" className="relative shrink-0">
                                                    <img src="src/assets/images/user/user-42.jpg" className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-blue-100 transition-all" alt="image" />
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
                                                    <img src="src/assets/images/user/user-43.jpg" className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-blue-100 transition-all" alt="image" />
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

                <div className={`tab-pane fade ${activeTab === 'about' ? 'show active' : ''}`} id="about" role="tabpanel">
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <div className="about-personal-information p-4 bg-white rounded-lg shadow-sm">
                                <div className="about-header d-flex justify-content-between align-items-center border-b pb-3 mb-3">
                                    <div className="title font-bold text-lg">Personal Information</div>
                                </div>

                                <ul className="information-list space-y-3">
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Name:</span>
                                        <span>{profileData?.firstName ? profileData.firstName : 'N/A'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Surname:</span>
                                        <span>{profileData?.lastName ? profileData.lastName : 'N/A'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Birthday:</span>
                                        <span>{profileData?.birthDay ? new Date(profileData.birthDay).toLocaleDateString() : 'N/A'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Phone:</span>
                                        <span>{profileData?.myNumber || 'N/A'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Email:</span>
                                        <span>{profileData?.email ? profileData.email : 'N/A'}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Gender:</span>
                                        <span>{getGenderText(profileData?.gender)}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="font-bold text-gray-500">Relationship:</span>
                                        <span>{getRelationshipStatusText(profileData?.relationshipStatus)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-8 col-md-12">
                            <div className="about-details-information space-y-4">
                                <div className="information-box-content p-4 bg-white rounded-lg shadow-sm">
                                    <div className="information-header d-flex justify-content-between align-items-center border-b pb-3 mb-3">
                                        <div className="title font-bold text-lg">About Me!</div>
                                    </div>
                                    <div className="content">
                                        <p className="text-gray-600 leading-relaxed">{profileData?.bio || "No bio information provided yet."}</p>
                                    </div>
                                </div>

                                <div className="information-box-content p-4 bg-white rounded-lg shadow-sm">
                                    <div className="information-header d-flex justify-content-between align-items-center border-b pb-3 mb-3">
                                        <div className="title font-bold text-lg">Experience</div>
                                    </div>

                                    <div className="space-y-6">
                                        {profileData?.experiences && profileData.experiences.length > 0 ? (
                                            profileData.experiences.map((exp) => (
                                                <div key={exp.id} className="box-content border-l-2 border-blue-100 pl-4 py-1 relative">
                                                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-2 border-2 border-white shadow-sm"></div>
                                                    <p className="designation font-bold text-[16px] text-[#3644D9] flex items-center">
                                                        {exp.position}
                                                        <span className="ml-2 px-2 py-0.5 bg-blue-50 text-[11px] font-semibold text-blue-600 rounded uppercase">
                                                            {exp.startAt && !exp.startAt.startsWith('0001') ? new Date(exp.startAt).getFullYear() : 'N/A'} — {exp.isCurrent || !exp.endAt ? 'Present' : new Date(exp.endAt).getFullYear()}
                                                        </span>
                                                    </p>
                                                    <span className="title block font-semibold text-gray-600 mt-1">{exp.company}</span>
                                                    {exp.description && <p className="text-gray-500 text-sm mt-2 italic">{exp.description}</p>}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400 italic">No work experience mentioned.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Profile;

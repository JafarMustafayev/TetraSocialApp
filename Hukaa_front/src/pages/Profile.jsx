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
            <div className="my-profile-inner-box">
                {/* ... existing profile header code ... */}
                <div className="profile-cover-image w-full h-[300px] overflow-hidden">
                    <img
                        src={profileData.coverImagePath ? `${IMAGE_BASE_URL}/${profileData.coverImagePath}` : "/src/assets/images/my-profile-bg.jpg"}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="profile-info-box">
                    <div className="inner-info-box d-flex justify-content-between align-items-center">
                        <div className="info-image w-[300px]">
                            <img
                                src={profileData.profileImagePath ? `${IMAGE_BASE_URL}/${profileData.profileImagePath}` : "/src/assets/images/my-profile.jpg"}
                                alt="profile"
                                className="w-full h-full object-cover  border-2 border-gray-50 shadow-sm rounded-3xl"
                            />
                        </div>
                        <div className="info-text mt-2">
                            <h2>{profileData.profileName}</h2>
                            <h5>{profileData.firstName + " " + profileData.lastName}</h5>
                        </div>
                        <ul className="statistics">
                            <li>
                                <span className="item-number">{profileData.postCount || 0}</span>
                                <span className="item-text">Posts</span>
                            </li>
                            <li>
                                <Link to="#">
                                    <span className="item-number">{profileData.followingCount || 0}</span>
                                    <span className="item-text">Following</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <span className="item-number">{profileData.followersCount || 0}</span>
                                    <span className="item-text">Followers</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="profile-list-tabs">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('timeline')}
                                >
                                    Timeline
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('about')}
                                >
                                    About
                                </button>
                            </li>
                        </ul>
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
                                <div className="widget widget-who-following">
                                    <h3 className="widget-title">Who's Following</h3>
                                    <div className="following-item d-flex justify-content-between align-items-center">
                                        <Link to="#"><img src="src/assets/images/user/user-42.jpg" className="rounded-circle" alt="image" /></Link>
                                        <span className="name"><Link to="#">Shawn Lynch</Link></span>
                                        <span className="add-friend"><Link to="#">Add</Link></span>
                                    </div>
                                    <div className="following-item d-flex justify-content-between align-items-center">
                                        <Link to="#"><img src="src/assets/images/user/user-43.jpg" className="rounded-circle" alt="image" /></Link>
                                        <span className="name"><Link to="#">Kenneth Perry</Link></span>
                                        <span className="add-friend"><Link to="#">Add</Link></span>
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
        </div>
    );
};

export default Profile;

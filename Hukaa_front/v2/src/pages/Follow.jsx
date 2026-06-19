// src/pages/Follow.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import {
    getUserProfile,
    getUserFollowers,
    getUserFollowing,
    followUser,
    unfollowUser
} from '../api/account.api.js';
import Tabs from '../components/ui/Tabs.jsx';
import { Skeleton, UserListItemSkeleton } from '../components/skeletons/index.js';

const Follow = ({ tab = 'followers' }) => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const targetUsername = username || currentUser?.username || 'jafarmustafayev';

    // State Variables
    const [profile, setProfile] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [listLoading, setListLoading] = useState(true);

    const followTabs = [
        { id: 'followers', label: 'Followers' },
        { id: 'following', label: 'Following' }
    ];

    // Fetch profile info
    useEffect(() => {
        const fetchProfile = async () => {
            if (!targetUsername) return;
            setLoading(true);
            try {
                const res = await getUserProfile(targetUsername);
                if (res.Success) {
                    setProfile(res.Data);
                } else {
                    toast.error(res.Message || 'Failed to load profile.');
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred while loading profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [targetUsername]);

    // Fetch lists
    useEffect(() => {
        const fetchLists = async () => {
            if (!targetUsername) return;
            setListLoading(true);
            try {
                const followersRes = await getUserFollowers(targetUsername);
                const followingRes = await getUserFollowing(targetUsername);

                if (followersRes.Success) {
                    setFollowers(followersRes.Data);
                }
                if (followingRes.Success) {
                    setFollowing(followingRes.Data);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load lists.');
            } finally {
                setListLoading(false);
            }
        };

        fetchLists();
    }, [targetUsername]);

    // Follow/Unfollow Handler inside Lists
    const handleToggleFollowInList = async (userInList) => {
        try {
            if (userInList.isFollowing) {
                const res = await unfollowUser(userInList.username);
                if (res.Success) {
                    const updateList = (list) =>
                        list.map(u => u.username === userInList.username ? { ...u, isFollowing: false } : u);
                    setFollowers(updateList);
                    setFollowing(updateList);
                    toast.success(`Unfollowed @${userInList.username}`);
                }
            } else {
                const res = await followUser(userInList.username);
                if (res.Success) {
                    const updateList = (list) =>
                        list.map(u => u.username === userInList.username ? { ...u, isFollowing: true } : u);
                    setFollowers(updateList);
                    setFollowing(updateList);
                    toast.success(`Followed @${userInList.username}`);
                }
            }
        } catch (err) {
            toast.error('Action failed. Please try again.');
        }
    };

    const handleTabChange = (tabName) => {
        navigate(`/${targetUsername}/${tabName}`, { replace: true });
    };

    const getInitials = (name) => {
        return name ? name[0].toUpperCase() : 'U';
    };

    return (
        <div className="flex justify-center w-full bg-white dark:bg-[#09090b] transition-colors duration-300">
            {/* Main Profile Feed Area */}
            <div className="w-full  border-x border-gray-100 dark:border-neutral-900 min-h-screen pb-10">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md  flex items-center gap-4 px-4 h-[53px]">
                    <button
                        onClick={() => navigate(`/${targetUsername}`)}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors shrink-0"
                        aria-label="Back"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <div>
                        <h2 className="text-xl  font-extralight  active:bg-gray-900:text-white ">
                            {loading ? <Skeleton className="h-5 w-32" /> : "@" + profile?.name}
                        </h2>

                    </div>
                </div>

                {/* Tab Bar */}
                <Tabs tabs={followTabs} activeTab={tab} onChange={handleTabChange} />

                {/* Lists Content */}
                <div className="w-full">
                    {listLoading ? (
                        [...Array(3)].map((_, i) => <UserListItemSkeleton key={i} />)
                    ) : (
                        tab === 'followers' ? (
                            followers.length > 0 ? (
                                followers.map(usr => (
                                    <div key={usr.id} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#1f1f1f] hover:bg-gray-50/50 dark:hover:bg-[#16181c]/30">
                                        <Link to={`/${usr.username}`} className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main shrink-0 text-sm">
                                                {getInitials(usr.name)}
                                            </div>
                                            <div className="min-w-0 flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white truncate hover:underline text-[14px]">
                                                    {usr.name}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[13px] text-gray-500 truncate">@{usr.username}</span>
                                                    {usr.followsYou && (
                                                        <span className="text-[10px] bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-gray-500 font-semibold shrink-0">
                                                            Follows you
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                        {usr.username !== currentUser?.username && (
                                            <button
                                                onClick={() => handleToggleFollowInList(usr)}
                                                className={`px-4 py-1.5 rounded-full font-bold text-[13px] transition-colors duration-200 ${usr.isFollowing
                                                    ? 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50/10'
                                                    : 'bg-main text-white hover:bg-main-hover'
                                                    }`}
                                            >
                                                {usr.isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                                    No followers yet
                                </div>
                            )
                        ) : (
                            following.length > 0 ? (
                                following.map(usr => (
                                    <div key={usr.id} className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-[#1f1f1f] hover:bg-gray-50/50 dark:hover:bg-[#16181c]/30">
                                        <Link to={`/${usr.username}`} className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-main shrink-0 text-sm">
                                                {getInitials(usr.name)}
                                            </div>
                                            <div className="min-w-0 flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white truncate hover:underline text-[14px]">
                                                    {usr.name}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[13px] text-gray-500 truncate">@{usr.username}</span>
                                                    {usr.followsYou && (
                                                        <span className="text-[10px] bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-gray-500 font-semibold shrink-0">
                                                            Follows you
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                        {usr.username !== currentUser?.username && (
                                            <button
                                                onClick={() => handleToggleFollowInList(usr)}
                                                className={`px-4 py-1.5 rounded-full font-bold text-[13px] transition-colors duration-200 ${usr.isFollowing
                                                    ? 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-red-500 hover:text-red-500 hover:bg-red-50/10'
                                                    : 'bg-main text-white hover:bg-main-hover'
                                                    }`}
                                            >
                                                {usr.isFollowing ? 'Following' : 'Follow'}
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                                    Not following anyone yet
                                </div>
                            )
                        )
                    )}
                </div>
            </div>

        </div>
    );
};

export default Follow;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import { getMyConnections, getUserConnections, removeFollower, unfollowUser } from '../../api/follow';
import ListSkeleton from '../Skeleton/ListSkeleton';
import { useToast } from '../../context/ToastContext';

const ConnectionsPopup = ({ isOpen, onClose, initialTab = 'followers', userId = null, onCountChange }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [connections, setConnections] = useState({ followers: [], followings: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [unfollowingId, setUnfollowingId] = useState(null);
    const { showToast, showConfirm } = useToast();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            setActiveTab(initialTab);
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
            fetchConnections();
        } else {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, initialTab, onClose]);

    const fetchConnections = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = userId
                ? await getUserConnections(userId)
                : await getMyConnections();

            if (response && response.success) {
                setConnections(response.data);
            } else {
                setError('Failed to load connections');
            }
        } catch (err) {
            console.error('Error fetching connections:', err);
            if (err.statusCode === 403) {
                setError(err.message || "You cannot view this user's connections because you are not following them.");
            } else {
                setError(err.message || 'An error occurred while fetching connections');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleRemoveFollower = (followerId) => {
        showConfirm(
            'Remove Follower',
            'Are you sure you want to remove this user from your followers?',
            async () => {
                setRemovingId(followerId);
                try {
                    const response = await removeFollower(followerId);
                    if (response && response.success) {
                        setConnections(prev => {
                            const newFollowers = prev.followers.filter(f => f.id !== followerId);
                            if (onCountChange) {
                                onCountChange({
                                    followersCount: newFollowers.length,
                                    followingCount: prev.followings.length
                                });
                            }
                            return {
                                ...prev,
                                followers: newFollowers
                            };
                        });
                        showToast('Follower removed successfully');
                    } else {
                        showToast(response.message || 'Failed to remove follower', 'error');
                    }
                } catch (err) {
                    console.error('Error removing follower:', err);
                    showToast(err.message || 'An error occurred while removing follower', 'error');
                } finally {
                    setRemovingId(null);
                }
            }
        );
    };

    const handleUnfollowUser = (followingId) => {
        showConfirm(
            'Unfollow User',
            'Are you sure you want to unfollow this user?',
            async () => {
                setUnfollowingId(followingId);
                try {
                    const response = await unfollowUser(followingId);
                    if (response && response.success) {
                        setConnections(prev => {
                            const newFollowings = prev.followings.filter(f => f.id !== followingId);
                            if (onCountChange) {
                                onCountChange({
                                    followersCount: prev.followers.length,
                                    followingCount: newFollowings.length
                                });
                            }
                            return {
                                ...prev,
                                followings: newFollowings
                            };
                        });
                        showToast('Unfollowed successfully');
                    } else {
                        showToast(response.message || 'Failed to unfollow', 'error');
                    }
                } catch (err) {
                    console.error('Error unfollowing:', err);
                    showToast(err.message || 'An error occurred while unfollowing', 'error');
                } finally {
                    setUnfollowingId(null);
                }
            }
        );
    };

    if (!isOpen) return null;

    const displayList = activeTab === 'followers' ? connections.followers : connections.followings;

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-fade-in-up flex flex-col h-[85vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Connections</h3>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-50 px-6">
                    <button
                        className={`flex-1 py-4 font-bold text-[15px] transition-all relative ${activeTab === 'followers'
                            ? 'text-main after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-main after:rounded-t-full'
                            : 'text-gray-400 hover:text-main'
                            }`}
                        onClick={() => setActiveTab('followers')}
                    >
                        Followers ({connections.followers?.length || 0})
                    </button>
                    <button
                        className={`flex-1 py-4 font-bold text-[15px] transition-all relative ${activeTab === 'following'
                            ? 'text-main after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-main after:rounded-t-full'
                            : 'text-gray-400 hover:text-main'
                            }`}
                        onClick={() => setActiveTab('following')}
                    >
                        Following ({connections.followings?.length || 0})
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto grow p-6 custom-scrollbar">
                    {loading ? (
                        <ListSkeleton count={6} />
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-10">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <i className="ri-error-warning-line text-3xl text-red-500"></i>
                            </div>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">Access Restricted</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{error}</p>
                        </div>
                    ) : displayList && displayList.length > 0 ? (
                        <div className="space-y-6">
                            {displayList.map((conn) => (
                                <div key={conn.id} className="flex items-center justify-between group">
                                    <div className="flex items-center">
                                        <div className="shrink-0">
                                            <img
                                                src={conn.profileImageUrl ? `${IMAGE_BASE_URL}/${conn.profileImageUrl}` : USER_AVATAR}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:ring-2 group-hover:ring-main/20 transition-all"
                                                alt={conn.userName}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-[15px] font-bold text-gray-800 hover:text-main transition-colors leading-tight">
                                                {conn.userName}
                                            </h4>
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                                @{conn.userName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            to={`/profile/${conn.id}`}
                                            onClick={onClose}
                                            className="px-4 py-1.5 text-xs font-bold text-main bg-blue-50 rounded-xl hover:bg-main hover:text-white transition-all shadow-sm shadow-blue-100/50"
                                        >
                                            View Profile
                                        </Link>
                                        {!userId && activeTab === 'followers' && (
                                            <button
                                                onClick={() => handleRemoveFollower(conn.id)}
                                                disabled={removingId === conn.id}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${removingId === conn.id
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white shadow-red-100/50'
                                                    }`}
                                            >
                                                {removingId === conn.id ? 'Removing...' : 'Remove'}
                                            </button>
                                        )}
                                        {!userId && activeTab === 'following' && (
                                            <button
                                                onClick={() => handleUnfollowUser(conn.id)}
                                                disabled={unfollowingId === conn.id}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${unfollowingId === conn.id
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'text-main bg-blue-50 hover:bg-main hover:text-white shadow-blue-100/50'
                                                    }`}
                                            >
                                                {unfollowingId === conn.id ? 'Unfollowing...' : 'Unfollow'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                            <i className="ri-team-line text-6xl mb-4"></i>
                            <p className="text-gray-500 font-medium italic">No connections to show yet</p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default ConnectionsPopup;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSuggestedPeople } from '../../api/profile';
import { followUser } from '../../api/follow';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import UserSkeleton from '../Skeleton/UserSkeleton';

const SuggestedUsersWidget = ({ maxItems = 5 }) => {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState(new Set());

    const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
            const response = await getSuggestedPeople();
            if (response && response.success) {
                setSuggestedUsers(response.data);
            }
        } catch (err) {
            console.error('Error fetching suggested people:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleFollow = async (userId) => {
        if (followingIds.has(userId)) return;

        setFollowingIds(prev => new Set(prev).add(userId));
        try {
            const response = await followUser(userId);
            if (response && response.success) {
                setSuggestedUsers(prev => prev.filter(user => user.id !== userId));
            }
        } catch (err) {
            console.error('Error following user:', err);
        } finally {
            setFollowingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                <h3 className="text-lg font-bold text-gray-800 m-0">Suggestions </h3>
                <button
                    onClick={fetchSuggestions}
                    disabled={isLoading}
                    className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-main hover:border-main transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <i className={`group-hover:rotate-180 transition-transform duration-500 ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>
            <div className="space-y-5">
                {isLoading ? (
                    <UserSkeleton count={3} />
                ) : suggestedUsers.length > 0 ? (
                    suggestedUsers.slice(0, maxItems).map((user) => (
                        <div key={user.id} className="flex items-center justify-between group">
                            <div className="flex items-center">
                                <Link to={`/profile/${user.id}`} className="relative shrink-0">
                                    <img
                                        src={user.profileImageUrl ? `${IMAGE_BASE_URL}/${user.profileImageUrl}` : USER_AVATAR}
                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-50 group-hover:ring-blue-100 transition-all"
                                        alt={user.userName}
                                    />
                                </Link>
                                <div className="ml-3">
                                    <Link to={`/profile/${user.id}`} className="block text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors leading-tight">{user.userName}</Link>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-tighter">Suggested for you</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleFollow(user.id)}
                                disabled={followingIds.has(user.id)}
                                className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                            >
                                {followingIds.has(user.id) ? (
                                    <i className="ri-loader-4-line animate-spin"></i>
                                ) : 'Add'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-40 py-4 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <i className="ri-user-2-line text-2xl"></i>
                        </div>
                        <p className="text-xs font-medium italic">No suggestions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggestedUsersWidget;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import { getSuggestedPeople } from '../../api/profile';
import { followUser } from '../../api/follow';
import UserSkeleton from '../Skeleton/UserSkeleton';

const PeopleMightKnow = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followingIds, setFollowingIds] = useState(new Set());

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await getSuggestedPeople();
            if (response && response.success) {
                setSuggestions(response.data);
            }
        } catch (error) {
            console.error('Error fetching suggested people:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        if (followingIds.has(userId)) return;

        setFollowingIds(prev => new Set(prev).add(userId));
        try {
            const response = await followUser(userId);
            if (response && response.success) {
                // Remove the user from suggestions list after successful follow
                setSuggestions(prev => prev.filter(user => user.id !== userId));
            }
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setFollowingIds(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:h-[805px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Suggestions {suggestions.length > 0 ? `(${suggestions.length})` : ''}</h3>
                <button
                    onClick={fetchSuggestions}
                    disabled={loading}
                    className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-main hover:border-main transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                    <i className={`group-hover:rotate-180 transition-transform duration-500 ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1">
                {loading ? (
                    <UserSkeleton count={4} />
                ) : suggestions.length > 0 ? (
                    suggestions.map((person) => (
                        <div key={person.id} className="p-4 flex items-center hover:bg-gray-50/50 transition-colors group">
                            <div className="shrink-0">
                                <Link to={`/profile/${person.id}`}>
                                    <img
                                        src={person.profileImageUrl ? `${IMAGE_BASE_URL}/${person.profileImageUrl}` : USER_AVATAR}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        alt={person.userName}
                                    />
                                </Link>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <h4 className="text-[14px] font-bold text-gray-800 hover:text-main transition-colors truncate">
                                    <Link to={`/profile/${person.id}`}>{person.userName}</Link>
                                </h4>
                                <p className="text-[12px] text-gray-400 truncate">Suggested for you</p>
                            </div>
                            <button
                                onClick={() => handleFollow(person.id)}
                                disabled={followingIds.has(person.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-main hover:bg-main hover:text-white transition-all disabled:opacity-50"
                            >
                                <i className={followingIds.has(person.id) ? "ri-loader-4-line animate-spin" : "ri-user-add-line"}></i>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 p-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <i className="ri-user-2-line text-3xl"></i>
                        </div>
                        <p className="text-sm font-medium italic">No suggestions available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PeopleMightKnow;

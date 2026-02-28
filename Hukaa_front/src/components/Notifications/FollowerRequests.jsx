import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import { getPendingFollowRequests, acceptFollowRequest, rejectFollowRequest } from '../../api/follow';
import { useToast } from '../../context/ToastContext';
import ListSkeleton from '../Skeleton/ListSkeleton';

const FollowerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const { showToast } = useToast();

    const fetchRequests = useCallback(async (isRefresh = false) => {
        setLoading(true);
        try {
            const response = await getPendingFollowRequests();
            if (response && response.success) {
                setRequests(response.data || []);
                if (isRefresh) showToast('Requests updated');
            } else {
                showToast(response.message || 'Failed to fetch requests', 'error');
            }
        } catch (err) {
            console.error('Error fetching requests:', err);
            showToast('Failed to load follower requests', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAccept = async (requesterId) => {
        setActionLoadingId(requesterId);
        try {
            const response = await acceptFollowRequest(requesterId);
            if (response && response.success) {
                setRequests(prev => prev.filter(req => req.id !== requesterId));
                showToast('Follow request accepted');
            } else {
                showToast(response.message || 'Failed to accept request', 'error');
            }
        } catch (err) {
            console.error('Error accepting request:', err);
            showToast('Error accepting request', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (requesterId) => {
        setActionLoadingId(requesterId);
        try {
            const response = await rejectFollowRequest(requesterId);
            if (response && response.success) {
                setRequests(prev => prev.filter(req => req.id !== requesterId));
                showToast('Follow request rejected');
            } else {
                showToast(response.message || 'Failed to reject request', 'error');
            }
        } catch (err) {
            console.error('Error rejecting request:', err);
            showToast('Error rejecting request', 'error');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:h-[805px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Follower Requests {requests.length > 0 ? `(${requests.length})` : ''}</h3>
                <button
                    onClick={() => fetchRequests(true)}
                    disabled={loading}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-main hover:border-main transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    title="Refresh requests"
                >
                    <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>

            <div className="divide-y divide-gray-50 overflow-y-auto custom-scrollbar flex-1">
                {loading && requests.length === 0 ? (
                    <ListSkeleton count={4} />
                ) : requests.length > 0 ? (
                    requests.map((req) => (
                        <div key={req.id} className="p-4 flex flex-col hover:bg-gray-50/50 transition-colors group">
                            <div className="flex items-center mb-3">
                                <div className="shrink-0">
                                    <Link to={`/profile/${req.id}`}>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                            <img
                                                src={req.profileImageUrl ? `${IMAGE_BASE_URL}/${req.profileImageUrl}` : USER_AVATAR}
                                                className="w-full h-full object-cover"
                                                alt={req.userName}
                                            />
                                        </div>
                                    </Link>
                                </div>
                                <div className="ml-3 flex-1">
                                    <h4 className="text-[14px] font-bold text-gray-800 hover:text-main transition-colors leading-tight">
                                        <Link to={`/profile/${req.id}`}>{req.userName}</Link>
                                    </h4>
                                    <p className="text-[12px] text-gray-500 mt-0.5">wants to follow you</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAccept(req.id)}
                                    disabled={actionLoadingId === req.id}
                                    className="flex-1 py-2 px-3 bg-main text-white text-[12px] font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 disabled:opacity-50"
                                >
                                    {actionLoadingId === req.id ? '...' : 'Confirm'}
                                </button>
                                <button
                                    onClick={() => handleReject(req.id)}
                                    disabled={actionLoadingId === req.id}
                                    className="flex-1 py-2 px-3 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white text-[12px] font-bold rounded-xl  transition-all disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 p-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <i className="ri-user-add-line text-3xl"></i>
                        </div>
                        <p className="text-sm font-medium italic">No pending requests</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowerRequests;

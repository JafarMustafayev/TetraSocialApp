import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import ListSkeleton from '../Skeleton/ListSkeleton';
import { useNotifications } from '../../context/NotificationContext';

const FollowerRequests = () => {
    const {
        followRequests: requests,
        loadingRequests: loading,
        fetchFollowRequests: fetchRequests,
        acceptRequest,
        rejectRequest
    } = useNotifications();

    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAccept = async (requesterId) => {
        setActionLoadingId(requesterId);
        await acceptRequest(requesterId);
        setActionLoadingId(null);
    };

    const handleReject = async (requesterId) => {
        setActionLoadingId(requesterId);
        await rejectRequest(requesterId);
        setActionLoadingId(null);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:h-[805px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Follower Requests {requests.length > 0 ? `(${requests.length})` : ''}</h3>
                <button
                    onClick={() => fetchRequests()}
                    disabled={loading}
                    className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-main hover:border-main transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    title="Refresh requests"
                >
                    <i className={`group-hover:rotate-180 transition-transform duration-500 ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
                </button>
            </div>

            <div className=" overflow-y-auto custom-scrollbar flex-1">
                {loading && requests.length === 0 ? (
                    <ListSkeleton count={4} />
                ) : requests.length > 0 ? (
                    <>
                        {requests.map((req) => (
                            <div key={req.id} className="p-4 flex flex-col hover:bg-gray-100 transition-colors group">
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
                                        {actionLoadingId === req.id ? '...' : 'Accept'}
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        disabled={actionLoadingId === req.id}
                                        className="flex-1 py-2 px-3 text-red-500 bg-red-100 hover:bg-red-500 hover:text-white text-[12px] font-bold rounded-xl disabled:opacity-50 shadow-3xl shadow-red-600"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                        {loading && <ListSkeleton count={2} />}
                    </>
                ) : loading ? (
                    <ListSkeleton count={4} />
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

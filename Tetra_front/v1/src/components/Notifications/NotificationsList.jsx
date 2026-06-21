import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { USER_AVATAR, IMAGE_BASE_URL } from '../../api/client';
import moment from 'moment';
import NotificationSkeleton from '../Skeleton/NotificationSkeleton';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsList = () => {
    const {
        notifications,
        loadingNotifications: loading,
        hasMoreNotifications: hasMore,
        page,
        fetchNotifications,
        markAsRead: handleRead,
        markAllAsRead: handleClearAll,
        acceptRequest,
        rejectRequest
    } = useNotifications();

    const scrollContainerRef = useRef(null);
    const hasInitialLoadedRef = useRef(false);
    const loadMoreRef = useRef(null);

    useEffect(() => {
        if (!hasInitialLoadedRef.current) {
            fetchNotifications(1);
            hasInitialLoadedRef.current = true;
        }
    }, [fetchNotifications]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading) {
                    fetchNotifications(page + 1);
                }
            },
            { threshold: 0.1 }
        );

        const currentLoadMore = loadMoreRef.current;
        if (currentLoadMore) {
            observer.observe(currentLoadMore);
        }

        return () => {
            if (currentLoadMore) {
                observer.unobserve(currentLoadMore);
            }
        };
    }, [hasMore, loading]); // page removed from dependencies to stabilize the observer

    const handleRefresh = () => {
        fetchNotifications(1, true);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    };

    const renderNotificationContent = (notif) => {
        let payload = {};
        try {
            payload = JSON.parse(notif.payload);
        } catch {
            // Silently ignore parse errors in render
        }

        const type = notif.type;
        const userId = payload.ByUserId;
        const name = payload.ByUserName;
        const img = payload.ByUserProfileImageUrl;

        const userImg = img ? `${IMAGE_BASE_URL}/${img}` : USER_AVATAR;
        const time = moment(notif.createdAt).fromNow();

        return (
            <div key={notif.notificationId} className="p-4 flex flex-col hover:bg-gray-100 transition-colors group border-b border-gray-50 last:border-0">
                <div className="flex items-center">
                    <div className="shrink-0">
                        <Link to={`/profile/${userId}`}>
                            <img src={userImg} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="user"
                                onError={(e) => { e.target.src = USER_AVATAR; }} />
                        </Link>
                    </div>
                    <div className="ml-3 flex-1">

                        <div className="flex items-center">
                            <h4 className="text-[16px] font-bold text-gray-100  hover:text-main transition-colors leading-tight mr-1">
                                <Link to={`/profile/${userId}`}>{name}</Link>
                            </h4>
                            <p className="text-[16px] text-gray-500 mt-0.5">{notif.title}</p>
                        </div>

                        {type === 2 && payload.CommentBody && (
                            <p className="text-[12px] italic text-gray-400 mt-1 line-clamp-2">"{payload.CommentBody.substring(0, 50)} ..."</p>
                        )}

                    </div>
                    <div className="justify-end">
                        <span className="text-[10px] font-bold text-main uppercase mt-1 block mb-2">{time}</span>
                        <button
                            onClick={() => handleRead(notif.notificationId)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 ml-10"
                            title="Mark as read"
                        >
                            <i className="ri-close-line text-xs font-bold"></i>
                        </button>
                    </div>
                </div>

                <div className="ml-[52px] mt-3  flex justify-center gap-3">
                    {(type === 1 || type === 2) && payload.PostId && (
                        <Link
                            to={`/posts/${payload.PostId}`}
                            className="flex-1 w-full text-center text-[11px] font-bold text-main hover:bg-main hover:text-white px-4 py-2 rounded-xl border border-main transition-all "
                        >
                            View Post
                        </Link>
                    )}

                    {(type === 3 || type === 5) && (
                        <Link
                            to={`/profile/${userId}`}
                            className="flex-1 w-full text-center text-[11px] font-bold text-main hover:bg-main hover:text-white px-4 py-2 rounded-xl border border-main transition-all"
                        >
                            View Profile
                        </Link>
                    )}

                    {type === 4 && (
                        <>
                            <button
                                onClick={() => acceptRequest(userId, notif.notificationId)}
                                className="flex-1 py-2 px-3 bg-main text-white text-[12px] font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-100 disabled:opacity-50"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => rejectRequest(userId, notif.notificationId)}
                                className="flex-1 py-2 px-3 text-red-500 bg-red-100 hover:bg-red-500 hover:text-white text-[12px] font-bold rounded-xl disabled:opacity-50 shadow-3xl shadow-red-600"
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:h-[805px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-lg font-bold text-gray-800 m-0">Notifications {notifications.length > 0 ? `(${notifications.length})` : ''}</h3>
                <div className="flex gap-2">
                    <button
                        className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-main hover:border-main transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        title="Refresh"
                    >
                        <i className={`group-hover:rotate-180 transition-transform duration-500 ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
                    </button>
                    <button
                        className="group w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-red-300 hover:text-red-600 hover:border-red-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                        type="button"
                        onClick={handleClearAll}
                        title="Clear all"
                    >
                        <i className="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className=" overflow-y-auto custom-scrollbar flex-1"
            >
                {notifications.length === 0 && loading ? (
                    Array(2).fill(0).map((_, i) => <NotificationSkeleton key={i} />)
                ) : notifications.length > 0 ? (
                    <>
                        {notifications.map(renderNotificationContent)}
                        <div ref={loadMoreRef} className="h-1" />
                        {loading && (
                            <div className="flex flex-col">
                                {Array(2).fill(0).map((_, i) => <NotificationSkeleton key={`more-${i}`} />)}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 p-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <i className="ri-notification-off-line text-3xl"></i>
                        </div>
                        <p className="text-sm font-medium italic">No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsList;

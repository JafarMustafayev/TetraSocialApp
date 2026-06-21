// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    UserPlus,
    Heart,
    MessageSquare,
    AtSign,
    Bell,
    Check,
    ArrowLeft
} from 'lucide-react';
import Tabs from '../components/ui/Tabs.jsx';
import Skeleton from '../components/skeletons/Skeleton.jsx';
import { getNotifications, markAllAsRead, markAsRead } from '../api/notification.api.js';
import { getTimeAgo, formatUtcToLocal } from '../utils/dateFormatter';

const Notifications = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Read the "type" parameter from URL, default to "all"
    const activeTab = searchParams.get('tab') || 'all';

    // Cache state to store data per tab, preventing repeated fetch calls
    const [cache, setCache] = useState({
        all: null,
        mentions: null,
        comments: null,
        like: null,
        follow: null,
        system: null
    });

    // Loading state per tab
    const [loadingMap, setLoadingMap] = useState({
        all: false,
        mentions: false,
        comments: false,
        like: false,
        follow: false,
        system: false
    });

    const notificationTabs = [
        { id: 'all', label: 'All' },
        { id: 'mentions', label: 'Mentions' },
        { id: 'comments', label: 'Comments' },
        { id: 'like', label: 'Likes' },
        { id: 'follow', label: 'Follows' },
        { id: 'system', label: 'System' }
    ];

    // Set page title
    useEffect(() => {
        document.title = "Notifications";
    }, []);

    // Fetch notifications when tab changes only if not already cached
    useEffect(() => {
        if (cache[activeTab] !== null) return;

        const fetchNotifications = async () => {
            setLoadingMap(prev => ({ ...prev, [activeTab]: true }));
            try {
                const res = await getNotifications(activeTab);
                if (res.Success) {
                    setCache(prev => ({ ...prev, [activeTab]: res.Data }));
                } else {
                    toast.error(res.Message || 'Failed to load notifications.');
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred while loading notifications.');
            } finally {
                setLoadingMap(prev => ({ ...prev, [activeTab]: false }));
            }
        };

        fetchNotifications();
    }, [activeTab]);

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    const handleMarkAllAsRead = async () => {
        try {
            const res = await markAllAsRead();
            if (res.Success) {
                // Update all keys in the cache to mark read: true
                setCache(prev => {
                    const updated = {};
                    for (const key in prev) {
                        if (prev[key]) {
                            updated[key] = prev[key].map(n => ({ ...n, read: true }));
                        } else {
                            updated[key] = null;
                        }
                    }
                    return updated;
                });
                toast.success('All notifications marked as read.');
            } else {
                toast.error(res.Message || 'Action failed.');
            }
        } catch (err) {
            toast.error('An error occurred.');
        }
    };

    const handleNotificationClick = async (n, customPath = null) => {
        // Optimistically update read status locally across all tabs if unread
        if (!n.read) {
            setCache(prev => {
                const updated = {};
                for (const key in prev) {
                    if (prev[key]) {
                        updated[key] = prev[key].map(item => item.id === n.id ? { ...item, read: true } : item);
                    } else {
                        updated[key] = null;
                    }
                }
                return updated;
            });

            try {
                await markAsRead(n.id);
            } catch (err) {
                console.error('Failed to mark notification as read on server:', err);
            }
        }

        // Navigate based on tab or custom path
        if (customPath) {
            navigate(customPath);
        } else if (n.type === 'follow' && n.actor?.username) {
            navigate(`/${n.actor.username}`);
        } else if ((n.type === 'like' || n.type === 'comment' || n.type === 'mention') && n.post?.id) {
            navigate(`/post/${n.post.id}`);
        }
    };

    const handleMarkAsReadClick = async (n) => {
        // Optimistically update read status locally across all tabs
        setCache(prev => {
            const updated = {};
            for (const key in prev) {
                if (prev[key]) {
                    updated[key] = prev[key].map(item => item.id === n.id ? { ...item, read: true } : item);
                } else {
                    updated[key] = null;
                }
            }
            return updated;
        });

        try {
            await markAsRead(n.id);
        } catch (err) {
            console.error('Failed to mark notification as read on server:', err);
        }
    };

    // Render type-specific icon
    const renderNotificationIcon = (type) => {
        switch (type) {
            case 'follow':
                return <UserPlus size={18} className="text-blue-500" />;
            case 'like':
                return <Heart size={18} className="text-red-500 fill-red-500" />;
            case 'comment':
                return <MessageSquare size={18} className="text-emerald-500" />;
            case 'mention':
                return <AtSign size={18} className="text-main" />;
            case 'system':
            default:
                return <Bell size={18} className="text-amber-500" />;
        }
    };

    // Render type-specific text
    const renderNotificationText = (notification) => {
        const actorName = (
            <span
                onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationClick(notification, `/${notification.actor?.username}`);
                }}
                className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer"
            >
                {notification.actor?.name}
            </span>
        );

        switch (notification.type) {
            case 'follow':
                return <span className="text-gray-600 dark:text-gray-300">{actorName} started following you</span>;
            case 'like':
                return <span className="text-gray-600 dark:text-gray-300">{actorName} liked your post</span>;
            case 'comment':
                return <span className="text-gray-600 dark:text-gray-300">{actorName} commented on your post</span>;
            case 'mention':
                return <span className="text-gray-600 dark:text-gray-300">{actorName} mentioned you in a post</span>;
            case 'system':
            default:
                return <span className="text-gray-600 dark:text-gray-300 font-medium">{notification.text}</span>;
        }
    };

    const activeList = cache[activeTab] || [];
    const isLoading = loadingMap[activeTab];

    return (
        <div className="flex justify-center w-full bg-white dark:bg-[#09090b] transition-colors duration-300">
            <div className="w-full border-x border-gray-100 dark:border-neutral-900 min-h-screen pb-10">

                {/* Sticky Header with Back button and Actions */}
                <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md flex flex-col border-b border-gray-100 dark:border-[#1f1f1f]">
                    <div className="flex items-center justify-between px-4 h-[53px]">
                        <div className="flex items-center gap-4">

                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        </div>
                        {activeList.some(n => !n.read) && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-1 text-[13px] text-main hover:underline font-bold transition-all cursor-pointer"
                                title="Mark all as read"
                            >
                                <Check size={14} />
                                <span>Mark all read</span>
                            </button>
                        )}
                    </div>
                    <Tabs tabs={notificationTabs} activeTab={activeTab} onChange={handleTabChange} />
                </div>

                {/* Notifications List */}
                <div className="w-full divide-y divide-gray-100 dark:divide-[#1f1f1f]">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 flex gap-4">
                                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3 rounded" />
                                    <Skeleton className="h-3 w-2/3 rounded" />
                                </div>
                            </div>
                        ))
                    ) : activeList.length > 0 ? (
                        activeList.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleNotificationClick(n)}
                                className={`p-4 flex gap-4 transition-all duration-200 ${!n.read
                                    ? 'bg-main/8 dark:bg-main/8 cursor-pointer'
                                    : 'hover:bg-gray-50/50 dark:hover:bg-[#16181c]/30'
                                    }`}
                            >
                                {/* Notification Indicator Icon */}
                                <div className="shrink-0 pt-0.5">
                                    {renderNotificationIcon(n.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 text-[14px]">
                                        <div className="min-w-0 text-left">
                                            {renderNotificationText(n)}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <time
                                                className="text-[12px] text-gray-500"
                                                dateTime={n.createdAt}
                                                title={n.createdAt ? formatUtcToLocal(n.createdAt) : ''}
                                            >
                                                {getTimeAgo(n.createdAt)}
                                            </time>
                                            {!n.read && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsReadClick(n);
                                                    }}
                                                    className="w-5 h-5 rounded-full flex items-center justify-center bg-main/10 hover:bg-main/20 text-main transition-colors shrink-0 cursor-pointer"
                                                    title="Mark as read"
                                                >
                                                    <Check size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Snippet displays */}
                                    {n.comment?.content && (
                                        <div className="mt-2 text-[14px] text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-2.5 rounded-xl break-words text-left">
                                            {n.comment.content}
                                        </div>
                                    )}

                                    {n.post?.content && !n.comment?.content && (
                                        <div className="mt-2 text-[13px] text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-zinc-900/40 p-2.5 rounded-xl border border-gray-100/80 dark:border-zinc-800/80 truncate text-left">
                                            {n.post.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-500 dark:text-gray-400 font-bold">
                            No notifications yet
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Notifications;

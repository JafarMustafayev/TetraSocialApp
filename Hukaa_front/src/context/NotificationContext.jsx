import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import signalRService from '../api/signalr';
import { useToast } from './ToastContext';
import { getNotifications, readAllNotifications, readNotification } from '../api/notification';
import { getPendingFollowRequests, acceptFollowRequest, rejectFollowRequest } from '../api/follow';
import { useAuth } from './AuthContext';
import { SIGNALR_HUB_URL, IMAGE_BASE_URL } from '../api/client';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const { showToast } = useToast();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [followRequests, setFollowRequests] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
    const [page, setPage] = useState(1);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const isFetchingNotifs = useRef(false);
    const isFetchingRequests = useRef(false);

    const fetchNotifications = useCallback(async (pageNum = 1, isRefresh = false) => {
        if (isFetchingNotifs.current) return;
        isFetchingNotifs.current = true;
        setLoadingNotifications(true);
        try {
            const response = await getNotifications(pageNum);
            if (response && response.success) {
                const newNotifications = response.data || [];
                if (isRefresh || pageNum === 1) {
                    setNotifications(newNotifications);
                } else {
                    setNotifications(prev => [...prev, ...newNotifications]);
                }
                setHasMoreNotifications(newNotifications.length >= 10);
                setPage(pageNum);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoadingNotifications(false);
            isFetchingNotifs.current = false;
        }
    }, []);

    const fetchFollowRequests = useCallback(async () => {
        if (isFetchingRequests.current) return;
        isFetchingRequests.current = true;
        setLoadingRequests(true);
        try {
            const response = await getPendingFollowRequests();
            if (response && response.success) {
                // Normalize follow requests data to ensure consistent structure
                const normalized = (response.data || []).map(req => ({
                    id: req.id || req.userId || req.requesterId, // Ensure id is present
                    userName: req.userName || req.requesterUserName,
                    profileImageUrl: req.profileImageUrl || req.requesterProfileImageUrl,
                    // Add any other relevant fields from the request object
                    // e.g., timestamp, message, etc.
                }));
                setFollowRequests(normalized);
            }
        } catch (err) {
            console.error('Failed to fetch follow requests:', err);
        } finally {
            setLoadingRequests(false);
            isFetchingRequests.current = false;
        }
    }, []);

    const markAsRead = async (id) => {
        try {
            const response = await readNotification(id);
            if (response && response.success) {
                setNotifications(prev => prev.filter(n => n.notificationId !== id));
            }
        } catch (err) {
            showToast('Failed to mark as read', 'error');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await readAllNotifications();
            if (response && response.success) {
                setNotifications([]);
                setHasMoreNotifications(false);
            }
        } catch (err) {
            showToast('Failed to clear notifications', 'error');
        }
    };

    const acceptRequest = async (userId, notificationId) => {
        try {
            const response = await acceptFollowRequest(userId);
            if (response && response.success) {
                showToast('Follow request accepted', 'success');
                window.dispatchEvent(new CustomEvent('followActionTaken', { detail: { userId } }));
            } else {
                showToast(response?.message || 'Failed to accept request', 'error');
            }
        } catch (err) {
            showToast('Failed to accept request', 'error');
        } finally {
            // Remove from lists regardless of outcome as requested
            setFollowRequests(prev => prev.filter(req => req.id !== userId));
            if (notificationId) {
                setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
            }
        }
        return true;
    };

    const rejectRequest = async (userId, notificationId) => {
        try {
            const response = await rejectFollowRequest(userId);
            if (response && response.success) {
                showToast('Follow request rejected', 'success');
                window.dispatchEvent(new CustomEvent('followActionTaken', { detail: { userId } }));
            } else {
                showToast(response?.message || 'Failed to reject request', 'error');
            }
        } catch (err) {
            showToast('Failed to reject request', 'error');
        } finally {
            // Remove from lists regardless of outcome as requested
            setFollowRequests(prev => prev.filter(req => req.id !== userId));
            if (notificationId) {
                setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
            }
        }
        return true;
    };

    const normalizeNotification = useCallback((data) => {
        if (!data) return null;

        // 1. Normalize Header Fields (Case-Insensitive)
        const normalizedHead = {
            notificationId: data.notificationId || data.NotificationId,
            title: data.title || data.Title,
            type: data.type || data.Type,
            createdAt: data.createdAt || data.CreatedAt || new Date().toISOString(),
            isRead: data.isRead || data.IsRead || false
        };

        // 2. Extract and Parse Payload
        let rawPayload = data.payload || data.Payload;
        let payload = {};
        if (typeof rawPayload === 'string') {
            try { payload = JSON.parse(rawPayload); } catch { payload = {}; }
        } else if (typeof rawPayload === 'object' && rawPayload !== null) {
            payload = rawPayload;
        }

        // 3. Map Payload Fields to Unified UI Format
        const unified = {
            ByUserId: payload.ByUserId || payload.byUserId || payload.userId || payload.SenderId || payload.senderId || payload.reactedByUserId || payload.commentedByUserId || payload.followerId || payload.requesterId || payload.sharedByUserId,
            ByUserName: payload.ByUserName || payload.byUserName || payload.userName || payload.SenderUserName || payload.senderUserName || payload.reactedByUserName || payload.commentedByUserName || payload.followerUserName || payload.requesterUserName || payload.sharedByUserName,
            ByUserProfileImageUrl: payload.ByUserProfileImageUrl || payload.byUserProfileImageUrl || payload.profileImageUrl || payload.SenderProfileImageUrl || payload.senderProfileImageUrl || payload.reactedByUserProfileImageUrl || payload.commentedByUserProfileImageUrl || payload.followerUserProfileImageUrl || payload.requesterProfileImageUrl || payload.sharedByUserProfileImageUrl,
            PostId: payload.PostId || payload.postId,
            CommentId: payload.CommentId || payload.commentId,
            CommentBody: payload.CommentBody || payload.commentBody || payload.content
        };

        // 4. Combine and Re-stringify
        const finalPayload = { ...payload, ...unified };

        return {
            ...data, // Keep original fields
            ...normalizedHead, // Override with normalized camelCase headers
            payload: JSON.stringify(finalPayload) // Unified JSON payload
        };
    }, []);

    useEffect(() => {
        if (user) {
            const hubUrl = IMAGE_BASE_URL + SIGNALR_HUB_URL;
            signalRService.startConnection('notifications', hubUrl, (status) => {
                setConnectionStatus(status);
            });
        } else {
            signalRService.stopConnection('notifications');
            setConnectionStatus('Disconnected');
        }

        return () => {
            signalRService.stopConnection('notifications');
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotifications(1);
            fetchFollowRequests();
        } else {
            setNotifications([]);
            setFollowRequests([]);
        }
    }, [user, fetchNotifications, fetchFollowRequests]);

    useEffect(() => {
        const handleNotification = (data) => {
            const normalizedNotif = normalizeNotification(data);
            const isNotificationPage = window.location.pathname === '/notifications';

            setNotifications(prev => {
                if (prev.some(n => n.notificationId === normalizedNotif.notificationId)) return prev;
                return [normalizedNotif, ...prev];
            });

            if (normalizedNotif.type === 4 || normalizedNotif.type === 5 || normalizedNotif.type === "4" || normalizedNotif.type === "5") {
                const payload = JSON.parse(normalizedNotif.payload);
                // Dispatch event for UserProfile to refresh if viewing this user
                window.dispatchEvent(new CustomEvent('followStatusUpdate', {
                    detail: { userId: payload.ByUserId }
                }));

                if (normalizedNotif.type == 4) {
                    setFollowRequests(prev => {
                        if (prev.some(req => req.id === payload.ByUserId)) return prev;
                        return [{
                            id: payload.ByUserId,
                            userName: payload.ByUserName,
                            profileImageUrl: payload.ByUserProfileImageUrl
                        }, ...prev];
                    });
                }
            }

            if (!isNotificationPage) {
                showToast(data.title || 'New notification', 'info');
            }
        };

        signalRService.on('notifications', 'ReceiveNotification', handleNotification);
        return () => signalRService.off('notifications', 'ReceiveNotification', handleNotification);
    }, [showToast, normalizeNotification]);

    const value = {
        notifications,
        followRequests,
        loadingNotifications,
        loadingRequests,
        hasMoreNotifications,
        page,
        fetchNotifications,
        fetchFollowRequests,
        markAsRead,
        markAllAsRead,
        acceptRequest,
        rejectRequest,
        setNotifications,
        setFollowRequests
    };

    return (
        <NotificationContext.Provider value={value}>
            {connectionStatus !== 'Connected' && user && (
                <div className="fixed top-0 left-0 right-0 z-9999 bg-red-500/90 backdrop-blur-sm text-white text-center py-1.5 text-xs font-semibold shadow-lg transition-all duration-500 ease-in-out">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        {connectionStatus === 'Connecting' ? 'Reconnecting ...' : 'Offline - 10 seconds retry...'}
                    </div>
                </div>
            )}
            {children}
        </NotificationContext.Provider>
    );
};

// src/components/settings/forms/ActiveSessionsForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SettingsButton from '../SettingsButton';
import { formatUtcToLocal } from '../../../utils/dateFormatter';
import { getSessions, revokeSession, revokeOtherSessions } from '../../../api/auth.api';
import Skeleton from '../../ui/Skeleton';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActiveSessionsForm = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Modal states
    const [revokingSessionId, setRevokingSessionId] = useState(null);
    const [isRevokingOthersOpen, setIsRevokingOthersOpen] = useState(false);

    const fetchActiveSessions = useCallback(async () => {
        try {
            const res = await getSessions();
            if (res.Success || res.success) {
                setSessions(res.Data || res.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActiveSessions();
    }, [fetchActiveSessions]);

    const handleRevokeClick = (id) => {
        setRevokingSessionId(id);
    };

    const handleRevokeConfirm = async () => {
        if (!revokingSessionId) return;
        setActionLoading(true);
        try {
            const res = await revokeSession(revokingSessionId);
            if (res.Success || res.success) {
                toast.success(res.Message || res.message || "Session has been successfully revoked.");
                setSessions(prev => prev.filter(s => s.id !== revokingSessionId));
            } else {
                toast.error(res.Message || res.message || "Failed to revoke session.");
            }
        } catch (error) {
            console.error("Error revoking session:", error);
        } finally {
            setActionLoading(false);
            setRevokingSessionId(null);
        }
    };

    const handleRevokeOthersConfirm = async () => {
        setActionLoading(true);
        try {
            const res = await revokeOtherSessions();
            if (res.Success || res.success) {
                toast.success(res.Message || res.message || "All other sessions revoked.");
                setSessions(prev => prev.filter(s => s.isCurrent));
            } else {
                toast.error(res.Message || res.message || "Failed to revoke other sessions.");
            }
        } catch (error) {
            console.error("Error revoking other sessions:", error);
        } finally {
            setActionLoading(false);
            setIsRevokingOthersOpen(false);
        }
    };

    const getDeviceIcon = (deviceType) => {
        if (deviceType?.toLowerCase() === 'mobile') return 'ri-smartphone-line';
        if (deviceType?.toLowerCase() === 'tablet') return 'ri-tablet-line';
        return 'ri-computer-line'; // desktop
    };

    const formatDate = (dateString) => {
        return formatUtcToLocal(dateString);
    };

    const getSessionDeviceInfo = (deviceInfo) => {
        if (!deviceInfo) return { DeviceType: 'Unknown', OS: 'Unknown', Browser: 'Unknown' };
        if (typeof deviceInfo === 'object') {
            return {
                DeviceType: deviceInfo.DeviceType || deviceInfo.deviceType || 'Unknown',
                OS: deviceInfo.OS || deviceInfo.os || 'Unknown',
                Browser: deviceInfo.Browser || deviceInfo.browser || 'Unknown'
            };
        }
        try {
            const parsed = JSON.parse(deviceInfo);
            return {
                DeviceType: parsed.DeviceType || parsed.deviceType || 'Unknown',
                OS: parsed.OS || parsed.os || 'Unknown',
                Browser: parsed.Browser || parsed.browser || 'Unknown'
            };
        } catch (e) {
            return { DeviceType: 'Unknown', OS: 'Unknown', Browser: 'Unknown' };
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
                <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings/account')}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
                </div>

                <div className="p-4 md:p-6 max-w-[800px] space-y-4">
                    <div className="mb-6">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-gray-200 dark:border-[#1f1f1f] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between bg-gray-50/50 dark:bg-[#16181c]/50">
                            <div className="flex items-start gap-4 w-full">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                <div className="space-y-2 w-full max-w-[300px]">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-44" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center gap-4">
                <button
                    onClick={() => navigate('/settings/account')}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h2>
            </div>

            <div className="p-4 md:p-6 max-w-[800px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-1">Your Sessions</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Review and manage your active login sessions.
                        </p>
                    </div>
                    {sessions.length > 1 && (
                        <SettingsButton 
                            variant="danger" 
                            disabled={actionLoading}
                            onClick={() => setIsRevokingOthersOpen(true)}
                        >
                            Log out from all other devices
                        </SettingsButton>
                    )}
                </div>

                <div className="space-y-4">
                    {sessions.map(session => {
                        const info = getSessionDeviceInfo(session.deviceInfo);
                        return (
                            <div 
                                key={session.id} 
                                className={`border rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between transition-colors
                                    ${session.isCurrent 
                                        ? 'border-main bg-main/5 dark:bg-main/5' 
                                        : 'border-gray-200 dark:border-[#1f1f1f] bg-gray-50/50 dark:bg-[#16181c]/50'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-1 md:mt-0">
                                        <i className={`${getDeviceIcon(info.DeviceType)} text-xl`}></i>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {info.OS} &bull; {info.Browser}
                                            </h4>
                                            {session.isCurrent && (
                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full shrink-0">
                                                    Current session
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-0.5">
                                            <p><span className="font-medium">IP Address:</span> {session.createdByIp || session.createIp || 'Unknown'}</p>
                                            {(session.locationInfo || session.location) && (session.locationInfo !== "0" && session.location !== "0") && (
                                                <p><span className="font-medium">Location:</span> {session.locationInfo || session.location}</p>
                                            )}
                                            <p><span className="font-medium">Started:</span> {formatDate(session.createdAt)}</p>
                                            <p><span className="font-medium">Last Activity:</span> {formatDate(session.lastActivityAt)}</p>
                                            <p className="text-xs mt-2 truncate max-w-[280px] md:max-w-[400px] text-gray-400 dark:text-gray-500" title={session.userAgent}>
                                                {session.userAgent}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {!session.isCurrent && (
                                    <div className="flex justify-end mt-2 md:mt-0">
                                        <button
                                            onClick={() => handleRevokeClick(session.id)}
                                            disabled={actionLoading}
                                            className="text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                        >
                                            Revoke session
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {sessions.length === 0 && (
                        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-[#1f1f1f] rounded-xl">
                            <p className="text-gray-500 dark:text-gray-400">No active sessions found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={!!revokingSessionId}
                onClose={() => setRevokingSessionId(null)}
                onConfirm={handleRevokeConfirm}
                title="Revoke Session"
                message="Are you sure you want to log out from this session? Any unsaved changes in that session will be lost."
                isLoading={actionLoading}
            />

            <ConfirmationModal
                isOpen={isRevokingOthersOpen}
                onClose={() => setIsRevokingOthersOpen(false)}
                onConfirm={handleRevokeOthersConfirm}
                title="Log Out From All Other Devices"
                message="Are you sure you want to log out from all other devices? This will revoke all active sessions except your current session."
                isLoading={actionLoading}
            />
        </div>
    );
};

export default ActiveSessionsForm;

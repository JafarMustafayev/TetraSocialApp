// src/components/settings/forms/TwoFactorForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SettingsButton from '../SettingsButton';
import Skeleton from '../../ui/Skeleton';
import { getTwoFactorStatus } from '../../../api/auth.api';

const TwoFactorForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [twoFactorStatus, setTwoFactorStatus] = useState({
        isEnabled: false,
        provider: 'None',
        recoveryCodesCount: 0
    });

    const fetchStatus = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getTwoFactorStatus();
            const success = response.Success !== undefined ? response.Success : response.success;
            const message = response.Message !== undefined ? response.Message : response.message;
            const responseData = response.Data !== undefined ? response.Data : response.data;

            if (success) {
                const isEnabled = responseData ? (responseData.isEnabled !== undefined ? responseData.isEnabled : responseData.IsEnabled) : false;
                const details = responseData ? (responseData.details !== undefined ? responseData.details : responseData.Details) : null;
                const provider = details ? (details.provider !== undefined ? details.provider : details.Provider) : 'None';
                const recoveryCodesCount = details ? (details.recoveryCodesCount !== undefined ? details.recoveryCodesCount : details.RecoveryCodesCount) : 0;

                setTwoFactorStatus({
                    isEnabled,
                    provider,
                    recoveryCodesCount
                });
            } else {
                setError(message || 'Could not load two-factor authentication status.');
            }
        } catch (err) {
            console.error('Failed to fetch 2FA status:', err);
            setError('Could not load two-factor authentication status.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const formatProvider = (prov) => {
        if (!prov) return 'None';
        if (prov === 'AuthenticatorApp') return 'Authenticator app';
        return prov;
    };

    if (isLoading) {
        return (
            <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
                <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-factor authentication</h2>
                </div>
                <div className="p-4 md:p-6 max-w-[600px] space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-[#1f1f1f] mt-8">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-[36px] w-24 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
                <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-factor authentication</h2>
                </div>
                <div className="p-4 md:p-6 max-w-[600px] flex flex-col items-start gap-4">
                    <h3 className="font-bold text-[18px] text-gray-900 dark:text-white">Two-factor authentication</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3 w-full">
                        {error}
                    </p>
                    <SettingsButton variant="outline" onClick={fetchStatus}>
                        Try again
                    </SettingsButton>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-factor authentication</h2>
            </div>

            <div className="p-4 md:p-6 max-w-[600px] space-y-6">
                <div>
                    <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-2">Two-factor authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Add an extra layer of security to your account. When enabled, someone who knows your password still cannot sign in without a verification code from your authenticator app.
                    </p>
                </div>

                {twoFactorStatus.isEnabled ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 shrink-0">
                                On
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {twoFactorStatus.recoveryCodesCount} recovery codes remaining
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Provider: <span className="font-semibold text-gray-900 dark:text-white">{formatProvider(twoFactorStatus.provider)}</span>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <SettingsButton
                                variant="outline"
                                onClick={() => {
                                    // TODO: Implement regenerate recovery codes flow
                                    toast.success("Regenerating recovery codes setup flow is not implemented yet.");
                                }}
                            >
                                Regenerate recovery codes
                            </SettingsButton>
                            <SettingsButton
                                variant="danger"
                                className="!bg-red-600 hover:!bg-red-700 !text-white border-transparent"
                                onClick={() => {
                                    // TODO: Implement disable 2FA flow
                                    toast.success("Disabling 2FA is not implemented yet.");
                                }}
                            >
                                Disable
                            </SettingsButton>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-neutral-600"></span>
                            <span className="text-[15px] font-medium text-gray-500 dark:text-gray-400">Off</span>
                        </div>
                        <SettingsButton
                            variant="primary"
                            className="!bg-main hover:!bg-main-hover !text-white border-transparent"
                            onClick={() => {
                                // TODO: Implement 2FA setup flow
                                toast.success("2FA setup flow is not implemented yet.");
                            }}
                        >
                            Enable
                        </SettingsButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwoFactorForm;

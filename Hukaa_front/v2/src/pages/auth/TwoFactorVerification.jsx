// src/pages/auth/TwoFactorVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { verifyTwoFactorLogin, loginWithRecoveryCode } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

// Helper to normalize the backend response to support both camelCase and PascalCase
const normalizeLoginResponse = (res) => {
    if (!res) return null;
    const success = res.success ?? res.Success ?? false;
    const statusCode = res.statusCode ?? res.StatusCode;
    const message = res.message ?? res.Message;
    const data = res.data ?? res.Data;
    const errors = res.errors ?? res.Errors;

    return {
        success,
        statusCode,
        message,
        errors,
        data
    };
};

// Helper to safely extract nested tokens in camelCase or PascalCase
const extractTokens = (res) => {
    if (!res) return null;

    // Support root, result.data, result.data.tokens, or direct object
    const data = res.data ?? res.Data ?? res;
    const tokensObj = data.tokens ?? data.Tokens ?? data;

    const accessTokenObj = tokensObj.accessToken ?? tokensObj.AccessToken;
    const refreshTokenObj = tokensObj.refreshToken ?? tokensObj.RefreshToken;

    const accessToken = accessTokenObj?.accessToken ?? accessTokenObj?.AccessToken;
    const accessTokenExpiresAt = accessTokenObj?.accessTokenExpiresAt ?? accessTokenObj?.AccessTokenExpiresAt;

    const refreshToken = refreshTokenObj?.refreshToken ?? refreshTokenObj?.RefreshToken;
    const refreshTokenExpiresAt = refreshTokenObj?.refreshTokenExpiresAt ?? refreshTokenObj?.RefreshTokenExpiresAt;

    if (!accessToken || !refreshToken) {
        return null;
    }

    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt
    };
};

const TwoFactorVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchUser } = useAuth();

    const challenge = location.state?.challenge;

    const [twoFactorMode, setTwoFactorMode] = useState('authenticator'); // 'authenticator' or 'recovery'
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [twoFactorCodeError, setTwoFactorCodeError] = useState('');

    const [recoveryCode, setRecoveryCode] = useState('');
    const [recoveryCodeError, setRecoveryCodeError] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // If no challenge state exists, redirect to login
    useEffect(() => {
        if (!challenge) {
            toast.error('Session expired or invalid challenge. Please log in again.');
            navigate('/auth/login', { replace: true });
        }
    }, [challenge, navigate]);

    useEffect(() => {
        document.title = twoFactorMode === 'recovery' ? "Recovery Code Login" : "Two-Factor Verification";
    }, [twoFactorMode]);

    // Countdown timer for 2FA challenge expiration
    useEffect(() => {
        if (!challenge?.expiresAt) return;

        const calculateTimeLeft = () => {
            const difference = new Date(challenge.expiresAt).getTime() - new Date().getTime();
            return Math.max(0, Math.floor(difference / 1000));
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                toast.error('Two-factor authentication challenge has expired. Please log in again.');
                navigate('/auth/login', { replace: true });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [challenge, navigate]);

    const handleBackToLogin = () => {
        setTwoFactorCode('');
        setTwoFactorCodeError('');
        setRecoveryCode('');
        setRecoveryCodeError('');
        navigate('/auth/login');
    };

    const handleSwitchToRecovery = () => {
        setTwoFactorMode('recovery');
        setTwoFactorCodeError('');
    };

    const handleSwitchToAuthenticator = () => {
        setTwoFactorMode('authenticator');
        setRecoveryCodeError('');
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();

        // Check for challenge expiration before submitting
        const currentDiff = new Date(challenge.expiresAt).getTime() - new Date().getTime();
        if (currentDiff <= 0) {
            toast.error('Two-factor authentication challenge has expired. Please log in again.');
            setTwoFactorCode('');
            setTwoFactorCodeError('');
            setRecoveryCode('');
            setRecoveryCodeError('');
            navigate('/auth/login', { replace: true });
            return;
        }

        setIsLoading(true);
        if (twoFactorMode === 'authenticator') {
            if (!twoFactorCode.trim() || twoFactorCode.trim().length !== 6) {
                toast.error('Please enter a valid 6-digit verification code.');
                setIsLoading(false);
                return;
            }

            setTwoFactorCodeError('');
            try {
                const result = await verifyTwoFactorLogin(challenge.challengeId, twoFactorCode);
                const normalized = normalizeLoginResponse(result);

                if (!normalized || !normalized.success) {
                    const isExpired = normalized?.statusCode === 404 || normalized?.message?.toLowerCase().includes('expired');
                    const isInvalid = normalized?.statusCode === 401 || normalized?.message?.toLowerCase().includes('invalid');

                    if (isExpired) {
                        toast.error('Two-factor authentication challenge has expired. Please log in again.');
                        setTwoFactorCode('');
                        setTwoFactorCodeError('');
                        navigate('/auth/login', { replace: true });
                    } else if (isInvalid) {
                        setTwoFactorCodeError('The verification code is invalid.');
                        toast.error('The verification code is invalid.');
                    } else {
                        const errorMsg = normalized?.message || 'Could not verify the code. Please try again.';
                        setTwoFactorCodeError(errorMsg);
                        toast.error(errorMsg);
                    }
                    return;
                }

                // Success flow
                const tokens = extractTokens(normalized.data ?? result);
                if (!tokens) {
                    toast.error('Login response is missing authentication tokens.');
                    return;
                }

                localStorage.setItem('token', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                await fetchUser();

                toast.success(normalized.message || 'Successfully logged in!');
                setTwoFactorCode('');
                setTwoFactorCodeError('');

                const queryParams = new URLSearchParams(location.search);
                const redirectPath = queryParams.get('redirect') || '/feed';

                navigate(redirectPath);
            } catch (error) {
                console.error('2FA Verification Error:', error);
                const genericError = 'Could not verify the code. Please try again.';
                setTwoFactorCodeError(genericError);
                toast.error(genericError);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Recovery code mode
            const trimmedRecoveryCode = recoveryCode.trim();
            if (!trimmedRecoveryCode) {
                toast.error('Please enter your recovery code.');
                setIsLoading(false);
                return;
            }

            setRecoveryCodeError('');
            try {
                const result = await loginWithRecoveryCode(challenge.challengeId, trimmedRecoveryCode);
                const normalized = normalizeLoginResponse(result);

                if (!normalized || !normalized.success) {
                    const isExpired = normalized?.message?.toLowerCase().includes('expired');
                    const isInvalid = normalized?.statusCode === 404 && (normalized?.message?.toLowerCase().includes('recovery code') || normalized?.message === 'No valid recovery code was found.');

                    if (isExpired) {
                        toast.error('Two-factor authentication challenge has expired. Please log in again.');
                        setRecoveryCode('');
                        setRecoveryCodeError('');
                        navigate('/auth/login', { replace: true });
                    } else if (isInvalid || normalized?.statusCode === 404 || normalized?.statusCode === 401) {
                        const errorMsg = normalized?.message || 'No valid recovery code was found.';
                        setRecoveryCodeError(errorMsg);
                        toast.error(errorMsg);
                    } else {
                        const errorMsg = normalized?.message || 'Could not verify the recovery code. Please try again.';
                        setRecoveryCodeError(errorMsg);
                        toast.error(errorMsg);
                    }
                    return;
                }

                // Success flow
                const tokens = extractTokens(normalized.data ?? result);
                if (!tokens) {
                    toast.error('Login response is missing authentication tokens.');
                    return;
                }

                localStorage.setItem('token', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                await fetchUser();

                toast.success(normalized.message || 'Successfully logged in!');
                setTwoFactorCode('');
                setTwoFactorCodeError('');
                setRecoveryCode('');
                setRecoveryCodeError('');

                const queryParams = new URLSearchParams(location.search);
                const redirectPath = queryParams.get('redirect') || '/feed';

                navigate(redirectPath);
            } catch (error) {
                console.error('Recovery Verification Error:', error);
                const genericError = 'Could not verify the recovery code. Please try again.';
                setRecoveryCodeError(genericError);
                toast.error(genericError);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // If challenge is missing, don't render content as the useEffect will redirect
    if (!challenge) return null;

    const title = twoFactorMode === 'recovery' ? 'Use a recovery code' : 'Two-factor authentication';
    const subtitle = twoFactorMode === 'recovery'
        ? 'Enter one of your saved recovery codes to complete login.'
        : 'Enter the 6-digit code from your authenticator app to complete login.';

    return (
        <AuthLayout>
            <AuthCard title={title} subtitle={subtitle}>
                <form onSubmit={handleVerifySubmit}>
                    {twoFactorMode === 'authenticator' ? (
                        <>
                            <AuthInput
                                label="Verification Code"
                                name="twoFactorCode"
                                value={twoFactorCode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setTwoFactorCode(val);
                                    if (twoFactorCodeError) setTwoFactorCodeError('');
                                }}
                                required
                                placeholder="6-digit code"
                                maxLength={6}
                                pattern="\d{6}"
                                inputMode="numeric"
                                error={twoFactorCodeError}
                            />

                            <div className="mb-6 -mt-2 text-right">
                                <button
                                    type="button"
                                    onClick={handleSwitchToRecovery}
                                    className="text-[14px] text-main hover:underline font-medium"
                                >
                                    Use a recovery code
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <AuthInput
                                label="Recovery Code"
                                name="recoveryCode"
                                value={recoveryCode}
                                onChange={(e) => {
                                    setRecoveryCode(e.target.value);
                                    if (recoveryCodeError) setRecoveryCodeError('');
                                }}
                                required
                                placeholder="e.g. 0610-47da-8f"
                                error={recoveryCodeError}
                            />

                            <div className="mb-6 -mt-2 text-right">
                                <button
                                    type="button"
                                    onClick={handleSwitchToAuthenticator}
                                    className="text-[14px] text-main hover:underline font-medium"
                                >
                                    Use authenticator code
                                </button>
                            </div>
                        </>
                    )}

                    {timeLeft > 0 && (
                        <div className="mb-6 text-center text-[14px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-zinc-900/50 py-2 px-3 rounded-lg border border-gray-100 dark:border-zinc-800">
                            <i className="ri-time-line text-main animate-pulse"></i>
                            <span>Code expires in:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatTimeLeft(timeLeft)}</span>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-1/3 h-[46px] rounded-full font-bold text-[15px] flex items-center justify-center transition-all bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            Back
                        </button>
                        <AuthButton
                            type="submit"
                            disabled={
                                (twoFactorMode === 'authenticator' && twoFactorCode.length !== 6) ||
                                (twoFactorMode === 'recovery' && !recoveryCode.trim()) ||
                                isLoading
                            }
                            className="w-2/3"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin"></div>
                                    <span>Verifying...</span>
                                </div>
                            ) : (
                                twoFactorMode === 'recovery' ? 'Continue' : 'Verify'
                            )}
                        </AuthButton>
                    </div>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

export default TwoFactorVerification;

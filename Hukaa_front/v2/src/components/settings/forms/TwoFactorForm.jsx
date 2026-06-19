// src/components/settings/forms/TwoFactorForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SettingsButton from '../SettingsButton';
import SettingsInput from '../SettingsInput';
import { TwoFactorSkeleton } from '../../skeletons/index.js';
import { getTwoFactorStatus, setupTwoFactor, enableTwoFactor, regenerateTwoFactorRecoveryCodes, disableTwoFactor } from '../../../api/auth.api';
import { QRCodeSVG } from 'qrcode.react';

const TwoFactorForm = ({ onBack }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [twoFactorStatus, setTwoFactorStatus] = useState({
        isEnabled: false,
        provider: 'None',
        recoveryCodesCount: 0
    });

    // Enable Setup Modal State
    const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
    const [setupStep, setSetupStep] = useState('password'); // 'password' | 'qr' | 'recoveryCodes'
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 2 setup data
    const [sharedKey, setSharedKey] = useState('');
    const [qrCodeUri, setQrCodeUri] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationCodeError, setVerificationCodeError] = useState('');

    // Step 3 recovery codes data
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    // Regenerate Recovery Codes Modal State
    const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
    const [regenerateStep, setRegenerateStep] = useState('password'); // 'password' | 'codes'
    const [regeneratePassword, setRegeneratePassword] = useState('');
    const [regeneratePasswordError, setRegeneratePasswordError] = useState('');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [regeneratedCodes, setRegeneratedCodes] = useState([]);

    // Disable Modal State
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [disablePassword, setDisablePassword] = useState('');
    const [disableCode, setDisableCode] = useState('');
    const [disablePasswordError, setDisablePasswordError] = useState('');
    const [disableCodeError, setDisableCodeError] = useState('');
    const [isDisabling, setIsDisabling] = useState(false);

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

    // Escape key listener to close modals
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isEnableModalOpen && setupStep !== 'recoveryCodes') {
                    resetSetupState();
                }
                if (isRegenerateModalOpen && regenerateStep !== 'codes') {
                    resetRegenerateState();
                }
                if (isDisableModalOpen) {
                    resetDisableState();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEnableModalOpen, setupStep, isRegenerateModalOpen, regenerateStep, isDisableModalOpen]);

    const resetSetupState = () => {
        setIsEnableModalOpen(false);
        setSetupStep('password');
        setPassword('');
        setPasswordError('');
        setIsSubmitting(false);
        setSharedKey('');
        setQrCodeUri('');
        setExpiresAt('');
        setVerificationCode('');
        setVerificationCodeError('');
        setRecoveryCodes([]);
    };

    const resetRegenerateState = () => {
        setIsRegenerateModalOpen(false);
        setRegenerateStep('password');
        setRegeneratePassword('');
        setRegeneratePasswordError('');
        setIsRegenerating(false);
        setRegeneratedCodes([]);
    };

    const resetDisableState = () => {
        setIsDisableModalOpen(false);
        setDisablePassword('');
        setDisableCode('');
        setDisablePasswordError('');
        setDisableCodeError('');
        setIsDisabling(false);
    };

    const handleEnableClick = () => {
        resetSetupState();
        setIsEnableModalOpen(true);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && setupStep !== 'recoveryCodes') {
            resetSetupState();
        }
    };

    const handleRegenerateOverlayClick = (e) => {
        if (e.target === e.currentTarget && regenerateStep !== 'codes') {
            resetRegenerateState();
        }
    };

    const handleDisableOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            resetDisableState();
        }
    };

    const handleConfirmPassword = async () => {
        if (password.length < 6) return;
        setIsSubmitting(true);
        setPasswordError('');
        try {
            const res = await setupTwoFactor(password);
            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const responseData = res.Data !== undefined ? res.Data : res.data;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;
            const errors = res.Errors !== undefined ? res.Errors : res.errors;

            if (success && responseData) {
                const sKey = responseData.sharedKey || responseData.SharedKey;
                const qUri = responseData.qrCodeUri || responseData.QrCodeUri;
                const expAt = responseData.expiresAt || responseData.ExpiresAt;

                setSharedKey(sKey);
                setQrCodeUri(qUri);
                setExpiresAt(expAt);
                setSetupStep('qr');
            } else {
                if (statusCode === 401) {
                    setPasswordError('Password is incorrect.');
                } else if (statusCode === 400) {
                    if (errors) {
                        if (typeof errors === 'object' && !Array.isArray(errors)) {
                            const passErrors = errors.Password || errors.password;
                            if (Array.isArray(passErrors) && passErrors.length > 0) {
                                setPasswordError(passErrors[0]);
                            } else if (typeof passErrors === 'string') {
                                setPasswordError(passErrors);
                            } else {
                                const firstErr = Object.values(errors)[0];
                                if (Array.isArray(firstErr) && firstErr.length > 0) {
                                    setPasswordError(firstErr[0]);
                                } else {
                                    setPasswordError(message || 'Validation failed.');
                                }
                            }
                        } else if (Array.isArray(errors) && errors.length > 0) {
                            setPasswordError(errors[0]);
                        } else {
                            setPasswordError(message || 'Validation failed.');
                        }
                    } else {
                        setPasswordError(message || 'Validation failed.');
                    }
                } else if (statusCode === 429) {
                    setPasswordError('Too many attempts. Please try again later.');
                } else {
                    setPasswordError(message || 'An error occurred during setup.');
                }
            }
        } catch (err) {
            console.error('2FA setup error:', err);
            setPasswordError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyAndEnable = async () => {
        const sanitizedCode = verificationCode.trim();
        if (sanitizedCode.length !== 6) return;

        setIsSubmitting(true);
        setVerificationCodeError('');
        try {
            const res = await enableTwoFactor(sanitizedCode);
            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const responseData = res.Data !== undefined ? res.Data : res.data;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;
            const errors = res.Errors !== undefined ? res.Errors : res.errors;

            if (success && responseData) {
                const codes = responseData.codes || responseData.Codes || [];
                setRecoveryCodes(codes);
                setSetupStep('recoveryCodes');
            } else {
                if (statusCode === 401) {
                    setVerificationCodeError('The verification code is invalid.');
                } else if (statusCode === 400) {
                    if (errors) {
                        if (typeof errors === 'object' && !Array.isArray(errors)) {
                            const codeErrors = errors.Code || errors.code || errors.Password || errors.password;
                            if (Array.isArray(codeErrors) && codeErrors.length > 0) {
                                setVerificationCodeError(codeErrors[0]);
                            } else if (typeof codeErrors === 'string') {
                                setVerificationCodeError(codeErrors);
                            } else {
                                const firstErr = Object.values(errors)[0];
                                if (Array.isArray(firstErr) && firstErr.length > 0) {
                                    setVerificationCodeError(firstErr[0]);
                                } else {
                                    setVerificationCodeError(message || 'Validation failed.');
                                }
                            }
                        } else if (Array.isArray(errors) && errors.length > 0) {
                            setVerificationCodeError(errors[0]);
                        } else {
                            setVerificationCodeError(message || 'Validation failed.');
                        }
                    } else {
                        setVerificationCodeError(message || 'Validation failed.');
                    }
                } else if (statusCode === 429) {
                    setVerificationCodeError('Too many attempts. Please try again later.');
                } else {
                    setVerificationCodeError(message || 'An error occurred during verification.');
                }
            }
        } catch (err) {
            console.error('2FA verification error:', err);
            setVerificationCodeError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmPasswordRegenerate = async () => {
        if (regeneratePassword.length < 6) return;
        setIsRegenerating(true);
        setRegeneratePasswordError('');
        try {
            const res = await regenerateTwoFactorRecoveryCodes(regeneratePassword);
            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const responseData = res.Data !== undefined ? res.Data : res.data;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;
            const errors = res.Errors !== undefined ? res.Errors : res.errors;

            if (success && responseData) {
                const codes = responseData.codes || responseData.Codes || [];
                setRegeneratedCodes(codes);
                setRegenerateStep('codes');
            } else {
                if (statusCode === 401) {
                    setRegeneratePasswordError('Password is incorrect.');
                } else if (statusCode === 400) {
                    if (errors) {
                        if (typeof errors === 'object' && !Array.isArray(errors)) {
                            const passErrors = errors.Password || errors.password;
                            if (Array.isArray(passErrors) && passErrors.length > 0) {
                                setRegeneratePasswordError(passErrors[0]);
                            } else if (typeof passErrors === 'string') {
                                setRegeneratePasswordError(passErrors);
                            } else {
                                const firstErr = Object.values(errors)[0];
                                if (Array.isArray(firstErr) && firstErr.length > 0) {
                                    setRegeneratePasswordError(firstErr[0]);
                                } else {
                                    setRegeneratePasswordError(message || 'Validation failed.');
                                }
                            }
                        } else if (Array.isArray(errors) && errors.length > 0) {
                            setRegeneratePasswordError(errors[0]);
                        } else {
                            setRegeneratePasswordError(message || 'Validation failed.');
                        }
                    } else {
                        setRegeneratePasswordError(message || 'Validation failed.');
                    }
                } else if (statusCode === 429) {
                    setRegeneratePasswordError('Too many attempts. Please try again later.');
                } else {
                    setRegeneratePasswordError(message || 'An error occurred.');
                }
            }
        } catch (err) {
            console.error('2FA regeneration error:', err);
            setRegeneratePasswordError('An unexpected error occurred.');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleConfirmDisable = async () => {
        const sanitizedCode = disableCode.trim();
        if (disablePassword.length < 6 || sanitizedCode.length !== 6) return;
        setIsDisabling(true);
        setDisablePasswordError('');
        setDisableCodeError('');

        try {
            const res = await disableTwoFactor(disablePassword, sanitizedCode);
            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;
            const errors = res.Errors !== undefined ? res.Errors : res.errors;

            if (success) {
                toast.success(message || "Two-factor authentication has been disabled successfully.");
                resetDisableState();
                fetchStatus();
            } else {
                if (statusCode === 401) {
                    setDisableCodeError('The verification code is invalid.');
                } else if (statusCode === 409) {
                    toast.error(message || 'Two-factor authentication is not enabled.');
                    resetDisableState();
                    fetchStatus();
                } else if (statusCode === 400) {
                    if (errors) {
                        if (typeof errors === 'object' && !Array.isArray(errors)) {
                            const passErrors = errors.Password || errors.password;
                            if (Array.isArray(passErrors) && passErrors.length > 0) {
                                setDisablePasswordError(passErrors[0]);
                            } else if (typeof passErrors === 'string') {
                                setDisablePasswordError(passErrors);
                            }

                            const codeErrors = errors.Code || errors.code || errors.VerificationCode || errors.verificationCode;
                            if (Array.isArray(codeErrors) && codeErrors.length > 0) {
                                setDisableCodeError(codeErrors[0]);
                            } else if (typeof codeErrors === 'string') {
                                setDisableCodeError(codeErrors);
                            }

                            if (!passErrors && !codeErrors) {
                                const firstErrKey = Object.keys(errors)[0];
                                const firstErr = errors[firstErrKey];
                                const errMsg = Array.isArray(firstErr) && firstErr.length > 0 ? firstErr[0] : firstErr;
                                if (firstErrKey.toLowerCase().includes('password')) {
                                    setDisablePasswordError(errMsg || 'Validation failed.');
                                } else {
                                    setDisableCodeError(errMsg || 'Validation failed.');
                                }
                            }
                        } else if (Array.isArray(errors) && errors.length > 0) {
                            const errStr = errors.join(' ');
                            if (errStr.toLowerCase().includes('password')) {
                                setDisablePasswordError(errStr);
                            } else {
                                setDisableCodeError(errStr);
                            }
                        } else {
                            setDisableCodeError(message || 'Validation failed.');
                        }
                    } else {
                        setDisableCodeError(message || 'Validation failed.');
                    }
                } else {
                    toast.error(message || 'Two-factor authentication could not be disabled. Please try again.');
                }
            }
        } catch (err) {
            console.error('2FA disable error:', err);
            toast.error('Two-factor authentication could not be disabled. Please try again.');
        } finally {
            setIsDisabling(false);
        }
    };

    const handleCopyCodes = () => {
        const textToCopy = recoveryCodes.join('\n');
        navigator.clipboard.writeText(textToCopy)
            .then(() => toast.success("Recovery codes copied to clipboard."))
            .catch(() => toast.error("Failed to copy recovery codes."));
    };

    const handleDownloadCodes = () => {
        const text = recoveryCodes.join('\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hukaa-2fa-recovery-codes.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Recovery codes downloaded.");
    };

    const handleCopyRegeneratedCodes = () => {
        const textToCopy = regeneratedCodes.join('\n');
        navigator.clipboard.writeText(textToCopy)
            .then(() => toast.success("Recovery codes copied."))
            .catch(() => toast.error("Failed to copy recovery codes."));
    };

    const handleDownloadRegeneratedCodes = () => {
        const text = regeneratedCodes.join('\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'hukaa-recovery-codes.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Recovery codes downloaded.");
    };

    const handleDone = () => {
        resetSetupState();
        fetchStatus();
    };

    const handleRegenerateDone = () => {
        resetRegenerateState();
        fetchStatus();
    };

    const formatProvider = (prov) => {
        if (!prov) return 'None';
        if (prov === 'AuthenticatorApp') return 'Authenticator app';
        return prov;
    };

    if (isLoading) {
        return <TwoFactorSkeleton onBack={onBack} />;
    }

    if (error) {
        return (
            <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
                <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-factor authentication</h2>
                </div>
                <div className="p-4 md:p-6 max-w-[600px] flex flex-col items-start gap-4">
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
            <div className="px-4 pt-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Two-factor authentication</h2>
            </div>

            <div className="p-4 md:px-6 md:py-2 max-w-[600px] space-y-6">
                <div>
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

                        <div className="text-sm text-gray-650 dark:text-gray-400">
                            Provider: <span className="font-semibold text-gray-900 dark:text-white">{formatProvider(twoFactorStatus.provider)}</span>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <SettingsButton
                                variant="outline"
                                onClick={() => {
                                    resetRegenerateState();
                                    setIsRegenerateModalOpen(true);
                                }}
                            >
                                Regenerate recovery codes
                            </SettingsButton>
                            <SettingsButton
                                variant="danger"
                                onClick={() => {
                                    resetDisableState();
                                    setIsDisableModalOpen(true);
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
                            className="bg-main! hover:bg-main-hover! text-white! border-transparent"
                            onClick={handleEnableClick}
                        >
                            Enable
                        </SettingsButton>
                    </div>
                )}
            </div>

            {/* Enable Setup Modal */}
            {isEnableModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={handleOverlayClick}
                >
                    <div className="relative bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
                        {/* Close button X */}
                        {setupStep !== 'recoveryCodes' && (
                            <button
                                onClick={resetSetupState}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        )}

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Enable two-factor authentication
                        </h3>

                        {setupStep === 'password' && (
                            <div className="space-y-4 mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Confirm your password to continue.
                                </p>
                                <SettingsInput
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    status={passwordError ? 'error' : null}
                                    helperText={passwordError}
                                />
                                <div className="flex justify-end gap-3 pt-2">
                                    <SettingsButton variant="outline" onClick={resetSetupState} disabled={isSubmitting}>
                                        Cancel
                                    </SettingsButton>
                                    <SettingsButton
                                        variant="primary"
                                        className="bg-main! hover:bg-main-hover! text-white! border-transparent"
                                        onClick={handleConfirmPassword}
                                        disabled={password.length < 6 || isSubmitting}
                                    >
                                        {isSubmitting ? 'Continuing...' : 'Continue'}
                                    </SettingsButton>
                                </div>
                            </div>
                        )}

                        {setupStep === 'qr' && (
                            <div className="space-y-4 mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-[13.5px]">
                                    Scan the QR code with your authenticator app (such as Google Authenticator, Authy, 1Password), then enter the 6-digit verification code below.
                                </p>

                                <div className="flex flex-col items-center justify-center py-4 bg-gray-50/50 dark:bg-[#16181c]/30 rounded-xl border border-gray-100 dark:border-neutral-800">
                                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-3">
                                        <QRCodeSVG value={qrCodeUri} size={160} level="M" />
                                    </div>
                                    <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center mb-1">
                                        If you cannot scan the QR code, enter this key manually:
                                    </p>
                                    <div className="font-mono text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-250 select-all bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 max-w-[90%] break-all text-center">
                                        {sharedKey}
                                    </div>
                                </div>

                                <SettingsInput
                                    label="Verification code"
                                    type="text"
                                    placeholder="123456"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                        setVerificationCode(val);
                                        setVerificationCodeError('');
                                    }}
                                    status={verificationCodeError ? 'error' : null}
                                    helperText={verificationCodeError || "Enter the 6-digit code from your authenticator app"}
                                />

                                <div className="flex justify-end gap-3 pt-2">
                                    <SettingsButton variant="outline" onClick={resetSetupState} disabled={isSubmitting}>
                                        Cancel
                                    </SettingsButton>
                                    <SettingsButton
                                        variant="primary"
                                        className="bg-main! hover:bg-main-hover! text-white! border-transparent"
                                        onClick={handleVerifyAndEnable}
                                        disabled={verificationCode.length !== 6 || isSubmitting}
                                    >
                                        {isSubmitting ? 'Verifying...' : 'Verify and enable'}
                                    </SettingsButton>
                                </div>
                            </div>
                        )}

                        {setupStep === 'recoveryCodes' && (
                            <div className="space-y-4 mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-[13.5px]">
                                    Save these recovery codes in a safe place. You can use them to sign in if you lose access to your authenticator app.
                                </p>

                                <div className="border border-gray-200 dark:border-neutral-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/30">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-mono text-[14px] text-gray-850 dark:text-gray-200 select-all text-center sm:text-left">
                                        {recoveryCodes.map((code, idx) => (
                                            <div key={idx} className="tracking-wide">
                                                {code}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <SettingsButton variant="outline" onClick={handleCopyCodes}>
                                        Copy
                                    </SettingsButton>
                                    <SettingsButton variant="outline" onClick={handleDownloadCodes}>
                                        Download
                                    </SettingsButton>
                                </div>

                                <p className="text-[12.5px] text-gray-450 dark:text-gray-500 leading-normal">
                                    Each recovery code can only be used once to sign in. Keep them in a safe place, as they will not be shown again after closing this screen.
                                </p>

                                <div className="flex justify-end pt-2">
                                    <SettingsButton
                                        variant="primary"
                                        className="bg-main! hover:bg-main-hover! text-white! border-transparent"
                                        onClick={handleDone}
                                    >
                                        Done, I saved them
                                    </SettingsButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Regenerate Recovery Codes Modal */}
            {isRegenerateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={handleRegenerateOverlayClick}
                >
                    <div className="relative bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
                        {/* Close button X */}
                        {regenerateStep !== 'codes' && (
                            <button
                                onClick={resetRegenerateState}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        )}

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {regenerateStep === 'password' ? 'Regenerate recovery codes' : 'Recovery codes regenerated'}
                        </h3>

                        {regenerateStep === 'password' ? (
                            <div className="space-y-4 mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-[13.5px]">
                                    Confirm your password to generate a new set of recovery codes. Your previous recovery codes will no longer be valid.
                                </p>
                                <SettingsInput
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={regeneratePassword}
                                    onChange={(e) => {
                                        setRegeneratePassword(e.target.value);
                                        setRegeneratePasswordError('');
                                    }}
                                    status={regeneratePasswordError ? 'error' : null}
                                    helperText={regeneratePasswordError}
                                />
                                <div className="flex justify-end gap-3 pt-2">
                                    <SettingsButton variant="outline" onClick={resetRegenerateState} disabled={isRegenerating}>
                                        Cancel
                                    </SettingsButton>
                                    <SettingsButton
                                        variant="primary"
                                        className="bg-main! hover:bg-main-hover! text-white! border-transparent"
                                        onClick={handleConfirmPasswordRegenerate}
                                        disabled={regeneratePassword.length < 6 || isRegenerating}
                                    >
                                        {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                                    </SettingsButton>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-[13.5px]">
                                    Save these recovery codes in a safe place. You can use them to sign in if you lose access to your authenticator app. Your old recovery codes are no longer valid.
                                </p>

                                <div className="border border-gray-200 dark:border-neutral-800 rounded-xl p-4 bg-gray-50/50 dark:bg-black/30">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-mono text-[14px] text-gray-850 dark:text-gray-200 select-all text-center sm:text-left">
                                        {regeneratedCodes.map((code, idx) => (
                                            <div key={idx} className="tracking-wide">
                                                {code}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <SettingsButton variant="outline" onClick={handleCopyRegeneratedCodes}>
                                        Copy
                                    </SettingsButton>
                                    <SettingsButton variant="outline" onClick={handleDownloadRegeneratedCodes}>
                                        Download
                                    </SettingsButton>
                                </div>

                                <p className="text-[12.5px] text-gray-450 dark:text-gray-500 leading-normal">
                                    Each recovery code can only be used once to sign in. Keep them in a safe place, as they will not be shown again after closing this screen.
                                </p>

                                <div className="flex justify-end pt-2">
                                    <SettingsButton
                                        variant="primary"
                                        className="bg-main! hover:bg-main-hover! text-white! border-transparent"
                                        onClick={handleRegenerateDone}
                                    >
                                        Done, I saved them
                                    </SettingsButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Disable 2FA Modal */}
            {isDisableModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={handleDisableOverlayClick}
                >
                    <div className="relative bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
                        {/* Close button X */}
                        <button
                            onClick={resetDisableState}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <i className="ri-close-line text-xl"></i>
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            Disable two-factor authentication
                        </h3>

                        <div className="space-y-4 mt-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-[13.5px]">
                                Enter your password and a valid verification code to disable two-factor authentication.
                            </p>

                            <SettingsInput
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={disablePassword}
                                onChange={(e) => {
                                    setDisablePassword(e.target.value);
                                    setDisablePasswordError('');
                                }}
                                status={disablePasswordError ? 'error' : null}
                                helperText={disablePasswordError}
                            />

                            <SettingsInput
                                label="Verification code"
                                type="text"
                                placeholder="123456"
                                value={disableCode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                    setDisableCode(val);
                                    setDisableCodeError('');
                                }}
                                status={disableCodeError ? 'error' : null}
                                helperText={disableCodeError || "Enter the 6-digit code from your authenticator app"}
                            />

                            <div className="flex justify-end gap-3 pt-2">
                                <SettingsButton variant="outline" onClick={resetDisableState} disabled={isDisabling}>
                                    Cancel
                                </SettingsButton>
                                <SettingsButton
                                    variant="danger"
                                    onClick={handleConfirmDisable}
                                    disabled={disablePassword.length < 6 || disableCode.length !== 6 || isDisabling}
                                >
                                    {isDisabling ? 'Disabling...' : 'Disable'}
                                </SettingsButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TwoFactorForm;

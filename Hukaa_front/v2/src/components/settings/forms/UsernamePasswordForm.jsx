import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SettingsInput from '../SettingsInput';
import SettingsButton from '../SettingsButton';
import { useAuth } from '../../../context/AuthContext';
import { checkUsername, updateUsername } from '../../../api/account.api';
import Skeleton from '../../ui/Skeleton';

const UsernamePasswordForm = () => {
    const navigate = useNavigate();
    const { user, isLoadingUser, updateCurrentUser } = useAuth();

    const [username, setUsername] = useState('');
    const [initialUsername, setInitialUsername] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    const [email, setEmail] = useState('');
    const [currentPasswordEmail, setCurrentPasswordEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (user && !hasInitialized) {
            const currentVal = user.username || user.Username || '';
            const currentEmail = user.email || user.Email || '';
            setUsername(currentVal);
            setInitialUsername(currentVal);
            setEmail(currentEmail);
            setHasInitialized(true);
        }
    }, [user, hasInitialized]);

    // Debounced username availability check
    useEffect(() => {
        if (!hasInitialized) return;

        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setIsCheckingUsername(false);
            setIsUsernameAvailable(false);
            if (username.length > 0) {
                setUsernameMessage("Username cannot be empty.");
            } else {
                setUsernameMessage("");
            }
            return;
        }

        if (username === initialUsername) {
            setIsCheckingUsername(false);
            setIsUsernameAvailable(null);
            setUsernameMessage("");
            return;
        }

        setIsCheckingUsername(true);
        setIsUsernameAvailable(null);
        setUsernameMessage("Checking username...");

        let active = true;
        const timer = setTimeout(async () => {
            try {
                const response = await checkUsername(username);
                if (!active) return;

                const success = response.Success !== undefined ? response.Success : response.success;
                const data = response.Data !== undefined ? response.Data : response.data;
                const isAvailable = data ? (data.isAvailable !== undefined ? data.isAvailable : data.IsAvailable) : false;

                if (success && isAvailable) {
                    setIsUsernameAvailable(true);
                    setUsernameMessage("This username is available.");
                } else {
                    setIsUsernameAvailable(false);
                    setUsernameMessage("This username is already taken.");
                }
            } catch (err) {
                if (!active) return;
                setIsUsernameAvailable(false);
                setUsernameMessage("Error checking username.");
            } finally {
                if (active) {
                    setIsCheckingUsername(false);
                }
            }
        }, 750);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [username, initialUsername, hasInitialized]);

    const isSubmitDisabled = 
        !username.trim() ||
        username === initialUsername ||
        isUsernameAvailable !== true ||
        isCheckingUsername ||
        isSubmitting;

    const handleUpdateUsername = async () => {
        if (isSubmitDisabled) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await updateUsername(username);
            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const data = res.Data !== undefined ? res.Data : res.data;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;

            if (success) {
                toast.success(message || "Username has been successfully changed.");
                const newUsername = data?.username || data?.Username || username;
                updateCurrentUser({ username: newUsername });
                setInitialUsername(newUsername);
                setIsUsernameAvailable(null);
                setUsernameMessage("");
            } else {
                if (statusCode === 409) {
                    setIsUsernameAvailable(false);
                    setUsernameMessage("This username is already taken.");
                } else {
                    setError(message || "Failed to update username.");
                }
            }
        } catch (err) {
            console.error("Error updating username:", err);
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateEmail = () => {
        if (!currentPasswordEmail) {
            toast.error("Please enter your current password to update email.");
            return;
        }
        toast.success("Email updated successfully.");
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword) {
            toast.error("Please fill all password fields.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }
        toast.success("Password changed successfully.");
        setCurrentPassword('');
        setNewPassword('');
    };

    if (isLoadingUser || !user) {
        return (
            <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
                <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 border-b border-gray-100 dark:border-[#1f1f1f] flex items-center gap-4">
                    <button
                        onClick={() => navigate('/settings/account')}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Username and password</h2>
                </div>
                <div className="p-4 md:p-6 max-w-[600px] space-y-6">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-[48px] w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-[48px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    let inputStatus = null;
    let inputHelperText = "";

    if (hasInitialized) {
        if (!username.trim()) {
            if (username.length > 0) {
                inputStatus = "error";
                inputHelperText = "Username cannot be empty.";
            }
        } else if (username === initialUsername) {
            inputStatus = null;
            inputHelperText = "";
        } else if (isCheckingUsername) {
            inputStatus = null;
            inputHelperText = "Checking username...";
        } else if (isUsernameAvailable === true) {
            inputStatus = "success";
            inputHelperText = "This username is available.";
        } else if (isUsernameAvailable === false) {
            inputStatus = "error";
            inputHelperText = usernameMessage || "This username is already taken.";
        }
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Username and password</h2>
            </div>

            <div className="p-4 md:p-6 max-w-[600px]">
                <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-6">Login information</h3>

                {/* Username Section */}
                <div className="mb-8">
                    <SettingsInput
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        status={inputStatus}
                        helperText={inputHelperText}
                    />
                    <div className="flex justify-end -mt-2">
                        <SettingsButton 
                            variant="outline" 
                            onClick={handleUpdateUsername}
                            disabled={isSubmitDisabled}
                        >
                            {isSubmitting ? "Updating..." : "Update username"}
                        </SettingsButton>
                    </div>
                </div>

                {/* Email Section */}
                <div className="mb-8 border-b border-gray-100 dark:border-[#1f1f1f] pb-8">
                    <SettingsInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <SettingsInput
                        label="Current password"
                        type="password"
                        value={currentPasswordEmail}
                        onChange={(e) => setCurrentPasswordEmail(e.target.value)}
                        helperText="Confirm your password to update your email."
                    />
                    <div className="flex justify-end">
                        <SettingsButton variant="outline" onClick={handleUpdateEmail}>
                            Update email
                        </SettingsButton>
                    </div>
                </div>

                {/* Password Section */}
                <div className="mb-8">
                    <SettingsInput
                        label="Current password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <SettingsInput
                        label="New password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        helperText="At least 8 characters"
                    />
                    <div className="flex justify-end">
                        <SettingsButton variant="outline" onClick={handleChangePassword}>
                            Change password
                        </SettingsButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsernamePasswordForm;

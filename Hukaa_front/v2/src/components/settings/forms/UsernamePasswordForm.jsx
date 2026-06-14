import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SettingsInput from '../SettingsInput';
import SettingsButton from '../SettingsButton';
import { useAuth } from '../../../context/AuthContext';
import { checkUsername, updateUsername, checkEmail, updateEmailAddress } from '../../../api/account.api';
import { changePassword } from '../../../api/auth.api';
import Skeleton from '../../ui/Skeleton';

const UsernamePasswordForm = () => {
    const navigate = useNavigate();
    const { user, isLoadingUser, updateCurrentUser } = useAuth();

    // Username section states
    const [username, setUsername] = useState('');
    const [initialUsername, setInitialUsername] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [usernameMessage, setUsernameMessage] = useState('');

    // Email section states
    const [email, setEmail] = useState('');
    const [initialEmail, setInitialEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [emailMessage, setEmailMessage] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    // Global states
    const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);
    const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
    const [error, setError] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    // Password section states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        general: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && !hasInitialized) {
            const currentVal = user.username || user.Username || '';
            const currentEmail = user.email || user.Email || '';
            setUsername(currentVal);
            setInitialUsername(currentVal);
            setEmail(currentEmail);
            setInitialEmail(currentEmail);
            setHasInitialized(true);
        }
    }, [user, hasInitialized]);

    // Email format helper
    const validateEmailFormat = (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
    };

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

    // Debounced email availability check
    useEffect(() => {
        if (!hasInitialized) return;

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setIsCheckingEmail(false);
            setIsEmailAvailable(false);
            setEmailMessage(email.length > 0 ? "Email cannot be empty." : "");
            return;
        }

        if (!validateEmailFormat(trimmedEmail)) {
            setIsCheckingEmail(false);
            setIsEmailAvailable(false);
            setEmailMessage("Invalid email format.");
            return;
        }

        if (email === initialEmail) {
            setIsCheckingEmail(false);
            setIsEmailAvailable(null);
            setEmailMessage("");
            return;
        }

        setIsCheckingEmail(true);
        setIsEmailAvailable(null);
        setEmailMessage("Checking email...");

        let active = true;
        const timer = setTimeout(async () => {
            try {
                const response = await checkEmail(trimmedEmail);
                if (!active) return;

                const success = response.Success !== undefined ? response.Success : response.success;
                const data = response.Data !== undefined ? response.Data : response.data;
                const isAvailable = data ? (data.isAvailable !== undefined ? data.isAvailable : data.IsAvailable) : false;

                if (success && isAvailable) {
                    setIsEmailAvailable(true);
                    setEmailMessage("This email is available.");
                } else {
                    setIsEmailAvailable(false);
                    setEmailMessage("This email is already taken.");
                }
            } catch (err) {
                if (!active) return;
                setIsEmailAvailable(false);
                setEmailMessage("Error checking email.");
            } finally {
                if (active) {
                    setIsCheckingEmail(false);
                }
            }
        }, 750);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [email, initialEmail, hasInitialized]);

    // Username submit state helper
    const isUsernameSubmitDisabled =
        !username.trim() ||
        username === initialUsername ||
        isUsernameAvailable !== true ||
        isCheckingUsername ||
        isSubmittingUsername;

    // Email submit state helper
    const isEmailSubmitDisabled =
        !email.trim() ||
        !validateEmailFormat(email) ||
        email === initialEmail ||
        isEmailAvailable !== true ||
        isCheckingEmail ||
        !password ||
        password.length < 6 ||
        isSubmittingEmail;

    const handleUpdateUsername = async () => {
        if (isUsernameSubmitDisabled) return;

        setIsSubmittingUsername(true);
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
            setIsSubmittingUsername(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (isEmailSubmitDisabled) return;

        setIsSubmittingEmail(true);
        setEmailError(null);
        setPasswordError(null);

        try {
            const res = await updateEmailAddress(email.trim(), password);
            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const data = res.Data !== undefined ? res.Data : res.data;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;

            if (success) {
                toast.success(message || "Email has been successfully changed.");
                const newEmail = data?.email || data?.Email || email.trim();
                updateCurrentUser({ email: newEmail });
                setInitialEmail(newEmail);
                setIsEmailAvailable(null);
                setEmailMessage("");
                setPassword("");
            } else {
                if (statusCode === 409) {
                    setIsEmailAvailable(false);
                    setEmailMessage("This email is already taken.");
                } else if (statusCode === 401) {
                    setPasswordError("Password is incorrect.");
                } else {
                    setEmailError(message || "Failed to update email.");
                }
            }
        } catch (err) {
            console.error("Error updating email:", err);
            setEmailError("An unexpected error occurred.");
        } finally {
            setIsSubmittingEmail(false);
        }
    };

    const handleChangePassword = async () => {
        // Clear previous errors before validation
        setFieldErrors({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            general: ''
        });

        // Frontend validation
        const newFieldErrors = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            general: ''
        };
        let hasValidationError = false;

        if (!currentPassword || currentPassword.length < 6) {
            newFieldErrors.currentPassword = "Current password must be at least 6 characters.";
            hasValidationError = true;
        }

        if (!newPassword || newPassword.length < 6) {
            newFieldErrors.newPassword = "New password must be at least 6 characters.";
            hasValidationError = true;
        }

        if (confirmNewPassword && confirmNewPassword !== newPassword) {
            newFieldErrors.confirmNewPassword = "Passwords do not match.";
            hasValidationError = true;
        }

        if (hasValidationError) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await changePassword({ currentPassword, newPassword });

            const success = res.Success !== undefined ? res.Success : res.success;
            const message = res.Message !== undefined ? res.Message : res.message;
            const errors = res.Errors !== undefined ? res.Errors : res.errors;
            const statusCode = res.StatusCode !== undefined ? res.StatusCode : res.statusCode;

            if (success) {
                const successMsg = (message || "Password has been successfully changed.").trim();
                toast.success(successMsg);

                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');

                setFieldErrors({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                    general: ''
                });
            } else {
                const errorMsg = message || "Password could not be changed. Please try again.";

                if (!message || statusCode === 200) {
                    toast.error(errorMsg);
                }

                const responseFieldErrors = {
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                    general: ''
                };

                if (errors) {
                    if (Array.isArray(errors)) {
                        const hasIncorrect = errors.some(err =>
                            typeof err === 'string' && err.toLowerCase().includes('incorrect password')
                        );
                        if (hasIncorrect) {
                            responseFieldErrors.currentPassword = "Incorrect password.";
                        } else {
                            responseFieldErrors.general = errors.join(' ');
                        }
                    } else if (typeof errors === 'object') {
                        Object.entries(errors).forEach(([key, val]) => {
                            const fieldName = key.toLowerCase();
                            const errMsg = Array.isArray(val) ? val[0] : val;
                            if (fieldName === 'currentpassword') {
                                responseFieldErrors.currentPassword = errMsg;
                            } else if (fieldName === 'newpassword') {
                                responseFieldErrors.newPassword = errMsg;
                            } else if (fieldName === 'confirmnewpassword') {
                                responseFieldErrors.confirmNewPassword = errMsg;
                            } else {
                                responseFieldErrors.general = errMsg;
                            }
                        });
                    }
                }
                setFieldErrors(responseFieldErrors);
            }
        } catch (err) {
            console.error("Error changing password:", err);
            toast.error("Password could not be changed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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

    // Input state definitions for Username
    let usernameInputStatus = null;
    let usernameHelperText = "";

    if (hasInitialized) {
        if (!username.trim()) {
            if (username.length > 0) {
                usernameInputStatus = "error";
                usernameHelperText = "Username cannot be empty.";
            }
        } else if (username === initialUsername) {
            usernameInputStatus = null;
            usernameHelperText = "";
        } else if (isCheckingUsername) {
            usernameInputStatus = null;
            usernameHelperText = "Checking username...";
        } else if (isUsernameAvailable === true) {
            usernameInputStatus = "success";
            usernameHelperText = "This username is available.";
        } else if (isUsernameAvailable === false) {
            usernameInputStatus = "error";
            usernameHelperText = usernameMessage || "This username is already taken.";
        }
    }

    // Input state definitions for Email
    let emailInputStatus = null;
    let emailHelperText = "";

    if (hasInitialized) {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            if (email.length > 0) {
                emailInputStatus = "error";
                emailHelperText = "Email cannot be empty.";
            }
        } else if (!validateEmailFormat(trimmedEmail)) {
            emailInputStatus = "error";
            emailHelperText = "Invalid email format.";
        } else if (email === initialEmail) {
            emailInputStatus = null;
            emailHelperText = "";
        } else if (isCheckingEmail) {
            emailInputStatus = null;
            emailHelperText = "Checking email...";
        } else if (isEmailAvailable === true) {
            emailInputStatus = "success";
            emailHelperText = "This email is available.";
        } else if (isEmailAvailable === false) {
            emailInputStatus = "error";
            emailHelperText = emailMessage || "This email is already taken.";
        }
    }

    if (emailError) {
        emailInputStatus = "error";
        emailHelperText = emailError;
    }

    // Input state definitions for Email Current Password
    let passwordInputStatus = null;
    let passwordHelperText = "Confirm your password to update your email.";

    if (passwordError) {
        passwordInputStatus = "error";
        passwordHelperText = passwordError;
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
                        status={usernameInputStatus}
                        helperText={usernameHelperText}
                    />
                    <div className="flex justify-end -mt-2">
                        <SettingsButton
                            variant="outline"
                            onClick={handleUpdateUsername}
                            disabled={isUsernameSubmitDisabled}
                        >
                            {isSubmittingUsername ? "Updating..." : "Update username"}
                        </SettingsButton>
                    </div>
                </div>

                {/* Email Section */}
                <div className="mb-8 border-b border-gray-100 dark:border-[#1f1f1f] pb-8">
                    <SettingsInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(null);
                        }}
                        status={emailInputStatus}
                        helperText={emailHelperText}
                    />
                    <SettingsInput
                        label="Current password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError(null);
                        }}
                        status={passwordInputStatus}
                        helperText={passwordHelperText}
                    />
                    <div className="flex justify-end">
                        <SettingsButton
                            variant="outline"
                            onClick={handleUpdateEmail}
                            disabled={isEmailSubmitDisabled}
                        >
                            {isSubmittingEmail ? "Updating..." : "Update email"}
                        </SettingsButton>
                    </div>
                </div>

                {/* Password Section */}
                <div className="mb-8">
                    <SettingsInput
                        label="Current password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setFieldErrors(prev => ({ ...prev, currentPassword: '' }));
                        }}
                        status={fieldErrors.currentPassword ? 'error' : null}
                        helperText={fieldErrors.currentPassword}
                    />
                    <SettingsInput
                        label="New password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setFieldErrors(prev => ({ ...prev, newPassword: '' }));
                        }}
                        status={fieldErrors.newPassword ? 'error' : null}
                        helperText={fieldErrors.newPassword || "At least 6 characters"}
                    />
                    <div className="flex justify-end">
                        <SettingsButton
                            variant="outline"
                            onClick={handleChangePassword}
                            disabled={
                                !currentPassword ||
                                currentPassword.length < 6 ||
                                !newPassword ||
                                newPassword.length < 6 ||
                                (confirmNewPassword !== undefined && confirmNewPassword !== '' && confirmNewPassword !== newPassword) ||
                                isSubmitting
                            }
                        >
                            {isSubmitting ? "Changing..." : "Change password"}
                        </SettingsButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsernamePasswordForm;

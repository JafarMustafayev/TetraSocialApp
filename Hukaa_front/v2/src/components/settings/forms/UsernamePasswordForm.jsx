import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SettingsInput from '../SettingsInput';
import SettingsButton from '../SettingsButton';

const UsernamePasswordForm = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('JafarMustafayev');
    const [email, setEmail] = useState('mhbcefer@gmail.com');
    const [currentPasswordEmail, setCurrentPasswordEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleUpdateUsername = () => {
        toast.success("Username updated successfully.");
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
                    />
                    <div className="flex justify-end -mt-2">
                        <SettingsButton variant="outline" onClick={handleUpdateUsername}>
                            Update username
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

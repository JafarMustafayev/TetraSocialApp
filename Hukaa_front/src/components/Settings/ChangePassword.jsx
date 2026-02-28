import { useState } from 'react';
import { changePassword } from '../../api/auth';
import { useToast } from '../../context/ToastContext';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            showToast("New passwords do not match.", "error", 3000, "top-left");
            return;
        }

        setLoading(true);
        try {
            const response = await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            if (response.success) {
                showToast("Password changed successfully.", "success", 3000, "top-left");
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                showToast(response.message || "Failed to change password.", "error", 3000, "top-left");
            }
        } catch (error) {
            console.error('Change password error:', error);
            const errorMessage = error.data?.Errors?.[0] || error.message || "An error occurred.";
            showToast(errorMessage, "error", 3000, "top-left");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6 max-w-lg" onSubmit={handleSubmit}>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-10 py-3.5 bg-[#3644D9] text-white rounded-xl font-bold hover:bg-[#2E3AB8] hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;

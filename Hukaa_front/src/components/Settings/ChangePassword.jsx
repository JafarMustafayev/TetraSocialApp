import React, { useState } from 'react';
import { changePassword } from '../../api/auth';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match." });
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
                setMessage({ type: 'success', text: "Password changed successfully." });
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setMessage({ type: 'error', text: response.message || "Failed to change password." });
            }
        } catch (error) {
            console.error('Change password error:', error);
            const errorMessage = error.data?.Errors?.[0] || error.message || "An error occurred.";
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="account-setting-form" onSubmit={handleSubmit}>
            <h3>Change Password</h3>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                    {message.text}
                </div>
            )}

            <div className="row">
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            className="form-control"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-control"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <button type="submit" className="default-btn" disabled={loading}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;

import React, { useState } from 'react';
import { changeUsername } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const ChangeUsername = () => {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { updateProfile } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!userName.trim()) {
            setMessage({ type: 'error', text: "Please enter a username." });
            return;
        }

        setLoading(true);
        try {
            const response = await changeUsername({ userName });

            if (response.success) {
                setMessage({ type: 'success', text: response.message || "Username changed successfully." });
                updateProfile(); // Trigger Navbar update
            } else {
                setMessage({ type: 'error', text: response.message || "Failed to change username." });
            }
        } catch (error) {
            console.error('Change username error:', error);
            const errorMessage = error.data?.Errors?.[0] || error.message || "An error occurred.";
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="account-setting-form" onSubmit={handleSubmit}>

            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                    {message.text}
                </div>
            )}

            <div className="row">
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>New Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter new username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12 text-end">
                    <button type="submit" className="h-[45px] px-6 rounded-lg font-bold text-[#515355] border border-gray-200 hover:bg-white hover:shadow-sm transition-all btn-primary mt-2" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Username'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChangeUsername;

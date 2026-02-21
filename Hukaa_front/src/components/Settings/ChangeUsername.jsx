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
        <form className="space-y-6 max-w-lg" onSubmit={handleSubmit}>
            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">New Username</label>
                    <input
                        type="text"
                        className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                        placeholder="Enter new username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-10 py-3.5 bg-[#3644D9] text-white rounded-xl font-bold hover:bg-[#2E3AB8] hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? 'Updating...' : 'Update Username'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChangeUsername;

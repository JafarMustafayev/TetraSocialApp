import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { LOGO } from '../api/client';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await forgotPassword(email);
            if (response.success) {
                setMessage(response.message || 'Password reset link sent to your email');
                setEmail('');
            } else {
                setError(response.Message || 'Failed to send reset link');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 profile-authentication-area">
            <div className="flex flex-wrap justify-center items-center min-h-screen py-32">
                <div className="w-full lg:w-1/2 md:w-full">
                    <div className="bg-transparent p-10 md:p-[65px_45px] rounded-[5px] max-w-[650px] mx-auto">
                        <div className="text-center mb-[30px]">
                            <img
                                src={LOGO}
                                alt="Huka Logo"
                                className="inline-block max-w-[240px] h-auto"
                            />
                        </div>

                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
                        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Enter your email</label>
                                <input
                                    type="email"
                                    className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border border-[#F4F7FC] bg-[#F4F7FC] focus:border-[#3644D9] focus:outline-none transition duration-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-[#0484ec] transition duration-400 font-medium border-none cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'SENDING...' : 'Send Recovery Link'}
                            </button>

                            <div className="my-[15px] text-center">
                                <span className="text-[#6B7C8F] text-[15px]"><Link to="/login" className="text-[#3644D9] hover:underline">Return to Login</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

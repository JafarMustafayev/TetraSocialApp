import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        token: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(true);

    useEffect(() => {
        const email = searchParams.get('email');

        // Manually extract token to prevent decoding of special characters
        const rawTokenMatch = window.location.search.match(/[?&]token=([^&]+)/);
        const rawToken = rawTokenMatch ? rawTokenMatch[1] : searchParams.get('token');
        const token = rawToken;

        if (email && token) {
            setFormData(prev => ({ ...prev, email, token }));
        } else {
            setIsValidUrl(false);
            setError('Invalid password reset link.');
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await resetPassword(formData);
            if (response.success) {
                setMessage('Password reset successfully. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.Message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center min-h-screen py-32">
                <div className="w-full lg:w-1/2 md:w-full">
                    <div className="bg-transparent p-10 md:p-[65px_45px]">
                        <div className="text-center mb-[30px]">
                            <img
                                src="/src/assets/images/huka_logo.png"
                                alt="Huka Logo"
                                className="inline-block max-w-[240px] h-auto"
                            />
                        </div>

                        <h2 className="text-[22px] font-semibold text-[#515355] mb-[30px]">Reset Password</h2>
                        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                        {isValidUrl && (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border border-[#F4F7FC] bg-[#1f3244] focus:border-[#3644D9] focus:outline-none transition duration-400"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border border-[#F4F7FC] bg-[#1f3244] focus:border-[#3644D9] focus:outline-none transition duration-400"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-[#0484ec] transition duration-400 font-medium border-none cursor-pointer">Reset Password</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

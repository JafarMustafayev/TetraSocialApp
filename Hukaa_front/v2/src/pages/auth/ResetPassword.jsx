import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { resetPassword } from '../../api/auth.api';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    // Extract userId and token from URL
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const token = queryParams.get('token');

    useEffect(() => {
        document.title = "Reset Password";
        if (!userId || !token) {
            toast.error('Invalid or missing reset token.');
            navigate('/auth/login');
        }
    }, [userId, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                UserId: userId,
                Token: token,
                NewPassword: formData.password
            };

            const result = await resetPassword(payload);

            if (result.Success || result.success) {
                toast.success('Password has been successfully reset.');
                navigate('/auth/login');
            }
        } catch (error) {
            console.error('Reset Password Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-authentication-area min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center min-h-screen py-10 md:py-20">
                    <div className="w-full">
                        <div className="max-w-md mx-auto bg-transparent p-6 md:p-10">
                            <div className="text-center mb-[30px]">
                                <img
                                    src={logo}
                                    alt="Huka Logo"
                                    className="inline-block max-w-[200px] md:max-w-[240px] h-auto"
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="mb-6 text-left">
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-6 text-left">
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

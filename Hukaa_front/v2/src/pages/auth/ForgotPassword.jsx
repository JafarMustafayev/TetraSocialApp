import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { forgotPassword } from '../../api/auth.api';
import { validateEmail } from '../../utily/validation';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [expiresAt, setExpiresAt] = useState('');

    useEffect(() => {
        document.title = "Forgot Password";
    }, []);

    const convertUTCToLocal = (utcStr) => {
        if (!utcStr) return '';
        try {
            const [hours, minutes] = utcStr.split(':').map(Number);
            const date = new Date();
            date.setUTCHours(hours, minutes, 0, 0);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (error) {
            console.error('Time conversion error:', error);
            return utcStr;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedEmail = email.trim();
        if (!validateEmail(trimmedEmail)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await forgotPassword({ Email: trimmedEmail });

            if (result.Success || result.success) {
                const expirationTime = result.Data?.expiresAt || result.data?.expiresAt;
                setExpiresAt(convertUTCToLocal(expirationTime));
                setIsSuccess(true);
            }
        } catch (error) {
            console.error('Forgot Password Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="profile-authentication-area min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center min-h-screen py-10 md:py-20">
                        <div className="w-full">
                            <div className="max-w-md mx-auto bg-transparent p-6 md:p-10 text-center">
                                <div className="mb-[30px]">
                                    <img
                                        src={logo}
                                        alt="Huka Logo"
                                        className="inline-block max-w-[200px] md:max-w-[240px] h-auto"
                                    />
                                </div>
                                <div className="bg-white/5 p-8 rounded-[10px] border border-main/20">
                                    <h2 className="text-white text-2xl font-bold mb-4">Check Your Email</h2>
                                    <p className="text-paragraph mb-6">
                                        Password reset link has been sent to <strong>{email}</strong>. 
                                        Please check your inbox.
                                    </p>
                                    <div className="bg-main/10 p-4 rounded-[5px] mb-8">
                                        <p className="text-white text-[15px]">
                                            Link is active until: <span className="font-bold text-main">{expiresAt}</span> (Local Time)
                                        </p>
                                    </div>
                                    <Link to="/auth/login" className="text-main font-medium hover:underline transition duration-400">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">Enter your email</label>
                                    <input
                                        type="email"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full
                                        bg-input-bg border border-input-border focus:border-main focus:outline-none transition duration-400"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                                </button>

                                <div className="my-[15px] text-center">
                                    <span className="text-paragraph text-[15px]"><Link to="/auth/login" className="text-main hover:underline">Return to Login</Link></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

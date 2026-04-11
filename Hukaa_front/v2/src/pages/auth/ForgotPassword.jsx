import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        document.title = "Forgot Password";
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Functional logic omitted as requested
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
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">Enter your email</label>
                                    <input
                                        type="email"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full
                                        bg-input-bg border border-input-border focus:border-main focus:outline-none transition duration-400"
                                        value={email.trim()}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer"
                                >
                                    Send Recovery Link
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

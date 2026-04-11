import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        document.title = "Reset Password";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                        value={formData.password.trim()}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-6 text-left">
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                        value={formData.confirmPassword.trim()}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer">Reset Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

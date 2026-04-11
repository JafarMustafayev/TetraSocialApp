import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const Login = () => {
    const [credentials, setCredentials] = useState({
        UsernameOrEmail: '',
        Password: ''
    });

    useEffect(() => {
        document.title = "Login";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Functional logic omitted as requested
    };

    return (
        <div className="profile-authentication-area min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center items-center py-10 md:py-20 min-h-screen">
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
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">Username or email</label>
                                    <input
                                        type="text"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                        name="UsernameOrEmail"
                                        value={credentials.UsernameOrEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-6 text-left">
                                    <label className="block mb-2 text-paragraph font-medium text-[15px]">Password</label>
                                    <input
                                        type="password"
                                        className="h-[60px] px-[25px] py-[15px] text-paragraph rounded-[5px] text-base w-full border border-input-border bg-input-bg focus:border-main focus:outline-none transition duration-400"
                                        name="Password"
                                        value={credentials.Password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end items-center mb-0">
                                    <Link to="/auth/forgot-password" title="Forgot password ?" className="text-paragraph font-medium text-[15px] hover:text-main transition duration-400 hover:underline">
                                        Forgot password ?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-main-hover transition duration-400 font-medium border-none cursor-pointer"
                                >
                                    LOGIN
                                </button>

                                <div className="my-[15px] text-center">
                                    <span className="text-paragraph text-[15px]">If you don't have an account</span>
                                </div>

                                <button type="button" className="bg-[#0090d2] text-white w-full rounded-[5px] hover:bg-main-hover transition duration-400 border-none cursor-pointer p-0">
                                    <Link to="/auth/register" className="block w-full h-full p-[15px] text-white hover:text-white"> REGISTER </Link>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        UsernameOrEmail: '',
        Password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(credentials);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center py-20">
                <div className="w-full lg:w-1/2 md:w-full">
                    <div className="bg-transparent p-10 md:p-[65px_45px]">
                        <div className="text-center mb-[30px]">
                            <img
                                className="max-w-[140px] h-auto"
                                src="/src/assets/images/huka_logo.png"
                                alt="Huka Logo"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Username or email</label>
                                <input
                                    type="text"
                                    className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border border-[#F4F7FC] bg-[#1f3244] focus:border-[#3644D9] focus:outline-none transition duration-400"
                                    name="UsernameOrEmail"
                                    value={credentials.UsernameOrEmail}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Password</label>
                                <input
                                    type="password"
                                    className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border border-[#F4F7FC] bg-[#1f3244] focus:border-[#3644D9] focus:outline-none transition duration-400"
                                    name="Password"
                                    value={credentials.Password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center mb-0">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="test1"
                                        className="w-[20px] h-[20px] border border-[#DDDDDD] rounded-[5px] bg-white accent-[#3644D9] cursor-pointer"
                                    />
                                    <label htmlFor="test1" className="ml-2 text-[#6B7C8F] font-medium text-[15px] cursor-pointer selection:bg-none">Remember me</label>
                                </div>

                                <div className="text-right">
                                    <Link to="/forgot-password" className="text-[#6B7C8F] font-medium text-[15px] hover:text-[#3644D9] transition duration-400 hover:underline">
                                        Forgot password ?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-[#0484ec] transition duration-400 font-medium border-none cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>

                            <div className="my-[15px] text-center">
                                <span className="text-[#6B7C8F] text-[15px]">If you don't have an account</span>
                            </div>

                            <button type="button" className="bg-[#0090d2] text-white w-full rounded-[5px] hover:bg-[#00aeff] transition duration-400 border-none cursor-pointer p-0">
                                <Link to="/register" className="block w-full h-full p-[15px] text-white hover:text-white"> REGISTER </Link>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

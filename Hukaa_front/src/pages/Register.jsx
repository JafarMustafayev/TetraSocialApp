import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { LOGO } from '../api/client';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await registerApi({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                setSuccessMessage(response.message || 'Registration successful! Please check your email.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                // Handle specific error format from backend
                if (response.Errors && response.Errors.length > 0) {
                    setError(response.Errors.join(' '));
                } else {
                    setError(response.Message || 'Registration failed');
                }
            }
        } catch (err) {
            // Handle errors thrown by fetchClient
            if (err.data && err.data.errors) {
                // Validation errors like "Email": ["Please provide a valid email address."]
                const errorMessages = Object.values(err.data.errors).flat().join(' ');
                setError(errorMessages);
            } else if (err.data && err.data.Errors) {
                setError(err.data.Errors.join(' '));
            } else {
                setError(err.message || 'An error occurred during registration');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 profile-authentication-area">
            <div className="flex flex-wrap justify-center items-center min-h-screen ">
                <div className="w-full lg:w-1/2 md:w-full">
                    <div className="bg-transparent p-10 md:p-[45px_45px]">
                        <div className="text-center ">
                            <img
                                src={LOGO}
                                alt="Huka Logo"
                                className=" max-w-[240px]"
                            />
                        </div>

                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
                        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{successMessage}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Name</label>
                                <input
                                    type="text"
                                    className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border-none bg-[#1f3244] focus:outline-none focus:ring-1 focus:ring-[#3644D9] transition duration-400"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Email</label>
                                <input
                                    type="email"
                                    className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border-none bg-[#1f3244] focus:outline-none focus:ring-1 focus:ring-[#3644D9] transition duration-400"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Password</label>
                                <input
                                    type="password"
                                    className="h-[60px] px-[25px] py-[14px] text-[#6B7C8F] rounded-[5px] text-base w-full border-none bg-[#1f3244] focus:outline-none focus:ring-1 focus:ring-[#3644D9] transition duration-400"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-[#6B7C8F] font-medium text-[15px]">Confirm Password</label>
                                <input
                                    type="password"
                                    className="h-[60px] px-[25px] py-[15px] text-[#6B7C8F] rounded-[5px] text-base w-full border-none bg-[#1f3244] focus:outline-none focus:ring-1 focus:ring-[#3644D9] transition duration-400"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>



                            <button
                                type="submit"
                                className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-[#0484ec] transition duration-400 font-medium border-none cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'REGISTERING...' : 'REGISTER'}
                            </button>

                            <div className="my-[15px] text-center">
                                <span className="text-[#6B7C8F] text-[15px]">If you don't have an account</span>
                            </div>

                            <button type="button" className="bg-[#0090d2] text-white w-full rounded-[5px] hover:bg-[#00aeff] transition duration-400 border-none cursor-pointer p-0">
                                <Link to="/login" className="block w-full h-full p-[15px] text-white hover:text-white"> LOGIN </Link>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

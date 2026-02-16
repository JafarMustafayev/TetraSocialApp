import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { confirmEmail } from '../api/auth';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');
    const [isValidUrl, setIsValidUrl] = useState(true);

    useEffect(() => {
        debugger;
        const verifyEmail = async () => {
            const id = searchParams.get('id');
            // Manually extract token to prevent decoding of special characters like '+' (which searchParams converts to space or decoded char)
            const rawTokenMatch = window.location.search.match(/[?&]token=([^&]+)/);
            const rawToken = rawTokenMatch ? rawTokenMatch[1] : searchParams.get('token');
            const token = rawToken; // Use raw token directly

            const email = searchParams.get('email');

            console.log(id);
            console.log(token);
            console.log(email);

            if (!id || !token) {
                setIsValidUrl(false);
                setStatus('error');
                setMessage('Invalid confirmation link.');
                return;
            }

            try {
                // Constructing the payload
                debugger;

                // Pass the token exactly as it was in the URL
                const response = await confirmEmail({ id, email, token });
                console.log(response);
                if (response.success) {
                    setStatus('success');
                    setMessage('Email confirmed successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(response.Message || 'Failed to confirm email.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'An error occurred during verification.');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

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

                        <div className="text-center">
                            <h2 className="text-[22px] font-semibold text-[#515355] mb-[30px]">Email Confirmation</h2>
                            <div className={`px-4 py-3 rounded relative mb-4 ${status === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : status === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-blue-100 border border-blue-400 text-blue-700'}`}>
                                {message}
                            </div>
                            {status === 'error' && isValidUrl && (
                                <button type="button" className="mt-5 bg-[#0072d2] text-white p-[15px] w-full rounded-[5px] hover:bg-[#0484ec] transition duration-400 font-medium border-none cursor-pointer" onClick={() => navigate('/login')}>
                                    Go to Login
                                </button>
                            )}
                            {status === 'success' && (
                                <p className="mb-[15px] leading-[1.8] text-[#6B7C8F] font-normal text-[15px]">Redirecting to login...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;

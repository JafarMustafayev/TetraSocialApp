import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { confirmEmail, resendConfirmationEmail } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthButton from '../../components/auth/AuthButton';

const EmailConfirmation = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isResending, setIsResending] = useState(false);
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [email, setEmail] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Confirm Email";
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const emailParam = queryParams.get('email');

        if (emailParam) {
            setEmail(emailParam);
        }

        if (token && emailParam) {
            verifyEmail(emailParam, token);
        } else {
            setStatus('error');
            setIsLoading(false);
        }
    }, [location]);

    const verifyEmail = async (emailToVerify, tokenToVerify) => {
        try {
            const result = await confirmEmail({ email: emailToVerify, token: tokenToVerify });
            
            if (result.Success || result.success) {
                setStatus('success');
                toast.success('Email successfully verified!');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Email confirmation error:', error);
            setStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Email address is missing. Please try logging in again.");
            return;
        }

        setIsResending(true);
        try {
            const result = await resendConfirmationEmail(email);
            if (result.Success || result.success) {
                toast.success("Verification link resent to your email.");
            }
        } catch (error) {
            console.error('Resend confirmation error:', error);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard 
                title={
                    status === 'verifying' ? "Verifying Email..." :
                    status === 'success' ? "Email Verified" : "Verification Failed"
                } 
                subtitle={
                    status === 'verifying' ? "Please wait while we verify your email address." :
                    status === 'success' ? "Your email has been successfully verified. You can now log in." :
                    "The verification link is invalid or has expired."
                }
            >
                
                {status === 'verifying' && (
                    <div className="flex justify-center my-8">
                        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-800 border-t-main rounded-full animate-spin"></div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex justify-center my-8 text-green-500">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                            <i className="ri-check-line text-4xl"></i>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex justify-center my-8 text-red-500">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <i className="ri-close-line text-4xl"></i>
                        </div>
                    </div>
                )}

                <div className="mt-8 space-y-4">
                    {status === 'success' ? (
                        <AuthButton onClick={() => navigate('/auth/login')}>
                            Go to Log In
                        </AuthButton>
                    ) : status === 'error' ? (
                        <>
                            <AuthButton 
                                onClick={handleResend} 
                                isLoading={isResending}
                            >
                                Resend Verification Link
                            </AuthButton>
                        </>
                    ) : null}

                    {status !== 'verifying' && (
                        <div className="text-center mt-6">
                            <Link 
                                to="/auth/login" 
                                className="text-[14px] text-gray-500 hover:text-main transition-colors font-medium flex items-center justify-center gap-1"
                            >
                                <i className="ri-arrow-left-line"></i> Back to log in
                            </Link>
                        </div>
                    )}
                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default EmailConfirmation;

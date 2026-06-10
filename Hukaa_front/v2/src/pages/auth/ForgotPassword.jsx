import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Forgot Password";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await forgotPassword({ email: email.trim() });
            
            if (result.Success || result.success) {
                toast.success(result.Message || result.message || "Password reset link sent to your email.");
                setEmail('');
            }
        } catch (error) {
            console.error('Forgot Password Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard title="Reset your password" subtitle="Enter your email to receive a link.">
                <form onSubmit={handleSubmit}>
                    <AuthInput
                        label="Email Address"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />

                    <div className="mt-6">
                        <AuthButton type="submit" isLoading={isLoading}>
                            Send Link
                        </AuthButton>
                    </div>

                    <div className="mt-6 text-center">
                        <Link 
                            to="/auth/login" 
                            className="text-[14px] text-gray-500 hover:text-main transition-colors font-medium flex items-center justify-center gap-1"
                        >
                            <i className="ri-arrow-left-line"></i> Back to log in
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

export default ForgotPassword;

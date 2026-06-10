import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = "Reset Password";
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        const emailParam = queryParams.get('email');

        if (tokenParam) setToken(tokenParam);
        if (emailParam) setEmail(emailParam);
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (!token || !email) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        const payload = {
            email: email,
            token: token,
            newPassword: formData.newPassword
        };

        setIsLoading(true);

        try {
            const result = await resetPassword(payload);
            
            if (result.Success || result.success) {
                toast.success(result.Message || result.message || "Password successfully reset!");
                navigate('/auth/login');
            }
        } catch (error) {
            console.error('Reset Password Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard title="Create new password" subtitle="Set a new password for your account.">
                <form onSubmit={handleSubmit}>
                    <AuthInput
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        placeholder="Enter your new password"
                    />

                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your new password"
                    />

                    <div className="mt-6">
                        <AuthButton type="submit" isLoading={isLoading}>
                            Update Password
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

export default ResetPassword;

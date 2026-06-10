import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({
        UsernameOrEmail: '',
        Password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { fetchUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            EmailOrUsername: credentials.UsernameOrEmail.trim(),
            Password: credentials.Password
        };

        setIsLoading(true);
        try {
            const result = await login(payload);

            const isSuccess = result.Success || result.success || (result.accessToken && result.refreshToken);

            if (isSuccess) {
                const tokenData = result.Data || result.data || result;

                localStorage.setItem('token', tokenData.accessToken?.accessToken || tokenData.accessToken);
                localStorage.setItem('refreshToken', tokenData.refreshToken?.refreshToken || tokenData.refreshToken);

                await fetchUser();

                toast.success('Successfully logged in!');

                const queryParams = new URLSearchParams(location.search);
                const redirectPath = queryParams.get('redirect') || '/feed';

                navigate(redirectPath);
            }
        } catch (error) {
            console.error('Login Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard title="Welcome back" subtitle="Log in to your account.">
                <form onSubmit={handleSubmit}>
                    <AuthInput
                        label="Username or email"
                        name="UsernameOrEmail"
                        value={credentials.UsernameOrEmail}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username or email"
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        name="Password"
                        value={credentials.Password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />

                    <div className="flex justify-end mb-6 -mt-2">
                        <Link
                            to="/auth/forgot-password"
                            className="text-[14px] text-main hover:underline font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <AuthButton type="submit" isLoading={isLoading}>
                        Log in
                    </AuthButton>

                    <div className="mt-6 text-center">
                        <span className="text-[14px] text-gray-500">Don't have an account? </span>
                        <Link
                            to="/auth/register"
                            className="text-[14px] text-main hover:underline font-bold"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </AuthLayout>
    );
};

export default Login;

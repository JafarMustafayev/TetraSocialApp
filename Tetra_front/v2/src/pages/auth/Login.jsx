// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../api/auth.api';
import { toast } from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuth } from '../../context/AuthContext';

// Helper to normalize the backend response to support both camelCase and PascalCase
const normalizeLoginResponse = (res) => {
    if (!res) return null;
    const success = res.success ?? res.Success ?? false;
    const statusCode = res.statusCode ?? res.StatusCode;
    const message = res.message ?? res.Message;
    const data = res.data ?? res.Data;
    const errors = res.errors ?? res.Errors;

    let requiresTwoFactor = false;
    let tokens = null;
    let twoFactorChallenge = null;

    if (data) {
        requiresTwoFactor = data.requiresTwoFactor ?? data.RequiresTwoFactor ?? false;
        tokens = data.tokens ?? data.Tokens ?? null;
        twoFactorChallenge = data.twoFactorChallenge ?? data.TwoFactorChallenge ?? null;
    }

    return {
        success,
        statusCode,
        message,
        errors,
        requiresTwoFactor,
        tokens,
        twoFactorChallenge
    };
};

// Helper to safely extract nested tokens in camelCase or PascalCase
const extractTokens = (tokensObj) => {
    if (!tokensObj) return null;

    const accessTokenObj = tokensObj.accessToken ?? tokensObj.AccessToken;
    const refreshTokenObj = tokensObj.refreshToken ?? tokensObj.RefreshToken;

    const accessToken = accessTokenObj?.accessToken ?? accessTokenObj?.AccessToken;
    const accessTokenExpiresAt = accessTokenObj?.accessTokenExpiresAt ?? accessTokenObj?.AccessTokenExpiresAt;

    const refreshToken = refreshTokenObj?.refreshToken ?? refreshTokenObj?.RefreshToken;
    const refreshTokenExpiresAt = refreshTokenObj?.refreshTokenExpiresAt ?? refreshTokenObj?.RefreshTokenExpiresAt;

    if (!accessToken || !refreshToken) {
        return null;
    }

    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt
    };
};

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
            const normalized = normalizeLoginResponse(result);

            if (!normalized || !normalized.success) {
                const errorMsg = normalized?.message || 'Login failed. Please check your credentials.';
                if (normalized?.errors && normalized.errors.length > 0) {
                    normalized.errors.forEach(err => {
                        toast.error(typeof err === 'string' ? err : (err.message || err.Message || 'Validation error'));
                    });
                } else {
                    toast.error(errorMsg);
                }
                return;
            }

            if (normalized.requiresTwoFactor) {
                if (!normalized.twoFactorChallenge) {
                    toast.error('Two-factor challenge could not be started. Please try again.');
                    return;
                }

                const challenge = normalized.twoFactorChallenge;
                const challengeId = challenge.challengeId ?? challenge.ChallengeId;
                const provider = challenge.provider ?? challenge.Provider;
                const expiresAt = challenge.expiresAt ?? challenge.ExpiresAt;

                if (!challengeId) {
                    toast.error('Two-factor challenge could not be started. Please try again.');
                    return;
                }

                // Redirect to the separate 2FA page, passing challenge details in navigation state
                navigate('/auth/2fa', {
                    state: {
                        challenge: {
                            challengeId,
                            provider,
                            expiresAt
                        }
                    }
                });
            } else {
                // requiresTwoFactor === false
                const tokens = extractTokens(normalized.tokens);
                if (!tokens) {
                    toast.error('Login response is missing authentication tokens.');
                    return;
                }

                localStorage.setItem('token', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                await fetchUser();

                toast.success(normalized.message || 'Successfully logged in!');

                const queryParams = new URLSearchParams(location.search);
                const redirectPath = queryParams.get('redirect') || '/feed';

                navigate(redirectPath);
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('An unexpected error occurred during login. Please try again.');
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


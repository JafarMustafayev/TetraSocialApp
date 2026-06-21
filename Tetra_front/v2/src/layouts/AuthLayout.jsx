// src/layouts/AuthLayout.jsx
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    const token = localStorage.getItem('token');

    // If token exists, authenticated user should not access login/register pages
    if (token) {
        return <Navigate to="/feed" replace />;
    }

    return (
        <main className="auth-layout min-h-screen bg-transparent">
            <Outlet />
        </main>
    );
};

export default AuthLayout;

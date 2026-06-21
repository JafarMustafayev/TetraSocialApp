import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="profile-authentication-area">
            <Outlet />
        </div>
    );
};

export default AuthLayout;

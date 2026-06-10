import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';

const MainLayout = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Main container with max width and centered */}
            <div className="max-w-[1260px] mx-auto flex min-h-screen">

                {/* Navigation (Left Sidebar on Desktop, Bottom Bar on Mobile) */}
                <Navbar />

                {/* Content Area (Includes Feed and Right Widgets on specific pages) */}
                <main className="flex-1 min-w-0 flex pb-[60px] md:pb-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

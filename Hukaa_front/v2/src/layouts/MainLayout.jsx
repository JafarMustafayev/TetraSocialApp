import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import Sidebar from '../components/layout/Sidebar/Sidebar';

const MainLayout = () => {
    const token = localStorage.getItem('token');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="min-h-screen bg-transparent">
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="pt-[100px] flex px-4 lg:px-8 max-w-[1920px] mx-auto">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                
                <main className="flex-1 md:ml-[170px] transition-all duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

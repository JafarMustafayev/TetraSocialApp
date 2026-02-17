import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#F4F7FC] overflow-hidden transition-all duration-400 pt-[100px] pl-[175px] pr-[45px] pb-[50px]">
            <Navbar />
            <Sidebar />
            <div className="w-full h-full">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;

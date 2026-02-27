import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col min-h-screen bg-[#F4F7FC] overflow-hidden transition-all duration-400 pt-[95px] md:pt-[100px] md:pl-[175px] px-[15px] md:pr-[45px] pb-[10px]">
            <Navbar onMenuClick={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="w-full h-full">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;

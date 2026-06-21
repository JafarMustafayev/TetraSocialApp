import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ActivitiesSidebar from '../components/ActivitiesSidebar';

const SecondaryLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex flex-col min-h-screen bg-[#F4F7FC] transition-all duration-400 pt-[95px] md:pt-[100px] md:pl-[175px] lg:pl-[405px] px-[10px] md:px-[30px] lg:px-[45px] pb-[50px]">
            <Navbar onMenuClick={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <ActivitiesSidebar />
            <div className="w-full h-full">
                <Outlet />
            </div>
        </div>
    );
};

export default SecondaryLayout;

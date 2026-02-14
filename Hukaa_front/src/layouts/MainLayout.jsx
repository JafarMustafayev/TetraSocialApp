import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    return (
        <div className="main-content-wrapper d-flex flex-column">
            <Navbar />
            <Sidebar />
            <div className="content-page-box-area">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;

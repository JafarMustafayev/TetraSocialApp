import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-[#0b0d12]">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}


import { Navigate, Outlet } from 'react-router-dom';

const MainLayout = () => {
    const token = localStorage.getItem('token');

    // If no token exists, redirect to login page
    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <main className="main-layout min-h-screen bg-transparent">
            {/* You can add a Header or Sidebar here later */}
            <Outlet />
        </main>
    );
};

export default MainLayout;

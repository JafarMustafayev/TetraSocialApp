// src/layouts/MainLayout.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import BirthdayWidget from '../components/widgets/BirthdayWidget';
import SuggestedUsersWidget from '../components/widgets/SuggestedUsersWidget';

const MainLayout = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    // Paths that should NOT show the right sidebar widgets
    const noSidebarPaths = ['/messages', '/settings', '/apitester', '/websockettester'];
    const showSidebar = !noSidebarPaths.some(path => location.pathname.startsWith(path));

    return (
        <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Main container with max width and centered */}
            <div className="max-w-[1260px] mx-auto flex min-h-screen">

                {/* Navigation (Left Sidebar on Desktop, Bottom Bar on Mobile) */}
                <Navbar />

                {/* Content Area */}
                <main className="flex-1 min-w-0 flex pb-[60px] md:pb-0 justify-center">
                    {showSidebar ? (
                        <div className="flex justify-center w-full min-w-0">
                            {/* Main content wrapper */}
                            <div className="max-w-[700px] w-full min-w-0">
                                <Outlet />
                            </div>

                            {/* Persistent Right Sidebar */}
                            <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 pt-4 ms-2">
                                <div className="sticky top-4 space-y-4">
                                    <BirthdayWidget />
                                    <SuggestedUsersWidget count={5} />

                                    <footer className="px-4">
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                                            <button className="text-[13px] text-gray-500 hover:underline">Terms of Service</button>
                                            <button className="text-[13px] text-gray-500 hover:underline">Privacy Policy</button>
                                            <button className="text-[13px] text-gray-500 hover:underline">Accessibility</button>

                                        </div>
                                    </footer>
                                </div>

                            </aside>
                        </div>
                    ) : (
                        <div className="w-full">
                            <Outlet />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

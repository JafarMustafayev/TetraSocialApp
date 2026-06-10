import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const MobileProfileSheet = ({ isOpen, onClose, user, onLogout }) => {
    const [isClosing, setIsClosing] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsClosing(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Wait for the transition to finish
    };

    if (!isOpen && !isClosing) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-60 bg-black/50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
            ></div>

            {/* Bottom Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-70  bg-white dark:bg-black rounded-t-2xl shadow-2xl transition-transform duration-300 transform ${isClosing ? 'translate-y-full' : 'translate-y-0'}`}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                {/* Drag Handle */}
                <div className="flex justify-center p-3" onClick={handleClose}>
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
                </div>

                <div className="px-3 pb-3">
                    {/* User Info Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-main/10 flex items-center justify-center font-bold text-main shrink-0 text-lg">
                                {user?.username?.[0].toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900 dark:text-gray-100 text-[16px]">
                                    {user?.name}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-[14px]">
                                    @{user?.username || 'user'}
                                </span>
                            </div>
                        </div>
                        <Link to="/profile" className="text-[14px] font-medium text-main hover:underline" onClick={handleClose}>
                            Profile &rarr;
                        </Link>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col border-t border-gray-200 dark:border-neutral-700">
                        {/* Group 1 */}
                        <div className="py-1.5 border-b border-gray-200 dark:border-neutral-700">
                            <Link
                                to="/bookmarks"
                                className="flex items-center w-full gap-4 px-4 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                onClick={handleClose}
                            >
                                <i className="ri-bookmark-line text-xl text-gray-600 dark:text-gray-400 shrink-0"></i>
                                <span className="text-[16px] font-medium text-gray-900 dark:text-gray-100">Bookmarks</span>
                            </Link>
                        </div>

                        {/* Group 2 */}
                        <div className="py-1.5 border-b border-gray-200 dark:border-neutral-700">
                            <Link
                                to="/settings"
                                className="flex items-center w-full gap-4 px-4 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                onClick={handleClose}
                            >
                                <i className="ri-settings-3-line text-xl text-gray-600 dark:text-gray-400 shrink-0"></i>
                                <span className="text-[16px] font-medium text-gray-900 dark:text-gray-100">Settings</span>
                            </Link>

                            <button
                                onClick={toggleTheme}
                                className="flex items-center w-full gap-4 px-4 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors"
                            >
                                {theme === 'dark' ? (
                                    <>
                                        <i className="ri-sun-line text-xl text-gray-600 dark:text-gray-400 shrink-0"></i>
                                        <span className="text-[16px] font-medium text-gray-900 dark:text-gray-100">Light theme</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-moon-line text-xl text-gray-600 dark:text-gray-400 shrink-0"></i>
                                        <span className="text-[16px] font-medium text-gray-900 dark:text-gray-100">Dark theme</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Group 3 */}
                        <div className="py-1.5 border-b border-gray-200 dark:border-neutral-700">
                            <button
                                onClick={() => { handleClose(); onLogout(); }}
                                className="flex items-center w-full gap-4 px-4 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-neutral-900 transition-colors group"
                            >
                                <i className="ri-logout-box-r-line text-xl text-red-500 shrink-0 group-hover:text-red-600"></i>
                                <span className="text-[16px] font-medium text-red-500 group-hover:text-red-600">Log out</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center gap-4 mt-3 text-[13px]">
                        <Link to="/developer" className="hover:underline text-main dark:text-main">Developer</Link>
                        <Link to="/privacy" className="hover:underline text-main dark:text-main">Privacy</Link>
                        <Link to="/terms" className="hover:underline text-main dark:text-main">Terms</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileProfileSheet;

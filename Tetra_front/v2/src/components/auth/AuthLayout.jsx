// src/components/auth/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-white dark:bg-[#09090b] transition-colors duration-300 py-10 px-4 overflow-hidden">
            {/* Centered Dotted Background Pattern with fade mask */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] z-0 pointer-events-none opacity-60 dark:opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(circle, #9ca3af 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)'
                }}
            />

            {/* Content wrapper */}
            <div className="relative z-10 w-full max-w-[440px]">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;

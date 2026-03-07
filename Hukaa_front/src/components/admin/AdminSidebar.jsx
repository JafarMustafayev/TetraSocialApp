import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react';
import { LOGO } from '../../api/client';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/users', label: 'Users', icon: Users },
    { to: '/dashboard/posts', label: 'Posts', icon: FileText },
];

export default function AdminSidebar() {
    return (
        <aside className="w-64 min-h-screen bg-[#0f1629] border-r border-white/5 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <img src={LOGO} alt="Hukaa" className="h- w-30 object-contain" />

            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-4">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Back to App
                </NavLink>
            </div>
        </aside>
    );
}

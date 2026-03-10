import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, FileText, LayoutDashboard, ShieldCheck, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, LOGO } from '../../api/client';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/users', label: 'Users', icon: Users, end: false },
    { to: '/dashboard/posts', label: 'Posts', icon: FileText, end: false },
];

export default function AdminSidebar({ isOpen, onClose }) {
    const { logout } = useAuth();

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1117] border-r border-white/5 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0
        `}>
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
                <Link to="/" onClick={onClose}>
                    <img src={LOGO} alt="logo" className="w-32" />
                </Link>
                <button onClick={onClose} className="lg:hidden p-2 text-white/40 hover:text-white">
                    <ChevronRight className="rotate-180" size={20} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group border
                            ${isActive
                                ? 'bg-violet-600/20 text-violet-300 border-violet-500/20'
                                : 'text-white/40 hover:text-white/70 hover:bg-white/5 border-transparent'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon
                                    size={16}
                                    className={isActive ? 'text-violet-400' : 'text-white/30 group-hover:text-white/50'}
                                />
                                <span className="flex-1 text-left font-medium">{label}</span>
                                {isActive && <ChevronRight size={14} className="text-violet-400/60" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-white/5 space-y-1">
                <Link to="/" onClick={onClose}>
                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={16} />
                        <span>Go to site</span>
                    </button>
                </Link>
            </div>
        </aside>
    );
}

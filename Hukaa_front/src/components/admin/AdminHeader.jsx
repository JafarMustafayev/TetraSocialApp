import React from 'react';
import { Search, RefreshCw, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ title, searchQuery = '', setSearchQuery, showSearch = false, onRefresh, onMenuClick }) {
    const { user } = useAuth();
    const initials = user?.username
        ? user.username.slice(0, 1).toUpperCase()
        : 'A';

    return (
        <header className="h-16 bg-[#0f1117]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-white/40 hover:text-white lg:hidden border border-white/5 rounded-lg bg-white/5"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-white font-semibold text-sm lg:text-base whitespace-nowrap">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group"
                        title="Yenilə"
                    >
                        <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                )}

                {showSearch && (
                    <div className="relative group flex-1 max-w-[140px] sm:max-w-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Axtar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs lg:text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all w-full sm:w-52"
                        />
                    </div>
                )}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{initials}</span>
                </div>
            </div>
        </header>
    );
}

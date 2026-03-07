import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import UserRow from '../components/admin/UserRow';
import ConfirmModal from '../components/admin/ConfirmModal';
import { getAdminUsers, banUser, unbanUser } from '../api/admin';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [modal, setModal] = useState(null); // { type: 'ban'|'unban', user }
    const [actionLoading, setActionLoading] = useState(false);

    const load = useCallback(async (p = 1, q = search) => {
        setLoading(true);
        try {
            const data = await getAdminUsers(p, q);
            // Support both array and paginated object from backend
            const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
            setUsers(list);
            setHasMore(Array.isArray(data) ? list.length === 20 : (data?.hasNextPage ?? false));
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(1, ''); }, [load]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        load(1, search);
    };

    const handlePage = (dir) => {
        const next = page + dir;
        setPage(next);
        load(next, search);
    };

    const handleConfirm = async () => {
        if (!modal) return;
        setActionLoading(true);
        try {
            if (modal.type === 'ban') {
                await banUser(modal.user.id);
                setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, isBanned: true } : u));
            } else {
                await unbanUser(modal.user.id);
                setUsers(prev => prev.map(u => u.id === modal.user.id ? { ...u, isBanned: false } : u));
            }
            setModal(null);
        } catch { }
        setActionLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <AdminHeader title="Users" subtitle="Manage all registered users" />

            <main className="flex-1 p-8 overflow-y-auto">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all"
                        >
                            Search
                        </button>
                    </form>
                    <button
                        onClick={() => { setSearch(''); setPage(1); load(1, ''); }}
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-all"
                        title="Reset"
                    >
                        <RefreshCw size={15} />
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-500 text-sm">Loading…</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-500 text-sm">No users found.</td></tr>
                            ) : (
                                users.map(u => (
                                    <UserRow
                                        key={u.id}
                                        user={u}
                                        onBan={(user) => setModal({ type: 'ban', user })}
                                        onUnban={(user) => setModal({ type: 'unban', user })}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-3 border-t border-white/5">
                        <span className="text-slate-500 text-xs">Page {page}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePage(-1)}
                                disabled={page === 1 || loading}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => handlePage(1)}
                                disabled={!hasMore || loading}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={!!modal}
                title={modal?.type === 'ban' ? `Ban ${modal?.user?.username}?` : `Unban ${modal?.user?.username}?`}
                message={
                    modal?.type === 'ban'
                        ? `This will prevent ${modal?.user?.username} from accessing the platform. You can unban them at any time.`
                        : `This will restore ${modal?.user?.username}'s access to the platform.`
                }
                confirmLabel={modal?.type === 'ban' ? 'Ban User' : 'Unban User'}
                danger={modal?.type === 'ban'}
                onConfirm={handleConfirm}
                onCancel={() => setModal(null)}
                loading={actionLoading}
            />
        </div>
    );
}

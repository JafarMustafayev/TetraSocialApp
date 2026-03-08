import React, { useState } from 'react';
import UserRow from './UserRow';
import ConfirmModal from './ConfirmModal';

export default function UserTable({ users, loading, searchQuery, onToggleBan, onViewPosts, page, hasMore, onPage }) {

    const [pendingUser, setPendingUser] = useState(null);
    const isBanned = pendingUser?.isBanned;

    const filtered = (users ?? []).filter((u) => {
        const q = (searchQuery ?? '').toLowerCase();
        if (!q) return true;
        return (
            (u.username ?? '').toLowerCase().includes(q) ||
            (u.email ?? '').toLowerCase().includes(q)
        );
    });

    const handleBanClick = (user) => setPendingUser(user);
    const handleConfirm = () => {
        onToggleBan(pendingUser);
        setPendingUser(null);
    };

    return (
        <>
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
                {/* Table header info */}
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-end">

                    <div className="flex gap-3 text-xs text-white/30">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            Active: {(users ?? []).filter(u => !u.isBanned).length}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                            Ban: {(users ?? []).filter(u => u.isBanned).length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                {['User', 'Status', 'Joined', 'Posts', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3 text-left text-xs text-white/25 font-medium uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center text-white/25 text-sm">Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center text-white/25 text-sm">User not found</td>
                                </tr>
                            ) : (
                                filtered.map((user) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onToggleBan={handleBanClick}
                                        onViewPosts={onViewPosts}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                    <span className="text-white/30 text-xs">Page {page}</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPage(-1)}
                            disabled={page === 1 || loading}
                            className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => onPage(1)}
                            disabled={!hasMore || loading}
                            className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={!!pendingUser}
                onCancel={() => setPendingUser(null)}
                onConfirm={handleConfirm}
                title={isBanned ? 'Banı Qaldır' : 'İstifadəçini Ban Et'}
                message={
                    isBanned
                        ? `${pendingUser?.username} adlı istifadəçinin banını qaldırmaq istədiyinizə əminsiniz?`
                        : `${pendingUser?.username} adlı istifadəçini ban etmək istədiyinizə əminsiniz?`
                }
                confirmLabel={isBanned ? 'Bandan Aç' : 'Ban Et'}
                danger={!isBanned}
            />
        </>
    );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import UserTable from '../components/admin/UserTable';
import UserPostsDrawer from '../components/admin/UserPostsDrawer';
import { getAdminUsers, banUser, unbanUser } from '../api/admin';

export default function AdminUsers() {
    const { onMenuClick } = useOutletContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const load = useCallback(async (p = 1, q = '') => {
        setLoading(true);
        try {
            const result = await getAdminUsers(p, q);
            if (result?.success) {
                const list = result.data || [];
                setUsers(list);
                // Set hasMore to true if we have any data, allowing the user to click "Next"
                // and trigger the "check-before-update" logic.
                setHasMore(list.length > 0);
            } else {
                setUsers([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch admin users:", error);
            setUsers([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Consolidate initial load and debounced search
    useEffect(() => {
        if (!searchQuery) {
            load(1, '');
            setPage(1);
            return;
        }

        const timer = setTimeout(() => {
            setPage(1);
            load(1, searchQuery);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, load]);

    const handlePage = async (dir) => {
        if (dir === 1) { // Next
            setLoading(true);
            try {
                const result = await getAdminUsers(page + 1, searchQuery);
                if (result?.success && result.data?.length > 0) {
                    setUsers(result.data);
                    setPage(prev => prev + 1);
                    // If we got exactly 20 (or whatever the page limit is), there might be more
                    setHasMore(result.data.length === 20);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Pagination failed:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        } else { // Previous
            const prevPage = page - 1;
            if (prevPage < 1) return;
            setPage(prevPage);
            load(prevPage, searchQuery);
            setHasMore(true);
        }
    };

    const handleToggleBan = async (user) => {
        setActionLoading(true);
        try {
            if (user.isBanned) {
                await unbanUser(user.id);
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: false } : u));
            } else {
                await banUser(user.id);
                setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: true } : u));
            }
        } catch { }
        setActionLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <AdminHeader
                title="Users"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch
                onRefresh={() => load(1, searchQuery)}
                onMenuClick={onMenuClick}
            />
            <main className="flex-1 p-6 overflow-y-auto space-y-4">
                <UserTable
                    users={users}
                    loading={loading || actionLoading}
                    searchQuery=""
                    onToggleBan={handleToggleBan}
                    onViewPosts={(user) => setSelectedUser(user)}
                    page={page}
                    hasMore={hasMore}
                    onPage={handlePage}
                />
            </main>

            <UserPostsDrawer
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </div>
    );
}

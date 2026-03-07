import React, { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import PostRow from '../components/admin/PostRow';
import ConfirmModal from '../components/admin/ConfirmModal';
import { getAdminPosts, adminDeletePost } from '../api/admin';

export default function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [modal, setModal] = useState(null); // { post }
    const [actionLoading, setActionLoading] = useState(false);

    const load = useCallback(async (p = 1, q = '') => {
        setLoading(true);
        try {
            const data = await getAdminPosts(p, q);
            const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
            setPosts(list);
            setHasMore(Array.isArray(data) ? list.length === 20 : (data?.hasNextPage ?? false));
        } catch {
            setPosts([]);
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

    const handleDelete = async () => {
        if (!modal) return;
        setActionLoading(true);
        try {
            await adminDeletePost(modal.post.id);
            setPosts(prev => prev.filter(p => p.id !== modal.post.id));
            setModal(null);
        } catch { }
        setActionLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <AdminHeader title="Posts" subtitle="Review and moderate shared posts" />

            <main className="flex-1 p-8 overflow-y-auto">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by author or content…"
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Content</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Engagement</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-500 text-sm">Loading…</td></tr>
                            ) : posts.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-500 text-sm">No posts found.</td></tr>
                            ) : (
                                posts.map(p => (
                                    <PostRow
                                        key={p.id}
                                        post={p}
                                        onDelete={(post) => setModal({ post })}
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
                title="Delete this post?"
                message={`This action cannot be undone. The post by @${modal?.post?.user?.username} will be permanently removed.`}
                confirmLabel="Delete Post"
                danger
                onConfirm={handleDelete}
                onCancel={() => setModal(null)}
                loading={actionLoading}
            />
        </div>
    );
}

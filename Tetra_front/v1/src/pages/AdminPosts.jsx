import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import PostCard from '../components/admin/PostRow';
import ConfirmModal from '../components/admin/ConfirmModal';
import { getAdminPosts, adminDeletePost } from '../api/admin';

export default function AdminPosts() {
    const { onMenuClick } = useOutletContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [modal, setModal] = useState(null); // { post }
    const [deleteLoading, setDeleteLoading] = useState(false);

    const load = useCallback(async (p = 1, q = '') => {
        setLoading(true);
        try {
            const res = await getAdminPosts(p, q);
            if (res?.success) {
                const list = res.data || [];
                setPosts(list);
                // Simple logic: if we got exactly 10 (per page limit usually), there might be more
                // or if the backend provides total, we could use that.
                setHasMore(list.length >= 10);
            } else {
                setPosts([]);
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
            setPosts([]);
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
        const nextPage = page + dir;
        if (nextPage < 1) return;

        setLoading(true);
        try {
            const res = await getAdminPosts(nextPage, searchQuery);
            if (res?.success) {
                const list = res.data || [];
                if (list.length > 0 || dir === -1) {
                    setPosts(list);
                    setPage(nextPage);
                    setHasMore(list.length >= 10);
                } else {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Pagination failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!modal) return;
        setDeleteLoading(true);
        try {
            const res = await adminDeletePost(modal.post.id);
            if (res?.success || res === null) { // 204 returns null
                setPosts(prev => prev.filter(p => p.id !== modal.post.id));
                setModal(null);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0c10]">
            <AdminHeader
                title="Posts"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch
                onRefresh={() => load(1, searchQuery)}
                onMenuClick={onMenuClick}
            />
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-white/20 text-sm">Yüklənir...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                            <p className="text-white/20 text-sm">Paylaşım tapılmadı</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} onDelete={(p) => setModal({ post: p })} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.length > 0 && (
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <span className="text-white/30 text-xs font-medium bg-white/5 px-3 py-1 rounded-full">Səhifə {page}</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handlePage(-1)}
                                    disabled={page === 1 || loading}
                                    className="px-4 py-2 text-xs font-medium rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Əvvəlki
                                </button>
                                <button
                                    onClick={() => handlePage(1)}
                                    disabled={!hasMore || loading}
                                    className="px-4 py-2 text-xs font-medium rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Növbəti
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ConfirmModal
                isOpen={!!modal}
                title="Paylaşımı Sil"
                message="Bu paylaşımı silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
                confirmLabel="Bəli, Sil"
                danger
                onConfirm={handleDelete}
                onCancel={() => setModal(null)}
                loading={deleteLoading}
            />
        </div>
    );
}

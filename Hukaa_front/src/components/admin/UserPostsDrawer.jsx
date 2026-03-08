import React, { useState, useEffect } from 'react';
import { X, Trash2, Heart, Calendar, Loader, MessageCircle, Share2, Image as ImageIcon, Layers } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { getAdminUserPosts, adminDeletePost } from '../../api/admin';
import { IMAGE_BASE_URL } from '../../api/client';
import ImageGalleryPopup from '../Popups/ImageGalleryPopup';

export default function UserPostsDrawer({ user, onClose, onPostDeleted }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [galleryState, setGalleryState] = useState({ isOpen: false, media: [] });

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        setPosts([]);
        getAdminUserPosts(user.id)
            .then((res) => {
                if (res?.success) {
                    setPosts(res.data || []);
                } else {
                    setPosts([]);
                }
            })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleteLoading(true);
        try {
            const res = await adminDeletePost(pendingDelete.id);
            if (res?.success || res === null) {
                setPosts((prev) => prev.filter((p) => p.id !== pendingDelete.id));
                if (onPostDeleted) onPostDeleted(pendingDelete.id);
                setPendingDelete(null);
            }
        } catch { }
        setDeleteLoading(false);
    };

    const initials = (user.userName || user.username || '?').slice(0, 2).toUpperCase();

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 z-40 w-[460px] bg-[#0a0c10] border-l border-white/5 flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0f1117]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold overflow-hidden">
                            {user.profilePicture
                                ? <img src={`${IMAGE_BASE_URL}/${user.profilePicture}`} alt={initials} className="w-full h-full object-cover" />
                                : initials
                            }
                        </div>
                        <div>
                            <p className="text-white font-semibold flex items-center gap-1.5">
                                @{user.userName || user.username}
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-white/40 text-xs font-normal">Posts</span>
                            </p>
                            <p className="text-white/20 text-xs mt-0.5">{loading ? 'Loading...' : `${posts.length} posts`}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 transition-all border border-white/5"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Posts list */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-white/20 text-xs">Loading...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                            <p className="text-white/20 text-sm">No posts were made.</p>
                        </div>
                    ) : (
                        posts.map((post) => {
                            const content = post.content ?? '';
                            const date = post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString('az-AZ', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })
                                : '—';

                            const reactions = post.totalReactionCount ?? 0;
                            const comments = post.commentCount ?? 0;
                            const shares = post.shareCount ?? 0;

                            // Map postFiles to gallery format
                            const media = (post.postFiles || []).map(f => ({
                                type: f.fileType === 1 ? 'image' : 'video',
                                url: `${IMAGE_BASE_URL}/${f.filePath}`
                            }));

                            const firstImage = media.find(m => m.type === 'image')?.url;
                            const hasMultipleMedia = media.length > 1;

                            return (
                                <div
                                    key={post.id}
                                    className="bg-[#0f1117] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group"
                                >
                                    <div className="flex gap-4">
                                        {/* Thumb */}
                                        <div
                                            onClick={() => media.length > 0 && setGalleryState({ isOpen: true, media })}
                                            className={`w-16 h-16 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden border border-white/5 relative ${media.length > 0 ? 'cursor-pointer' : ''}`}
                                        >
                                            {firstImage ? (
                                                <img
                                                    src={firstImage}
                                                    alt="Post"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}

                                            {/* Multi-image indicator */}
                                            {hasMultipleMedia && (
                                                <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md px-1 py-0.5 rounded-md border border-white/10 flex items-center gap-0.5 shadow-lg">
                                                    <Layers size={8} className="text-blue-400" />
                                                    <span className="text-[8px] text-white font-bold">+{media.length - 1}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-white/60 text-xs line-clamp-2 leading-relaxed italic">
                                                    {content || "Mətn yoxdur"}
                                                </p>
                                                <button
                                                    onClick={() => setPendingDelete(post)}
                                                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all shrink-0 border border-red-500/10"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-3 text-white/20">
                                                    <div className="flex items-center gap-1 text-[10px]">
                                                        <Heart size={11} className={reactions > 0 ? "text-red-500/50" : ""} />
                                                        <span>{reactions}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px]">
                                                        <MessageCircle size={11} className={comments > 0 ? "text-blue-500/50" : ""} />
                                                        <span>{comments}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-white/20 text-[10px]">
                                                    <Calendar size={10} />
                                                    <span>{date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!pendingDelete}
                onCancel={() => setPendingDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Paylaşımı Sil"
                message="Bu paylaşımı silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz."
                confirmLabel="Bəli, Sil"
                danger
                loading={deleteLoading}
            />

            <ImageGalleryPopup
                isOpen={galleryState.isOpen}
                onClose={() => setGalleryState({ isOpen: false, media: [] })}
                media={galleryState.media}
                initialIndex={0}
            />
        </>
    );
}

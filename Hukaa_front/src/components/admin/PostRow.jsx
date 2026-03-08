import React, { useState } from 'react';
import { Trash2, Heart, Calendar, User, MessageCircle, Share2, Image as ImageIcon, Layers } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../api/client';
import ImageGalleryPopup from '../Popups/ImageGalleryPopup';

export default function PostCard({ post, onDelete }) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    // New API Shape
    const author = post.userName ?? 'Unknown';
    const content = post.content ?? '';
    const date = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('az-AZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
        <>
            <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group">
                <div className="flex gap-4">
                    {/* Image Preview */}
                    <div
                        onClick={() => media.length > 0 && setIsGalleryOpen(true)}
                        className={`w-24 h-24 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden border border-white/5 relative ${media.length > 0 ? 'cursor-pointer' : ''}`}
                    >
                        {firstImage ? (
                            <img
                                src={firstImage}
                                alt="Post"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                <ImageIcon size={24} />
                            </div>
                        )}

                        {/* Multi-image indicator */}
                        {hasMultipleMedia && (
                            <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md px-1.5 py-1 rounded-lg border border-white/10 flex items-center gap-1 shadow-lg">
                                <Layers size={10} className="text-blue-400" />
                                <span className="text-[9px] text-white font-bold">+{media.length - 1}</span>
                            </div>
                        )}

                        {/* Zoom Overlay on Hover */}
                        {media.length > 0 && (
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg">
                                    <ImageIcon size={14} className="text-white" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between">
                                <h3 className="text-white/80 text-sm font-semibold flex items-center gap-2">
                                    <User size={13} className="text-blue-400/60" />
                                    @{author}
                                </h3>
                                <button
                                    onClick={() => onDelete(post)}
                                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all shrink-0"
                                    title="Sil"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <p className="text-white/40 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                {content || <span className="italic opacity-50">Mətn yoxdur</span>}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-4 text-white/25">
                                <div className="flex items-center gap-1.5 text-[11px]">
                                    <Heart size={12} className={reactions > 0 ? "text-red-500/50" : ""} />
                                    <span>{reactions}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px]">
                                    <MessageCircle size={12} className={comments > 0 ? "text-blue-500/50" : ""} />
                                    <span>{comments}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px]">
                                    <Share2 size={12} className={shares > 0 ? "text-green-500/50" : ""} />
                                    <span>{shares}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-white/20 text-[10px]">
                                <Calendar size={11} />
                                <span>{date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ImageGalleryPopup
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                media={media}
                initialIndex={0}
            />
        </>
    );
}

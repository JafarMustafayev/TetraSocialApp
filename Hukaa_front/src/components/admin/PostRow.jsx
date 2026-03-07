import { Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';
import moment from 'moment';

export default function PostRow({ post, onDelete }) {
    const avatar = post.user?.profileImageUrl
        ? `${IMAGE_BASE_URL}${post.user.profileImageUrl}`
        : USER_AVATAR;

    const preview = post.content
        ? post.content.length > 80 ? post.content.slice(0, 77) + '…' : post.content
        : '—';

    return (
        <tr className="border-b border-white/5 hover:bg-white/3 transition-colors group">
            {/* Author */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <img
                        src={avatar}
                        alt={post.user?.username}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10 shrink-0"
                        onError={(e) => { e.target.src = USER_AVATAR; }}
                    />
                    <div>
                        <p className="text-white text-sm font-medium leading-none">{post.user?.fullName || post.user?.username || 'Unknown'}</p>
                        <p className="text-slate-500 text-xs mt-0.5">@{post.user?.username}</p>
                    </div>
                </div>
            </td>

            {/* Content preview */}
            <td className="px-6 py-4 text-slate-400 text-sm max-w-xs">
                <p className="truncate">{preview}</p>
                {post.mediaUrls?.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <ImageIcon size={11} />
                        {post.mediaUrls.length} media
                    </span>
                )}
            </td>

            {/* Engagement */}
            <td className="px-6 py-4 hidden lg:table-cell">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>❤️ {post.reactionCount ?? 0}</span>
                    <span>💬 {post.commentCount ?? 0}</span>
                </div>
            </td>

            {/* Date */}
            <td className="px-6 py-4 text-slate-500 text-xs hidden md:table-cell whitespace-nowrap">
                {moment(post.createdAt).format('DD MMM YYYY')}
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                        href={`/posts/${post.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="View post"
                    >
                        <ExternalLink size={14} />
                    </a>
                    <button
                        onClick={() => onDelete(post)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                    >
                        <Trash2 size={13} />
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
}

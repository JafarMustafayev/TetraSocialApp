import React from 'react';
import { ShieldBan, ShieldCheck, ExternalLink } from 'lucide-react';
import { IMAGE_BASE_URL, USER_AVATAR } from '../../api/client';

export default function UserRow({ user, onBan, onUnban }) {
    const avatar = user.profileImageUrl
        ? `${IMAGE_BASE_URL}${user.profileImageUrl}`
        : USER_AVATAR;

    return (
        <tr className="border-b border-white/5 hover:bg-white/3 transition-colors group">
            {/* Avatar + Name */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <img
                        src={avatar}
                        alt={user.username}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10"
                        onError={(e) => { e.target.src = USER_AVATAR; }}
                    />
                    <div>
                        <p className="text-white text-sm font-medium leading-none">{user.fullName || user.username}</p>
                        <p className="text-slate-500 text-xs mt-0.5">@{user.username}</p>
                    </div>
                </div>
            </td>

            {/* Email */}
            <td className="px-6 py-4 text-slate-400 text-sm hidden md:table-cell">{user.email}</td>

            {/* Role */}
            <td className="px-6 py-4 hidden lg:table-cell">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {user.role || 'User'}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                {user.isBanned ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        Banned
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                    </span>
                )}
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                        href={`/profile/${user.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        title="View profile"
                    >
                        <ExternalLink size={14} />
                    </a>
                    {user.isBanned ? (
                        <button
                            onClick={() => onUnban(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                        >
                            <ShieldCheck size={13} />
                            Unban
                        </button>
                    ) : (
                        <button
                            onClick={() => onBan(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                        >
                            <ShieldBan size={13} />
                            Ban
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

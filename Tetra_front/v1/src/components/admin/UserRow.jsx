import React from 'react';
import { ShieldCheck, ShieldOff, Eye } from 'lucide-react';
import Badge from './Badge';
import { IMAGE_BASE_URL } from '../../api/client';

export default function UserRow({ user, onToggleBan, onViewPosts }) {
    const isBanned = user.isBanned;
    const initials = (user.userName || user.username || user.name || '?').slice(0, 2).toUpperCase();

    return (
        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
            {/* User */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        ${isBanned ? 'bg-red-500/20 text-red-300' : 'bg-violet-500/20 text-violet-300'}`}>
                        {user.profilePicture
                            ? <img src={`${IMAGE_BASE_URL}/${user.profilePicture}`} alt={initials} className="w-full h-full rounded-full object-cover" />
                            : initials
                        }
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${isBanned ? 'text-white/40 line-through' : 'text-white/80'}`}>
                            {user.userName || user.username || user.name}
                        </p>
                        <p className="text-white/30 text-xs">{user.email}</p>
                    </div>
                </div>
            </td>



            {/* Status */}
            <td className="px-5 py-4">
                <Badge label={isBanned ? 'Ban' : 'Active'} variant={isBanned ? 'banned' : 'active'} />
            </td>

            {/* Join date */}
            <td className="px-5 py-4 text-white/30 text-xs">
                {user.createAt || user.createdAt ? new Date(user.createAt || user.createdAt).toLocaleDateString('az-AZ') : user.joinDate ?? '—'}
            </td>

            {/* Posts */}
            <td className="px-5 py-4">
                {onViewPosts ? (
                    <button
                        onClick={() => onViewPosts(user)}
                        className="text-white/30 text-sm hover:text-violet-400 transition-colors flex items-center gap-1.5 group/btn"
                    >
                        <span className="group-hover/btn:underline">{user.postsCount ?? user.postCount ?? 'View'}</span>
                        <Eye size={12} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                ) : (
                    <span className="text-white/30 text-sm">{user.postsCount ?? user.postCount ?? '—'}</span>
                )}
            </td>

            {/* Action */}
            <td className="px-5 py-4">
                <button
                    onClick={() => onToggleBan(user)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all
                        ${isBanned
                            ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                        }`}
                >
                    {isBanned
                        ? <><ShieldCheck size={13} /> Unban</>
                        : <><ShieldOff size={13} /> Ban</>
                    }
                </button>
            </td>
        </tr>
    );
}

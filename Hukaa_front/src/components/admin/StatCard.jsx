import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, color = 'indigo', trend }) {
    const colorMap = {
        indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
        rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-400',
        emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
        amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
    };

    return (
        <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-medium">{label}</span>
                <span className={`p-2 rounded-xl bg-white/5 ${colorMap[color].split(' ').at(-1)}`}>
                    <Icon size={18} />
                </span>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-white font-heading font-bold text-3xl">{value ?? '—'}</p>
                {trend !== undefined && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <TrendingUp size={13} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

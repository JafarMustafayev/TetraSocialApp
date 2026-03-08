import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'violet', sub }) {
    const colorMap = {
        violet: 'from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-400',
        emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
        red: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400',
        rose: 'from-red-500/20 to-red-600/5 border-red-500/20 text-red-400',
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
        amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
        indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
    };

    const cls = colorMap[color] ?? colorMap.violet;
    const iconColor = cls.split(' ').pop(); // last class is the text color

    return (
        <div className={`bg-gradient-to-br ${cls} border rounded-xl p-5 flex items-start gap-4`}>
            <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${iconColor}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{value ?? '—'}</p>
                {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
            </div>
        </div>
    );
}

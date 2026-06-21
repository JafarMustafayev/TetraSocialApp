import React from 'react';

const variants = {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    banned: 'bg-red-500/15 text-red-400 border-red-500/20',
    default: 'bg-white/5 text-white/40 border-white/10',
};

export default function Badge({ label, variant = 'default' }) {
    const cls = variants[variant?.toLowerCase()] ?? variants.default;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
            {label}
        </span>
    );
}

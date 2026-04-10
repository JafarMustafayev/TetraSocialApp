import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmLabel = 'Confirm',
    danger = false,
    loading = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-[#161920] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
                >
                    <X size={16} />
                </button>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${danger ? 'bg-red-500/15' : 'bg-violet-500/15'}`}>
                    <AlertTriangle size={22} className={danger ? 'text-red-400' : 'text-violet-400'} />
                </div>

                <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
                <p className="text-white/40 text-sm mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/50 text-sm hover:bg-white/5 hover:text-white/70 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${danger
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-violet-600 hover:bg-violet-500 text-white'
                            }`}
                    >
                        {loading ? 'Loading...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Modal */}
            <div className="relative bg-[#161d35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-zoom-in">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <X size={16} />
                </button>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${danger ? 'bg-rose-500/10' : 'bg-indigo-500/10'}`}>
                    <AlertTriangle size={22} className={danger ? 'text-rose-400' : 'text-indigo-400'} />
                </div>

                <h3 className="text-white font-heading font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60 ${danger
                                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                    >
                        {loading ? 'Processing…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

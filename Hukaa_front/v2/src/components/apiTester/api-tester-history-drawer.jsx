// src/components/api-tester-history-drawer.jsx
import React from 'react';
import { History, X, Play, Pin, Trash2 } from 'lucide-react';
import { METHOD_COLORS } from '../../utils/api-tester/api-tester-constants';
import { getStatusStyle } from '../../utils/api-tester/api-tester-utils';

const HistoryDrawer = ({
    historyOpen,
    setHistoryOpen,
    history,
    clearAllHistory,
    loadFromHistory,
    handleSendRequest,
    togglePinHistoryItem,
    deleteHistoryItem
}) => {
    return (
        <>
            {/* Sliding Overlay Drawer for History */}
            <div
                className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-[#09090b] border-r border-gray-200 dark:border-neutral-900 shadow-2xl z-60 transform transition-transform duration-300 ease-out flex flex-col ${historyOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-gray-200 dark:border-neutral-900 flex items-center justify-between bg-gray-55/50 dark:bg-neutral-950/30">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-gray-500 dark:text-zinc-400 flex items-center gap-2">
                        <History className="h-4 w-4 text-main" /> History Log
                    </span>
                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                            <button
                                onClick={clearAllHistory}
                                className="text-[10px] text-gray-400 hover:text-rose-500 font-bold hover:underline transition-colors cursor-pointer"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={() => setHistoryOpen(false)}
                            className="p-1 rounded-lg hover:bg-gray-150 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* History list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-slate-50/10 dark:bg-neutral-950/10">
                    {history.map((item, idx) => {
                        const mColor = METHOD_COLORS[item.method] || { text: 'text-gray-500', bg: 'bg-gray-500/10' };
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    loadFromHistory(item);
                                    setHistoryOpen(false);
                                }}
                                className="group relative flex flex-col p-3 rounded-xl border border-gray-200/60 dark:border-neutral-900 bg-white dark:bg-neutral-900/60 hover:bg-white hover:border-gray-300 dark:hover:bg-neutral-900 hover:shadow-sm cursor-pointer transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span className={`text-[9px] font-extrabold w-11 text-center shrink-0 uppercase py-0.5 rounded-md border ${mColor.bg} ${mColor.text} ${mColor.border}`}>
                                            {item.method}
                                        </span>
                                        <span className="text-xs font-mono font-semibold text-gray-700 dark:text-zinc-300 truncate">
                                            {item.url.replace(/^https?:\/\//, '')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 z-10">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                loadFromHistory(item);
                                                handleSendRequest();
                                                setHistoryOpen(false);
                                            }}
                                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-emerald-500"
                                            title="Repeat request immediately"
                                        >
                                            <Play className="h-3 w-3 fill-current" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => togglePinHistoryItem(e, idx)}
                                            className={`p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 ${item.pinned ? 'text-amber-500' : 'text-gray-400'}`}
                                            title={item.pinned ? 'Unpin request' : 'Pin request'}
                                        >
                                            <Pin className={`h-3 w-3 ${item.pinned ? 'fill-current' : ''}`} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => deleteHistoryItem(e, idx)}
                                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-rose-500"
                                            title="Delete from history"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                                    <span>{item.timestamp}</span>
                                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${item.statusCode === 'ERR'
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        : getStatusStyle(item.statusCode)
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {history.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-zinc-500 space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-850 flex items-center justify-center shadow-inner">
                                <History className="h-6 w-6 opacity-30 text-gray-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider">No history recorded</p>
                                <p className="text-[10px] max-w-[200px] mx-auto">Trigger client requests to populate your history panel.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Backdrop overlay for history drawer */}
            {historyOpen && (
                <div
                    onClick={() => setHistoryOpen(false)}
                    className="fixed inset-0 bg-neutral-950/30 backdrop-blur-sm z-55 transition-all duration-300"
                />
            )}
        </>
    );
};

export default HistoryDrawer;

// src/components/apiTester/api-tester-headers-tab.jsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const HeadersTab = ({ headers, addHeader, updateHeader, removeHeader }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Headers Editor</span>
                <button
                    type="button"
                    onClick={addHeader}
                    className="text-[11px] text-main font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <Plus className="h-3.5 w-3.5" /> Add Row
                </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 select-text">
                {headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-55/30 dark:bg-neutral-900/10 p-1.5 rounded-xl border border-gray-200/50 dark:border-neutral-850">
                        <input
                            type="checkbox"
                            checked={h.active}
                            onChange={(e) => updateHeader(i, 'active', e.target.checked)}
                            className="w-4 h-4 rounded text-main border-gray-300 dark:border-neutral-700 accent-main cursor-pointer shrink-0 ml-1"
                        />
                        <input
                            type="text"
                            value={h.key}
                            onChange={(e) => updateHeader(i, 'key', e.target.value)}
                            placeholder="Key"
                            className="flex-1 h-9 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-3 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                        />
                        <input
                            type="text"
                            value={h.value}
                            onChange={(e) => updateHeader(i, 'value', e.target.value)}
                            placeholder="Value"
                            className="flex-1 h-9 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-3 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                        />
                        <button
                            type="button"
                            onClick={() => removeHeader(i)}
                            className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-150 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                {headers.length === 0 && (
                    <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-gray-200 dark:border-neutral-850 rounded-xl">
                        No request headers defined. Click "Add Row" to build parameters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeadersTab;

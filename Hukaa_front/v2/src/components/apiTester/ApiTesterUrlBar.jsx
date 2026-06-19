// src/components/apiTester/ApiTesterUrlBar.jsx
import React from 'react';
import { X, Check, Copy, RefreshCw, Send } from 'lucide-react';
import { METHOD_COLORS } from '../../utils/api/apiTesterConstants';

const UrlBar = ({
    method,
    setMethod,
    methodDropdownOpen,
    setMethodDropdownOpen,
    url,
    handleUrlChange,
    clearUrl,
    copyUrl,
    copiedUrl,
    handleSendRequest,
    loading
}) => {
    return (
        <div className="p-5 bg-white/40 dark:bg-neutral-950/20 shrink-0">
            <div className="bg-white dark:bg-neutral-905 border border-gray-200/60 dark:border-neutral-900 rounded-2xl p-4 shadow-sm relative group">
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* HTTP Method select badge */}
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
                            className={`w-full sm:w-[130px] h-12 rounded-xl border border-gray-200/70 dark:border-neutral-880 bg-gray-55 dark:bg-neutral-900/80 flex items-center justify-between px-4 font-bold text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer ${METHOD_COLORS[method]?.text}`}
                        >
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${METHOD_COLORS[method]?.dot}`} />
                                {method}
                            </span>
                            <span className="text-gray-400 text-xs">▼</span>
                        </button>

                        {methodDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1.5 w-full bg-white dark:bg-[#121316] border border-gray-200 dark:border-neutral-800 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-fade-in">
                                {Object.keys(METHOD_COLORS).map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => {
                                            setMethod(m);
                                            setMethodDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 ${METHOD_COLORS[m].text}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${METHOD_COLORS[m].dot}`} />
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* URL Entry */}
                    <div className="flex-1 relative flex items-center">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://api.example.com/users"
                            required
                            autoFocus
                            className="w-full h-12 bg-gray-50 dark:bg-neutral-900/85 border border-gray-200/70 dark:border-neutral-800 rounded-xl pl-4 pr-16 text-xs font-mono focus:outline-none focus:border-main focus:ring-2 focus:ring-main/10 transition-all duration-200 text-gray-800 dark:text-zinc-200"
                        />

                        {/* URL Helper actions inside input bar */}
                        <div className="absolute right-2.5 flex items-center gap-1.5">
                            {url && (
                                <button
                                    type="button"
                                    onClick={clearUrl}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200/50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                                    title="Clear url"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={copyUrl}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200/50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
                                title="Copy url"
                            >
                                {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Action button */}
                    <button
                        type="button"
                        id="api-tester-send-btn"
                        onClick={handleSendRequest}
                        disabled={loading}
                        className="bg-main text-white h-12 px-7 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-main-hover hover:shadow-lg hover:shadow-main/20 active:scale-[0.98] transition-all disabled:opacity-50 shrink-0 shadow-sm cursor-pointer"
                    >
                        {loading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        <span className="text-xs uppercase font-extrabold tracking-wider">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrlBar;

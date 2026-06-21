// src/components/apiTester/ApiTesterResponsePanel.jsx
import React from 'react';
import { RefreshCcw, AlertCircle, Play, Clock, Database, Download, Copy, Check } from 'lucide-react';
import { getStatusStyle, highlightJson } from '../../utils/api/apiTesterUtils';

const ResponsePanel = ({
    loading,
    error,
    response,
    activeResponseTab,
    setActiveResponseTab,
    jsonExpanded,
    setJsonExpanded,
    copiedResponse,
    copyResponse,
    downloadResponse
}) => {
    return (
        <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden min-h-0 bg-white dark:bg-neutral-950 p-5 divide-y divide-gray-250/30 dark:divide-neutral-900/30 gap-4">
            <h2 className="text-sm font-extrabold flex items-center gap-2 pb-3 shrink-0 uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
                Response Viewer
            </h2>

            {/* Loading View (Skeleton panel representation) */}
            {loading && (
                <div className="flex-1 flex flex-col justify-center items-center py-16 space-y-4">
                    <div className="relative flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main" />
                        <RefreshCcw className="h-4 w-4 text-main absolute animate-pulse" />
                    </div>
                    <div className="text-center space-y-1 animate-pulse">
                        <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">Resolving target handshake...</p>
                        <p className="text-[11px] text-gray-400">Awaiting remote endpoint response buffer</p>
                    </div>

                    {/* Skeleton visual cards */}
                    <div className="w-full max-w-md space-y-3 pt-6 shrink-0 opacity-40">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-855 rounded-lg w-1/3 animate-pulse" />
                        <div className="h-20 bg-gray-200 dark:bg-neutral-855 rounded-xl animate-pulse" />
                        <div className="h-10 bg-gray-200 dark:bg-neutral-855 rounded-xl animate-pulse" />
                    </div>
                </div>
            )}

            {/* Error Handling Card */}
            {!loading && error && (
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 space-y-4 min-h-0 overflow-y-auto">
                    <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl p-4 shadow-sm">
                        <AlertCircle className="h-10 w-10 animate-bounce" />
                    </div>
                    <div className="text-center space-y-2 max-w-md select-text">
                        <h3 className="font-extrabold text-rose-500 text-sm uppercase tracking-wider">Connection Failure</h3>
                        <p className="text-[10px] font-mono text-rose-600 bg-rose-500/5 dark:bg-rose-955/20 border border-rose-500/20 rounded-xl p-3 break-all max-h-[120px] overflow-y-auto custom-scrollbar">
                            {error}
                        </p>

                        {/* Troubleshooting tips */}
                        <div className="text-[10px] text-gray-500 dark:text-zinc-400 bg-gray-55 dark:bg-[#111216]/40 p-3.5 rounded-xl border border-main/60 text-left space-y-1">
                            <span className="font-extrabold text-gray-600 dark:text-zinc-350 block mb-1">Troubleshooting Checklist:</span>
                            <p>• Check if the target server address is running correctly.</p>
                            <p>• If testing local services (e.g. localhost), verify the port number.</p>
                            <p>• Make sure CORS (Cross-Origin Resource Sharing) is enabled in your backend configs. Browser extensions or local server overrides may block requests otherwise.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Default Idle State */}
            {!loading && !response && !error && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-gray-400 dark:text-zinc-500 space-y-3">
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 dark:bg-[#111216]/50 border border-gray-200/50 dark:border-neutral-900 flex items-center justify-center shadow-inner">
                        <Play className="h-6 w-6 text-gray-300 dark:text-neutral-700 fill-gray-150/40" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Response Panel Idle</p>
                        <p className="text-[10px] max-w-[240px] text-gray-400 dark:text-zinc-500 mx-auto">
                            Send a request to see the response. Enter url and headers parameters and press enter.
                        </p>
                    </div>

                    {/* Shortcut guidelines info */}
                    <div className="pt-8 text-[9px] font-bold text-gray-400/70 space-y-1">
                        <p>Ctrl + Enter : Send Request</p>
                        <p>Ctrl + Shift + H : Toggle History</p>
                        <p>Ctrl + Shift + L : Toggle View Layout</p>
                    </div>
                </div>
            )}

            {/* Successful Response Inspector UI */}
            {!loading && response && (
                <div className="flex-1 flex flex-col space-y-4 min-h-0 pt-3">

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-3 gap-3 shrink-0">
                        <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-200/50 dark:border-neutral-900 rounded-xl p-2.5 flex flex-col shadow-sm">
                            <span className="text-[8px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-505 uppercase">Status Code</span>
                            <span className={`text-xs font-bold mt-1 text-center py-0.5 rounded-md border ${getStatusStyle(response.status)}`}>
                                {response.status} {response.statusText}
                            </span>
                        </div>
                        <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-200/50 dark:border-neutral-900 rounded-xl p-2.5 flex flex-col shadow-sm">
                            <span className="text-[8px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-505 uppercase">Response Time</span>
                            <span className="text-xs font-extrabold mt-1 text-main flex items-center justify-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {response.time} ms
                            </span>
                        </div>
                        <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-200/50 dark:border-neutral-900 rounded-xl p-2.5 flex flex-col shadow-sm">
                            <span className="text-[8px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-550 uppercase">Payload Size</span>
                            <span className="text-xs font-extrabold mt-1 text-emerald-500 flex items-center justify-center gap-1">
                                <Database className="h-3.5 w-3.5" />
                                {response.size}
                            </span>
                        </div>
                    </div>

                    {/* Response tabs selectors */}
                    <div className="flex border-b border-gray-200/60 dark:border-neutral-900 gap-6 text-[10px] uppercase font-bold tracking-wider shrink-0 pt-1">
                        {[
                            { id: 'body', label: 'Body' },
                            { id: 'headers', label: `Headers (${Object.keys(response.headers).length})` },
                            { id: 'cookies', label: `Cookies (${response.cookies?.length || 0})` },
                            { id: 'raw', label: 'Raw Output' }
                        ].map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setActiveResponseTab(t.id)}
                                className={`pb-2.5 font-extrabold transition-all relative cursor-pointer ${activeResponseTab === t.id
                                    ? 'text-main'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-350'
                                    }`}
                            >
                                {t.label}
                                {activeResponseTab === t.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Body Contents */}
                    <div className="flex-1 min-h-0 relative select-text">

                        {/* Response Body Tab */}
                        {activeResponseTab === 'body' && (
                            <div className="h-full flex flex-col min-h-0 relative">

                                {/* Code Actions bar (Copy & Download & Toggle format) */}
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                                    {response.isJson && (
                                        <button
                                            type="button"
                                            onClick={() => setJsonExpanded(!jsonExpanded)}
                                            className="bg-white/95 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-800 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-505 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white shadow-sm text-[9px] font-extrabold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                                        >
                                            {jsonExpanded ? 'Minify Raw' : 'Prettify JSON'}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={copyResponse}
                                        className="bg-white/95 dark:bg-neutral-900/95 hover:bg-white dark:hover:bg-neutral-800 p-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-505 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white shadow-sm flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                                    >
                                        {copiedResponse ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                                <span className="text-emerald-500">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5 text-gray-400" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={downloadResponse}
                                        className="bg-white/95 dark:bg-neutral-900/95 hover:bg-white dark:hover:bg-neutral-800 p-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-505 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white shadow-sm flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                                        title="Download file output"
                                    >
                                        <Download className="h-3.5 w-3.5 text-gray-400" />
                                        <span>Download</span>
                                    </button>
                                </div>

                                {/* Output code viewer */}
                                {response.isJson ? (
                                    jsonExpanded ? (
                                        <pre
                                            className="flex-1 overflow-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-4 font-mono text-[11px] leading-relaxed custom-scrollbar shadow-inner"
                                            dangerouslySetInnerHTML={{ __html: highlightJson(JSON.stringify(response.data, null, 2)) }}
                                        />
                                    ) : (
                                        <pre className="flex-1 overflow-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-4 font-mono text-[11px] leading-relaxed custom-scrollbar shadow-inner text-emerald-400">
                                            <code>{JSON.stringify(response.data)}</code>
                                        </pre>
                                    )
                                ) : (
                                    <pre className="flex-1 overflow-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-4 font-mono text-[11px] leading-relaxed custom-scrollbar shadow-inner text-zinc-300">
                                        <code>{response.data}</code>
                                    </pre>
                                )}
                            </div>
                        )}

                        {/* Response Headers Tab */}
                        {activeResponseTab === 'headers' && (
                            <div className="h-full overflow-auto bg-gray-55/40 dark:bg-neutral-900/20 border border-gray-200/70 dark:border-neutral-850 rounded-2xl divide-y divide-gray-200/50 dark:divide-neutral-850/50 custom-scrollbar">
                                {Object.entries(response.headers).map(([key, val]) => (
                                    <div key={key} className="flex gap-4 p-3 text-[11px] font-mono leading-relaxed">
                                        <span className="w-1/3 text-gray-450 dark:text-zinc-500 font-bold select-none truncate shrink-0">{key}</span>
                                        <span className="flex-1 text-gray-700 dark:text-zinc-300 break-all">{val}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Response Cookies Tab */}
                        {activeResponseTab === 'cookies' && (
                            <div className="h-full overflow-auto bg-gray-55/40 dark:bg-neutral-900/20 border border-gray-200/70 dark:border-neutral-850 rounded-2xl divide-y divide-gray-200/50 dark:divide-neutral-850/50 custom-scrollbar">
                                {response.cookies && response.cookies.length > 0 ? (
                                    response.cookies.map((cookie, idx) => (
                                        <div key={idx} className="flex gap-4 p-3 text-[11px] font-mono leading-relaxed">
                                            <span className="w-1/3 text-main font-bold select-none truncate shrink-0">{cookie.key}</span>
                                            <span className="flex-1 text-gray-700 dark:text-zinc-300 break-all">{cookie.value}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 text-xs text-gray-400 select-none">
                                        No cookies returned by the response headers.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Raw Output Tab */}
                        {activeResponseTab === 'raw' && (
                            <pre className="h-full overflow-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-4 font-mono text-[11px] leading-relaxed custom-scrollbar shadow-inner text-zinc-300">
                                <code>
                                    {typeof response.data === 'object'
                                        ? JSON.stringify(response.data)
                                        : response.data
                                    }
                                </code>
                            </pre>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponsePanel;

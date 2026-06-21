// src/components/websocket/WebsocketLogs.jsx
import React, { useEffect, useRef } from 'react';
import {
    Trash2, Download, ArrowDown, ArrowUp, Info,
    AlertCircle, Copy, Check, Eye, Navigation
} from 'lucide-react';
import { SOCKET_STATE_LABELS } from '../../utils/websocket/websocketConstants';
import { tryFormatJson } from '../../utils/websocket/websocketUtils';
import { toast } from 'react-hot-toast';

const WebSocketLogs = ({
    status,
    error,
    logs,
    autoscroll,
    setAutoscroll,
    clearLogs,
    triggerDownloadLogs
}) => {
    const logsEndRef = useRef(null);
    const stateConfig = SOCKET_STATE_LABELS[status] || SOCKET_STATE_LABELS.DISCONNECTED;

    useEffect(() => {
        if (autoscroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, autoscroll]);

    // Copy message to clipboard helper
    const [copiedLogId, setCopiedLogId] = React.useState(null);
    const handleCopyLog = (log) => {
        navigator.clipboard.writeText(log.message);
        setCopiedLogId(log.id);
        setTimeout(() => setCopiedLogId(null), 2000);
        toast.success('Message copied to clipboard');
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white dark:bg-neutral-950 p-5 divide-y divide-gray-250/30 dark:divide-neutral-900/30 gap-4">

            {/* Header section */}
            <div className="flex items-center justify-between pb-3 shrink-0">
                <h2 className="text-sm font-extrabold flex items-center gap-2 uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                    <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
                    Log Console
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={clearLogs}
                        disabled={logs.length === 0}
                        className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Clear console log history"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={triggerDownloadLogs}
                        disabled={logs.length === 0}
                        className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-400 hover:text-main hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Export logs to file"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col space-y-4 min-h-0 pt-3 select-text">

                {/* Stats Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
                    <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-200/50 dark:border-neutral-900 rounded-xl p-2.5 flex flex-col shadow-sm">
                        <span className="text-[8px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-500 uppercase">Socket Status</span>
                        <div className="flex items-center justify-center gap-2 mt-1.5">
                            <span className={`w-2 h-2 rounded-full ${stateConfig.dot}`} />
                            <span className={`text-xs font-bold py-0.5 px-2 rounded-md border ${stateConfig.bg}`}>
                                {stateConfig.label}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-200/50 dark:border-neutral-900 rounded-xl p-2.5 flex flex-col shadow-sm">
                        <span className="text-[8px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-500 uppercase">Logged Events</span>
                        <span className="text-xs font-extrabold mt-1 text-center py-0.5 text-main">
                            {logs.length} events
                        </span>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-200/50 dark:border-neutral-900 rounded-xl p-2.5 flex items-center justify-between shadow-sm px-4">
                        <span className="text-[8px] font-extrabold tracking-widest text-gray-400 dark:text-zinc-500 uppercase">Autoscroll</span>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={autoscroll}
                                onChange={(e) => setAutoscroll(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none dark:bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-main" />
                        </label>
                    </div>
                </div>

                {/* Error log display banner */}
                {error && (
                    <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2 text-xs shrink-0 select-text">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                            <span className="font-extrabold block">Socket Error Occurred:</span>
                            <span className="font-mono text-[11px] break-all">{error}</span>
                        </div>
                    </div>
                )}

                {/* Logs Listing Viewport */}
                <div className="flex-1 overflow-y-auto bg-neutral-950 border border-main rounded-2xl p-4 font-mono text-[11px] leading-relaxed custom-scrollbar shadow-inner select-text">
                    <div className="space-y-3 min-h-full">
                        {logs.map((log) => {
                            const isSent = log.type === 'sent';
                            const isReceived = log.type === 'received';
                            const isError = log.type === 'error';

                            const parsed = tryFormatJson(log.message);

                            let typeBadgeColor = 'bg-neutral-800 text-neutral-400 border-neutral-750';
                            let logMsgColor = 'text-zinc-350';
                            let iconNode = <Info className="h-3 w-3 shrink-0" />;

                            if (isSent) {
                                typeBadgeColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                                iconNode = <ArrowUp className="h-3 w-3 shrink-0" />;
                            } else if (isReceived) {
                                typeBadgeColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                                iconNode = <ArrowDown className="h-3 w-3 shrink-0" />;
                                if (parsed.isJson) {
                                    logMsgColor = 'text-emerald-400/90';
                                }
                            } else if (isError) {
                                typeBadgeColor = 'bg-rose-500/15 text-rose-500 border-rose-500/20';
                                iconNode = <AlertCircle className="h-3 w-3 shrink-0" />;
                                logMsgColor = 'text-rose-400';
                            }

                            return (
                                <div key={log.id} className="group relative flex flex-col p-2.5 rounded-xl border border-neutral-900 bg-neutral-950/40 hover:bg-neutral-900/30 transition-all select-text">

                                    {/* Event meta bar */}
                                    <div className="flex items-center justify-between mb-1.5 select-none text-[10px]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-neutral-500 font-semibold">{log.timestamp}</span>
                                            <span className={`flex items-center gap-1 py-0.5 px-2 rounded border font-bold text-[9px] uppercase tracking-wider ${typeBadgeColor}`}>
                                                {iconNode}
                                                {log.type}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyLog(log)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all cursor-pointer"
                                            title="Copy message payload"
                                        >
                                            {copiedLogId === log.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                    </div>

                                    {/* Message Display Area */}
                                    <div className={`overflow-x-auto whitespace-pre-wrap break-all ${logMsgColor}`}>
                                        {parsed.isJson ? (
                                            <code dangerouslySetInnerHTML={{ __html: parsed.highlighted }} />
                                        ) : (
                                            <code>{log.message}</code>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {logs.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center py-20 text-center text-neutral-600 select-none space-y-3">
                                <Navigation className="h-7 w-7 opacity-20 text-neutral-400" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Log Console Idle</p>
                                    <p className="text-[9px] max-w-[200px] text-neutral-600 mx-auto">
                                        Establish connection and trigger message streams to record network packet traffic.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div ref={logsEndRef} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WebSocketLogs;

// src/components/websocket/WebsocketConnectionBar.jsx
import React from 'react';
import { X, Check, Copy, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { SOCKET_STATES } from '../../utils/websocket/websocketConstants';
import { toast } from 'react-hot-toast';

const WebSocketConnectionBar = ({
    url,
    setUrl,
    status,
    connect,
    disconnect
}) => {
    const isConnecting = status === SOCKET_STATES.CONNECTING;
    const isConnected = status === SOCKET_STATES.CONNECTED;
    const isDisconnected = status === SOCKET_STATES.DISCONNECTED || status === SOCKET_STATES.ERROR;

    const [copiedUrl, setCopiedUrl] = React.useState(false);

    const copyUrl = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
        toast.success('URL copied to clipboard');
    };

    const clearUrl = () => {
        setUrl('');
    };

    return (
        <div className="p-5 bg-white/40 dark:bg-neutral-950/20 shrink-0">
            <div className="bg-white dark:bg-neutral-905 border border-gray-200/60 dark:border-neutral-900 rounded-2xl p-4 shadow-sm relative group">
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Protocol indicator badge */}
                    <div className="relative shrink-0 flex items-center justify-center h-12 px-4 rounded-xl border border-gray-200/70 dark:border-neutral-880 bg-gray-55 dark:bg-neutral-900/80 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                        WS / WSS
                    </div>

                    {/* URL Entry Input */}
                    <div className="flex-1 relative flex items-center">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={!isDisconnected}
                            placeholder="wss://echo.websocket.org"
                            required
                            autoFocus
                            className="w-full h-12 bg-gray-50 dark:bg-neutral-900/85 border border-gray-200/70 dark:border-neutral-800 rounded-xl pl-4 pr-16 text-xs font-mono focus:outline-none focus:border-main focus:ring-2 focus:ring-main/10 transition-all duration-200 text-gray-800 dark:text-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        />

                        {/* Helper actions inside input bar */}
                        <div className="absolute right-2.5 flex items-center gap-1.5">
                            {url && isDisconnected && (
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

                    {/* Connection Button */}
                    {!isDisconnected ? (
                        <button
                            type="button"
                            onClick={disconnect}
                            className="bg-rose-500 hover:bg-rose-600 text-white h-12 px-7 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-rose-500/20 active:scale-[0.98] transition-all shrink-0 shadow-sm cursor-pointer"
                        >
                            {isConnecting ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <WifiOff className="h-4 w-4" />
                            )}
                            <span className="text-xs uppercase font-extrabold tracking-wider">
                                {isConnecting ? 'Disconnecting' : 'Disconnect'}
                            </span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={connect}
                            className="bg-main hover:bg-main-hover text-white h-12 px-7 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-main/20 active:scale-[0.98] transition-all shrink-0 shadow-sm cursor-pointer"
                        >
                            <Wifi className="h-4 w-4" />
                            <span className="text-xs uppercase font-extrabold tracking-wider">Connect</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSocketConnectionBar;

// src/pages/WebsocketTester.jsx
import React from 'react';
import { Radio, LayoutGrid, LayoutList } from 'lucide-react';
import { useWebSocketTester } from '../hooks/useWebSocketTester';
import WebSocketConnectionBar from '../components/websocket/WebsocketConnectionBar';
import WebSocketMessageSender from '../components/websocket/WebsocketMessageSender';
import WebSocketLogs from '../components/websocket/WebsocketLogs';

const WebSocketTester = () => {
    const {
        // Layout State
        layoutMode, setLayoutMode,
        splitWidth,
        autoscroll, setAutoscroll,

        // WS Connection
        url, setUrl,
        status,
        error,
        logs,

        // Messages Form
        messageBody, setMessageBody,
        messageType, setMessageType,

        // Callbacks
        connect,
        disconnect,
        sendMessage,
        clearLogs,
        triggerDownloadLogs,
        formatMessageBody,
        handlePointerDown,

        // Ref
        workspaceRef
    } = useWebSocketTester();

    return (
        <div className="flex-1 w-full h-[calc(100vh-60px)] md:h-screen max-h-[calc(100vh-60px)] md:max-h-screen bg-slate-50/40 dark:bg-[#070709] text-gray-900 dark:text-zinc-100 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">

            {/* Header Area */}
            <header className="border-b border-gray-200/50 dark:border-neutral-900 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-main shadow-sm shrink-0">
                        <Radio className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            WebSocket Workspace
                        </h1>
                        <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400">
                            Establish real-time duplex connections and stream event data payloads
                        </p>
                    </div>
                </div>

                {/* Layout Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

                    <div className="bg-gray-150/60 dark:bg-neutral-900/60 p-1 rounded-xl flex items-center border border-gray-200/50 dark:border-neutral-800">
                        <button
                            onClick={() => setLayoutMode('split')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${layoutMode === 'split'
                                ? 'bg-white text-gray-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-zinc-350'
                                }`}
                            title="Split View (Ctrl+Shift+L)"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span className="sr-only lg:not-sr-only text-[10px] uppercase font-bold tracking-wider">Split</span>
                        </button>
                        <button
                            onClick={() => setLayoutMode('vertical')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${layoutMode === 'vertical'
                                ? 'bg-white text-gray-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-zinc-350'
                                }`}
                            title="Vertical View (Ctrl+Shift+L)"
                        >
                            <LayoutList className="h-3.5 w-3.5" />
                            <span className="sr-only lg:not-sr-only text-[10px] uppercase font-bold tracking-wider">Vertical</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Area container */}
            <div className="flex-1 flex min-h-0 overflow-hidden relative">

                {/* Workspace Split Content */}
                <div
                    ref={workspaceRef}
                    className={`flex-1 flex ${layoutMode === 'split' ? 'flex-col lg:flex-row' : 'flex-col'
                        } overflow-hidden min-h-0 relative`}
                >

                    {/* Left/Top Pane: Client Dispatcher */}
                    <div
                        style={{
                            width: layoutMode === 'split' ? `${splitWidth}%` : '100%',
                            height: layoutMode === 'split' ? '100%' : '50%',
                            minWidth: layoutMode === 'split' ? '35%' : 'auto'
                        }}
                        className={`flex flex-col overflow-hidden divide-y divide-gray-200/50 dark:divide-neutral-900 min-h-0 shrink-0 ${layoutMode === 'split'
                            ? 'border-r border-gray-200/30 dark:border-neutral-900/30'
                            : 'border-b border-gray-200/30 dark:border-neutral-900/30'
                            }`}
                    >
                        {/* URL Entry Connection bar */}
                        <WebSocketConnectionBar
                            url={url}
                            setUrl={setUrl}
                            status={status}
                            connect={connect}
                            disconnect={disconnect}
                        />

                        {/* Message Dispatcher Form */}
                        <WebSocketMessageSender
                            messageBody={messageBody}
                            setMessageBody={setMessageBody}
                            messageType={messageType}
                            setMessageType={setMessageType}
                            sendMessage={sendMessage}
                            formatMessageBody={formatMessageBody}
                            status={status}
                        />
                    </div>

                    {/* Resizer divider (hidden if not split view) */}
                    {layoutMode === 'split' && (
                        <div
                            onPointerDown={handlePointerDown}
                            className="hidden lg:block w-[7px] bg-gray-200/50 hover:bg-main/50 dark:bg-neutral-900 dark:hover:bg-main/40 cursor-col-resize h-full transition-colors shrink-0 z-10 active:bg-main select-none"
                            title="Drag to adjust column layout size"
                        />
                    )}

                    {/* Right/Bottom Pane: Log Viewer */}
                    <div
                        style={{
                            width: layoutMode === 'split' ? `${100 - splitWidth}%` : '100%',
                            height: layoutMode === 'split' ? '100%' : '50%',
                            minWidth: layoutMode === 'split' ? '35%' : 'auto'
                        }}
                        className="flex-1 flex flex-col overflow-hidden min-h-0 shrink-0"
                    >
                        <WebSocketLogs
                            status={status}
                            error={error}
                            logs={logs}
                            autoscroll={autoscroll}
                            setAutoscroll={setAutoscroll}
                            clearLogs={clearLogs}
                            triggerDownloadLogs={triggerDownloadLogs}
                        />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default WebSocketTester;

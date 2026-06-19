// src/components/websocket/WebsocketMessageSender.jsx
import React from 'react';
import { Send, Sparkles } from 'lucide-react';
import { SOCKET_STATES } from '../../utils/websocket/websocketConstants.js';

const WebSocketMessageSender = ({
    messageBody,
    setMessageBody,
    messageType,
    setMessageType,
    sendMessage,
    formatMessageBody,
    status
}) => {
    const isConnected = status === SOCKET_STATES.CONNECTED;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white/30 dark:bg-[#09090b]/10 p-5">
            <div className="flex flex-col h-full space-y-4 min-h-0">

                {/* Header title */}
                <div className="flex items-center justify-between shrink-0">
                    <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Message Payload Builder</span>
                </div>

                {/* Radio Selection bar for Type */}
                <div className="flex flex-wrap gap-4 text-xs font-bold bg-gray-100/40 dark:bg-neutral-900/50 p-2.5 rounded-xl border border-gray-200/50 dark:border-neutral-850/60 shrink-0">
                    {[
                        { id: 'json', label: 'JSON Message' },
                        { id: 'text', label: 'Plain Text' }
                    ].map(t => (
                        <label key={t.id} className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                                type="radio"
                                name="messageType"
                                checked={messageType === t.id}
                                onChange={() => setMessageType(t.id)}
                                className="accent-main w-3.5 h-3.5 cursor-pointer"
                            />
                            <span className={messageType === t.id ? 'text-main' : 'text-gray-500 dark:text-zinc-400'}>{t.label}</span>
                        </label>
                    ))}
                </div>

                {/* Editor Container */}
                <div className="flex-1 flex flex-col min-h-0 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Editor</span>
                        {messageType === 'json' && (
                            <button
                                type="button"
                                onClick={formatMessageBody}
                                className="flex items-center gap-1 text-[10px] text-main font-bold hover:underline cursor-pointer"
                            >
                                <Sparkles className="h-3 w-3" /> Auto-Format JSON
                            </button>
                        )}
                    </div>

                    {/* Textarea code appearance with line numbers */}
                    <div className="flex-1 border border-neutral-800 dark:border-neutral-900 bg-neutral-950 rounded-2xl flex overflow-hidden min-h-[200px]">
                        {/* Line Numbers mock */}
                        <div className="bg-neutral-900/40 text-neutral-600/70 select-none text-right px-2 py-4 border-r border-neutral-800 font-mono text-xs leading-relaxed shrink-0 w-8">
                            {Array.from({ length: Math.max(messageBody.split('\n').length, 1) }).map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>
                        <textarea
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            className={`flex-1 bg-transparent p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed select-text ${messageType === 'json' ? 'text-emerald-400' : 'text-zinc-300'
                                }`}
                            placeholder={messageType === 'json' ? '{\n  "key": "value"\n}' : 'Type message here...'}
                        />
                    </div>
                </div>

                {/* Send action bar */}
                <div className="flex justify-end shrink-0 pt-2 border-t border-gray-150/40 dark:border-neutral-900">
                    <button
                        type="button"
                        onClick={sendMessage}
                        disabled={!isConnected}
                        className="bg-main text-white h-11 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-main-hover hover:shadow-lg hover:shadow-main/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm cursor-pointer"
                        title={isConnected ? "Send message (Ctrl+Enter)" : "Connect to socket to send"}
                    >
                        <Send className="h-4 w-4" />
                        <span className="text-xs uppercase font-extrabold tracking-wider">Send Message</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WebSocketMessageSender;

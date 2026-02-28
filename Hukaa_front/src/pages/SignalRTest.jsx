import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Terminal, Wifi, WifiOff, MessageSquare, Trash2, Settings2, Activity, Play, Send, Info } from 'lucide-react';
import signalRService from '../api/signalr';

const SignalRTest = () => {
    // State
    const [hubUrl, setHubUrl] = useState('http://localhost:5055/hubs/notification');
    const [eventName, setEventName] = useState('ReceiveNotification');
    const [status, setStatus] = useState('Disconnected');
    const [messages, setMessages] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);

    // Sending State
    const [sendMethod, setSendMethod] = useState('');
    const [sendMessage, setSendMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle incoming messages from the service
    const onMessageReceived = useCallback((message) => {
        console.log(`[${eventName}] received:`, message);
        setMessages((prevMessages) => [...prevMessages, {
            id: Date.now() + Math.random(),
            content: typeof message === 'string' ? message : JSON.stringify(message, null, 2),
            time: new Date().toLocaleTimeString(),
            event: eventName,
            type: 'received'
        }]);
    }, [eventName]);

    // Update connection status
    const onStatusChange = useCallback((newStatus) => {
        setStatus(newStatus);
        if (newStatus !== 'Connecting...') {
            setIsConnecting(false);
        }
    }, []);

    // Effect to manage listeners
    useEffect(() => {
        signalRService.on(eventName, onMessageReceived);
        return () => {
            signalRService.off(eventName);
        };
    }, [eventName, onMessageReceived]);

    // Connection Controls
    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await signalRService.startConnection(hubUrl, onStatusChange);
        } catch (err) {
            console.error('Failed to connect:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        await signalRService.stopConnection();
    };

    // Send Message Logic
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (status !== 'Connected' || !sendMethod) return;

        setIsSending(true);
        try {
            let payload;
            try {
                payload = (sendMessage.startsWith('{') || sendMessage.startsWith('['))
                    ? JSON.parse(sendMessage)
                    : sendMessage;
            } catch (e) {
                payload = sendMessage;
            }

            await signalRService.invoke(sendMethod, payload);

            setMessages((prev) => [...prev, {
                id: Date.now() + Math.random(),
                content: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
                time: new Date().toLocaleTimeString(),
                event: sendMethod,
                type: 'sent'
            }]);

            setSendMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            setMessages((prev) => [...prev, {
                id: Date.now() + Math.random(),
                content: `Error: ${err.message}`,
                time: new Date().toLocaleTimeString(),
                event: sendMethod,
                type: 'error'
            }]);
        } finally {
            setIsSending(false);
        }
    };

    const clearLogs = () => setMessages([]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                {/* Connection Settings */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-white font-bold text-lg">
                            <Settings2 size={20} className="text-blue-500" />
                            Connection Settings
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hub Endpoint URL</label>
                                <input
                                    type="text"
                                    value={hubUrl}
                                    onChange={(e) => setHubUrl(e.target.value)}
                                    disabled={status !== 'Disconnected' && status !== 'Connection Failed'}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono disabled:opacity-50"
                                    placeholder="http://localhost:5055/hubs/notification"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Method to Listen</label>
                                <input
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    disabled={status !== 'Disconnected' && status !== 'Connection Failed'}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono disabled:opacity-50"
                                    placeholder="ReceiveMessage"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            {status === 'Disconnected' || status === 'Connection Failed' ? (
                                <button
                                    onClick={handleConnect}
                                    disabled={isConnecting}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-200 dark:shadow-none"
                                >
                                    <Wifi size={18} />
                                    {isConnecting ? 'Establishing...' : 'Start Connection'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleDisconnect}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 dark:shadow-none"
                                >
                                    <WifiOff size={18} />
                                    Stop Connection
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Send Message Panel */}
                    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 ${status !== 'Connected' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-white font-bold text-lg">
                            <Send size={20} className="text-blue-500" />
                            Send Message to Hub
                        </div>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hub Method Name</label>
                                <input
                                    type="text"
                                    value={sendMethod}
                                    onChange={(e) => setSendMethod(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono"
                                    placeholder="e.g., SendNotification"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payload (Plain text or JSON)</label>
                                <textarea
                                    value={sendMessage}
                                    onChange={(e) => setSendMessage(e.target.value)}
                                    className="w-full h-24 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-mono resize-none"
                                    placeholder='{ "text": "Hello Hub" }'
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSending || !sendMethod}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all"
                            >
                                {isSending ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                                {isSending ? 'Sending...' : 'Invoke Hub Method'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Status Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-white font-bold text-lg">
                                <Activity size={20} className="text-indigo-500" />
                                Live Status
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <span className="text-sm text-gray-500">State</span>
                                    <span className={`text-sm font-bold uppercase ${status === 'Connected' ? 'text-green-500' :
                                        status === 'Disconnected' ? 'text-gray-500' :
                                            status === 'Connecting...' || status === 'Reconnecting...' ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                        {status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <span className="text-sm text-gray-500">Log Count</span>
                                    <span className="text-sm font-bold text-blue-600">{messages.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-2">
                                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-tight">
                                    Invoke methods on the hub by specifying the method name and the expected payload.
                                </p>
                            </div>
                            <button
                                onClick={clearLogs}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                            >
                                <Trash2 size={16} />
                                Clear Console
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Log Console */}
            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                <div className="px-6 py-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300 font-mono text-sm">
                        <Terminal size={16} className="text-green-400" />
                        <span>output_stream --hub-tester --listen="{eventName}"</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                </div>

                <div className="h-[500px] overflow-y-auto p-6 font-mono text-sm scrollbar-thin scrollbar-thumb-gray-700">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                            <MessageSquare size={64} className="opacity-10" />
                            <div className="text-center">
                                <p className="text-lg font-bold opacity-30 italic">
                                    {status === 'Connected' ? 'Listening for events...' : 'Connect to start logging'}
                                </p>
                                <p className="text-xs opacity-20">Real-time data stream will appear here</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className="animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1">
                                        <span className={`px-1.5 py-0.5 rounded border uppercase font-bold tracking-widest ${msg.type === 'sent' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            msg.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {msg.type === 'sent' ? `OUTGOING [${msg.event}]` :
                                                msg.type === 'error' ? 'SEND_ERROR' :
                                                    `INCOMING [${msg.event}]`}
                                        </span>
                                        <span>@ {msg.time}</span>
                                    </div>
                                    <div className={`p-4 rounded-xl border shadow-inner ${msg.type === 'sent' ? 'bg-green-900/20 border-green-800/50 text-green-300/90' :
                                        msg.type === 'error' ? 'bg-red-900/20 border-red-800/50 text-red-300' :
                                            'bg-gray-800/50 border-gray-700/50 text-green-400/90'
                                        }`}>
                                        <pre className="whitespace-pre-wrap leading-relaxed break-all">
                                            {msg.content}
                                        </pre>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-800 text-[10px] text-gray-500 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span>AUTO_SCROLL: ON</span>
                        <span>INTERACTIVE_INVOKE: ENABLED</span>
                    </div>
                    <span>HUKAA_SIGNALR_CLI_V1.3_REFAC</span>
                </div>
            </div>

            <p className="mt-4 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                Clean Architecture • Decoupled Hub Service
            </p>
        </div>
    );
};

export default SignalRTest;

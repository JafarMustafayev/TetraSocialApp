// src/hooks/use-websocket-tester.js
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { SOCKET_STATES, DEFAULT_WS_URL, DEFAULT_WS_MESSAGE } from '../utils/websocket/websocket-constants';
import { downloadLogsAsText } from '../utils/websocket/websocket-utils';

export const useWebSocketTester = () => {
    // ----------------------------------------------------
    // Layout & Preferences State
    // ----------------------------------------------------
    const [layoutMode, setLayoutMode] = useState(() => {
        return localStorage.getItem('ws_tester_layout_mode') || 'split'; // 'split' | 'vertical'
    });
    const [splitWidth, setSplitWidth] = useState(() => {
        return Number(localStorage.getItem('ws_tester_split_width')) || 50; // percentage
    });
    const [autoscroll, setAutoscroll] = useState(true);

    // ----------------------------------------------------
    // WebSocket State
    // ----------------------------------------------------
    const [url, setUrl] = useState(() => {
        return localStorage.getItem('ws_tester_url') || DEFAULT_WS_URL;
    });
    const [status, setStatus] = useState(SOCKET_STATES.DISCONNECTED);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState([]);

    // ----------------------------------------------------
    // Message Drafting State
    // ----------------------------------------------------
    const [messageBody, setMessageBody] = useState(DEFAULT_WS_MESSAGE);
    const [messageType, setMessageType] = useState('json'); // 'json' | 'text'

    const socketRef = useRef(null);
    const workspaceRef = useRef(null);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('ws_tester_layout_mode', layoutMode);
    }, [layoutMode]);

    useEffect(() => {
        localStorage.setItem('ws_tester_url', url);
    }, [url]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    // ----------------------------------------------------
    // Logging Helpers
    // ----------------------------------------------------
    const addLog = (type, message) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, { type, message, timestamp, id: Date.now() + Math.random().toString(36).substr(2, 5) }]);
    };

    // ----------------------------------------------------
    // WebSocket Action Handlers
    // ----------------------------------------------------
    const connect = () => {
        if (!url) {
            toast.error('WebSocket URL is required');
            return;
        }

        if (socketRef.current) {
            socketRef.current.close();
        }

        setStatus(SOCKET_STATES.CONNECTING);
        setError(null);
        addLog('info', `Connecting to ${url}...`);

        try {
            const ws = new WebSocket(url);
            socketRef.current = ws;

            ws.onopen = () => {
                setStatus(SOCKET_STATES.CONNECTED);
                addLog('info', 'WebSocket Connection Established.');
                toast.success('Connected successfully');
            };

            ws.onmessage = (event) => {
                addLog('received', event.data);
            };

            ws.onclose = (event) => {
                setStatus(SOCKET_STATES.DISCONNECTED);
                socketRef.current = null;
                addLog('info', `WebSocket Connection Closed. (Code: ${event.code}${event.reason ? `, Reason: ${event.reason}` : ''})`);
                toast.error('Connection closed');
            };

            ws.onerror = (err) => {
                setStatus(SOCKET_STATES.ERROR);
                setError('WebSocket handshaking or network error occurred.');
                addLog('error', 'WebSocket connection error.');
                toast.error('Connection error');
            };
        } catch (e) {
            setStatus(SOCKET_STATES.ERROR);
            setError(e.message || 'Failed to initialize WebSocket client.');
            addLog('error', `Initialization Error: ${e.message}`);
            toast.error('Failed to initialize connection');
        }
    };

    const disconnect = () => {
        if (socketRef.current) {
            addLog('info', 'Disconnecting client manually...');
            socketRef.current.close();
        }
    };

    const sendMessage = () => {
        if (!socketRef.current || status !== SOCKET_STATES.CONNECTED) {
            toast.error('No active connection');
            return;
        }

        if (!messageBody.trim()) {
            toast.error('Cannot send empty message');
            return;
        }

        try {
            socketRef.current.send(messageBody);
            addLog('sent', messageBody);
        } catch (e) {
            addLog('error', `Failed to send: ${e.message}`);
            toast.error(`Send error: ${e.message}`);
        }
    };

    const clearLogs = () => {
        setLogs([]);
        toast.success('Logs cleared');
    };

    const triggerDownloadLogs = () => {
        if (logs.length === 0) {
            toast.error('No logs to download');
            return;
        }
        downloadLogsAsText(logs);
        toast.success('File download started');
    };

    const formatMessageBody = () => {
        if (messageType !== 'json') return;
        try {
            const parsed = JSON.parse(messageBody);
            setMessageBody(JSON.stringify(parsed, null, 2));
            toast.success('JSON formatted successfully');
        } catch (e) {
            toast.error('Invalid JSON. Cannot format.');
        }
    };

    // ----------------------------------------------------
    // Resizable Drag Handler
    // ----------------------------------------------------
    const handlePointerDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = splitWidth;
        const containerWidth = workspaceRef.current ? workspaceRef.current.clientWidth : window.innerWidth;

        const handlePointerMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPercentage = (deltaX / containerWidth) * 100;
            const newPercentage = Math.min(Math.max(startWidth + deltaPercentage, 20), 80);
            setSplitWidth(newPercentage);
            localStorage.setItem('ws_tester_split_width', newPercentage.toString());
        };

        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    // ----------------------------------------------------
    // Keyboard Shortcuts Listener
    // ----------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl + Enter -> Send Message
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (status === SOCKET_STATES.CONNECTED) {
                    sendMessage();
                } else {
                    toast.error('Connect to a WebSocket server first');
                }
            }
            // Ctrl + Shift + L -> Toggle Layout
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                setLayoutMode(prev => prev === 'split' ? 'vertical' : 'split');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [status, messageBody]);

    return {
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
    };
};

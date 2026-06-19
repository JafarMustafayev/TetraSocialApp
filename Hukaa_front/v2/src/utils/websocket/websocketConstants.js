// src/utils/websocket/websocketConstants.js

export const SOCKET_STATES = {
    DISCONNECTED: 'DISCONNECTED',
    CONNECTING: 'CONNECTING',
    CONNECTED: 'CONNECTED',
    ERROR: 'ERROR'
};

export const SOCKET_STATE_LABELS = {
    [SOCKET_STATES.DISCONNECTED]: {
        label: 'Disconnected',
        bg: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        dot: 'bg-gray-400'
    },
    [SOCKET_STATES.CONNECTING]: {
        label: 'Connecting',
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        dot: 'bg-amber-500 animate-pulse'
    },
    [SOCKET_STATES.CONNECTED]: {
        label: 'Connected',
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500 animate-ping'
    },
    [SOCKET_STATES.ERROR]: {
        label: 'Connection Error',
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        dot: 'bg-rose-500'
    }
};

export const DEFAULT_WS_URL = 'wss://echo.websocket.org';
export const DEFAULT_WS_MESSAGE = '{\n  "message": "Hello, WebSocket!"\n}';

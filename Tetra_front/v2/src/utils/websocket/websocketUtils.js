// src/utils/websocket/websocketUtils.js
import { highlightJson } from '../api/apiTesterUtils';

export const tryFormatJson = (message) => {
    if (!message) return { isJson: false, formatted: '', highlighted: '' };
    try {
        const parsed = JSON.parse(message.trim());
        const formatted = JSON.stringify(parsed, null, 2);
        return {
            isJson: true,
            formatted,
            highlighted: highlightJson(formatted)
        };
    } catch (e) {
        return {
            isJson: false,
            formatted: message,
            highlighted: message
        };
    }
};

export const downloadLogsAsText = (logs) => {
    const content = logs.map(log => {
        const timestamp = log.timestamp;
        const typeStr = log.type.toUpperCase();
        return `[${timestamp}] [${typeStr}] ${log.message}`;
    }).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `websocket-logs-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

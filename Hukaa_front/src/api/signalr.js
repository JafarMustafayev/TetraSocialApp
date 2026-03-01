import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.listeners = new Map();
        this.statusCallback = null;
        this.reconnectTimeout = null;
        this.maxRetryAttempts = 10;
        this.retryCount = 0;
    }

    /**
     * Initialize and start a SignalR connection
     * @param {string} url - Hub URL
     * @param {function} onStatusChange - Callback for status updates
     */
    async startConnection(url, onStatusChange) {
        this.url = url;
        this.statusCallback = onStatusChange;

        await this.stopConnection();
        this.updateStatus('Connecting...');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => localStorage.getItem('token')
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    if (retryContext.elapsedMilliseconds > 60000) {
                        // If we've been reconnecting for more than 60 seconds, stop automatic retries
                        // and let our manual close handler take over if needed
                        return null;
                    }
                    // Exponential backoff: 2s, 5s, 10s, 30s
                    return [2000, 5000, 10000, 30000][retryContext.previousRetryCount] || 30000;
                }
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Restore any existing listeners
        this.listeners.forEach((callback, methodName) => {
            this.connection.on(methodName, callback);
        });

        // Lifecycle Events
        this.connection.onreconnecting((error) => {
            this.updateStatus('Reconnecting...');
        });

        this.connection.onreconnected((connectionId) => {
            this.updateStatus('Connected');
            this.retryCount = 0;
        });

        this.connection.onclose(async (error) => {
            this.updateStatus('Disconnected');

            // Start manual reconnection if closed unexpectedly
            if (error) {
                this.scheduleReconnect();
            }
        });

        try {
            await this.connection.start();
            this.updateStatus('Connected');
            this.retryCount = 0;
            return true;
        } catch (err) {
            this.updateStatus('Connection Failed');
            this.scheduleReconnect();
            return false;
        }
    }

    scheduleReconnect() {
        if (this.reconnectTimeout) return;

        if (this.retryCount < this.maxRetryAttempts) {
            const delay = Math.min(Math.pow(2, this.retryCount) * 1000, 30000);
            this.retryCount++;

            this.updateStatus(`Retrying in ${Math.round(delay / 1000)}s...`);

            this.reconnectTimeout = setTimeout(async () => {
                this.reconnectTimeout = null;
                try {
                    await this.startConnection(this.url, this.statusCallback);
                } catch (e) {
                    console.error('Manual reconnect failed:', e);
                }
            }, delay);
        } else {
            this.updateStatus('Connection Failed (Max Retries)');
            console.error('Max reconnection attempts reached.');
        }
    }

    /**
     * Stop the current connection
     */
    async stopConnection() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this.retryCount = 0;

        if (this.connection) {
            try {
                if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
                    await this.connection.stop();
                }
            } catch (err) {
                console.error('Error stopping SignalR:', err);
            } finally {
                this.connection = null;
                this.updateStatus('Disconnected');
            }
        }
    }

    /**
     * Add a listener for a hub method
     * @param {string} methodName 
     * @param {function} callback 
     */
    on(methodName, callback) {
        this.listeners.set(methodName, callback);
        if (this.connection) {
            this.connection.on(methodName, callback);
        }
    }

    /**
     * Remove a listener
     * @param {string} methodName 
     */
    off(methodName) {
        this.listeners.delete(methodName);
        if (this.connection) {
            this.connection.off(methodName);
        }
    }

    /**
     * Invoke a method on the hub
     * @param {string} methodName 
     * @param {any} args 
     */
    async invoke(methodName, ...args) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error('SignalR is not connected');
        }
        return await this.connection.invoke(methodName, ...args);
    }

    updateStatus(status) {
        if (this.statusCallback) {
            this.statusCallback(status);
        }
    }

    getConnectionState() {
        return this.connection ? this.connection.state : signalR.HubConnectionState.Disconnected;
    }
}

const signalRService = new SignalRService();
export default signalRService;
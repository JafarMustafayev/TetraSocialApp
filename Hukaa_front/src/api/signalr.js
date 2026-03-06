import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.statusCallback = null;
        this.retryTimeout = null;
        this.url = null;
    }

    /**
     * Start the SignalR connection
     * @param {string} url 
     * @param {function} onStatusChange 
     */
    async startConnection(url, onStatusChange) {
        this.url = url;
        if (onStatusChange) this.statusCallback = onStatusChange;
        
        // Prevent multiple simultaneous start attempts
        if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }

        this.updateStatus('Connecting');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => localStorage.getItem('token')
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: () => 10000 // Always retry every 10 seconds
            })
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        // Lifecycle Events
        this.connection.onreconnecting(() => {
            this.updateStatus('Connecting');
        });

        this.connection.onreconnected(() => {
            this.updateStatus('Connected');
        });

        this.connection.onclose(() => {
            this.updateStatus('Disconnected');
            // Manual retry if the connection was lost and automatic reconnect failed or was exhausted
            this.scheduleManualRetry();
        });

        try {
            await this.connection.start();
            this.updateStatus('Connected');
            if (this.retryTimeout) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }
        } catch (err) {
            console.error('SignalR Initial Connection Failed:', err);
            this.updateStatus('Disconnected');
            this.scheduleManualRetry();
        }
    }

    /**
     * Schedule a manual retry if it's not already scheduled
     */
    scheduleManualRetry() {
        if (this.retryTimeout) return;
        
        console.log('SignalR: Scheduling manual retry in 10s...');
        this.retryTimeout = setTimeout(async () => {
            this.retryTimeout = null;
            if (this.url) {
                await this.startConnection(this.url);
            }
        }, 10000);
    }

    /**
     * Stop the current connection
     */
    async stopConnection() {
        this.url = null; // Clear URL to prevent manual retries
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }

        if (this.connection) {
            try {
                await this.connection.stop();
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
        if (this.connection) {
            this.connection.on(methodName, callback);
        }
    }

    /**
     * Remove a listener
     * @param {string} methodName 
     * @param {function} callback
     */
    off(methodName, callback) {
        if (this.connection) {
            if (callback) {
                this.connection.off(methodName, callback);
            } else {
                this.connection.off(methodName);
            }
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
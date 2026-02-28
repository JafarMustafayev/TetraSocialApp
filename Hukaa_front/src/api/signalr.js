import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connection = null;
        this.listeners = new Map();
        this.statusCallback = null;
    }

    /**
     * Initialize and start a SignalR connection
     * @param {string} url - Hub URL
     * @param {function} onStatusChange - Callback for status updates
     */
    async startConnection(url, onStatusChange) {
        await this.stopConnection();

        this.statusCallback = onStatusChange;
        this.updateStatus('Connecting...');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Restore any existing listeners
        this.listeners.forEach((callback, methodName) => {
            this.connection.on(methodName, callback);
        });

        // Lifecycle Events
        this.connection.onreconnecting(() => this.updateStatus('Reconnecting...'));
        this.connection.onreconnected(() => this.updateStatus('Connected'));
        this.connection.onclose(() => this.updateStatus('Disconnected'));

        try {
            await this.connection.start();
            this.updateStatus('Connected');
            return true;
        } catch (err) {
            console.error('SignalR Connection Error:', err);
            this.updateStatus('Connection Failed');
            throw err;
        }
    }

    /**
     * Stop the current connection
     */
    async stopConnection() {
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
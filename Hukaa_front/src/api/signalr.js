import * as signalR from '@microsoft/signalr';

class SignalRService {
    constructor() {
        this.connections = {}; // { connectionKey: { connection, statusCallback, retryTimeout, url } }
    }

    /**
     * Start a SignalR connection for a specific key (e.g., 'notifications', 'chat')
     * @param {string} connectionKey 
     * @param {string} url 
     * @param {function} onStatusChange 
     */
    async startConnection(connectionKey, url, onStatusChange) {
        if (!this.connections[connectionKey]) {
            this.connections[connectionKey] = {
                connection: null,
                statusCallback: null,
                retryTimeout: null,
                url: null
            };
        }

        const connObj = this.connections[connectionKey];
        connObj.url = url;
        if (onStatusChange) connObj.statusCallback = onStatusChange;
        
        // Prevent multiple simultaneous start attempts
        if (connObj.connection && connObj.connection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }

        this.updateStatus(connectionKey, 'Connecting');

        connObj.connection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => localStorage.getItem('token')
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: () => 10000
            })
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        // Lifecycle Events
        connObj.connection.onreconnecting(() => {
            this.updateStatus(connectionKey, 'Connecting');
        });

        connObj.connection.onreconnected(() => {
            this.updateStatus(connectionKey, 'Connected');
        });

        connObj.connection.onclose(() => {
            this.updateStatus(connectionKey, 'Disconnected');
            this.scheduleManualRetry(connectionKey);
        });

        try {
            await connObj.connection.start();
            this.updateStatus(connectionKey, 'Connected');
            if (connObj.retryTimeout) {
                clearTimeout(connObj.retryTimeout);
                connObj.retryTimeout = null;
            }
        } catch (err) {
            console.error(`SignalR [${connectionKey}] Initial Connection Failed:`, err);
            this.updateStatus(connectionKey, 'Disconnected');
            this.scheduleManualRetry(connectionKey);
        }
    }

    /**
     * Schedule a manual retry for a specific connection
     */
    scheduleManualRetry(connectionKey) {
        const connObj = this.connections[connectionKey];
        if (!connObj || connObj.retryTimeout) return;
        
        console.log(`SignalR [${connectionKey}]: Scheduling manual retry in 10s...`);
        connObj.retryTimeout = setTimeout(async () => {
            connObj.retryTimeout = null;
            if (connObj.url) {
                await this.startConnection(connectionKey, connObj.url);
            }
        }, 10000);
    }

    /**
     * Stop a specific connection
     */
    async stopConnection(connectionKey) {
        const connObj = this.connections[connectionKey];
        if (!connObj) return;

        connObj.url = null;
        if (connObj.retryTimeout) {
            clearTimeout(connObj.retryTimeout);
            connObj.retryTimeout = null;
        }

        if (connObj.connection) {
            try {
                await connObj.connection.stop();
            } catch (err) {
                console.error(`Error stopping SignalR [${connectionKey}]:`, err);
            } finally {
                connObj.connection = null;
                this.updateStatus(connectionKey, 'Disconnected');
            }
        }
    }

    /**
     * Add a listener for a hub method
     * @param {string} connectionKey
     * @param {string} methodName 
     * @param {function} callback 
     */
    on(connectionKey, methodName, callback) {
        const connObj = this.connections[connectionKey];
        if (connObj && connObj.connection) {
            connObj.connection.on(methodName, callback);
        }
    }

    /**
     * Remove a listener
     * @param {string} connectionKey
     * @param {string} methodName 
     * @param {function} callback
     */
    off(connectionKey, methodName, callback) {
        const connObj = this.connections[connectionKey];
        if (connObj && connObj.connection) {
            if (callback) {
                connObj.connection.off(methodName, callback);
            } else {
                connObj.connection.off(methodName);
            }
        }
    }

    /**
     * Invoke a method on the hub
     * @param {string} connectionKey
     * @param {string} methodName 
     * @param {any} args 
     */
    async invoke(connectionKey, methodName, ...args) {
        const connObj = this.connections[connectionKey];
        if (!connObj || !connObj.connection || connObj.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error(`SignalR [${connectionKey}] is not connected`);
        }
        return await connObj.connection.invoke(methodName, ...args);
    }

    updateStatus(connectionKey, status) {
        const connObj = this.connections[connectionKey];
        if (connObj && connObj.statusCallback) {
            connObj.statusCallback(status);
        }
    }

    getConnectionState(connectionKey) {
        const connObj = this.connections[connectionKey];
        return connObj && connObj.connection ? connObj.connection.state : signalR.HubConnectionState.Disconnected;
    }
}

const signalRService = new SignalRService();
export default signalRService;

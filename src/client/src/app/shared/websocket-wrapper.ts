const defaultURL = 'ws://localhost:3000/ws';

export class WebSocketWrapper implements WebSocketEventListeners {
    url: string;
    _ws: WebSocket;
    reconnectCount: number;
    autoReconnect: boolean = true;

    constructor(url?: string, listeners?: WebSocketEventListeners) {
        this.reconnectCount = 1;
        this.url = url || defaultURL;
        if (listeners) this.registerListeners(listeners);
        this.connect();
    }

    connect() {
        this._ws = new WebSocket(this.url);

        this._ws.onopen = (e: Event) => {
            this.reconnectCount = 1;
            this.onopen(e);
        };

        this._ws.onclose = (e: CloseEvent) => {
            this.onclose(e);
            if (this.autoReconnect) {
                setTimeout(() => {
                    console.log('Try to reconnect at ' + this.reconnectCount + 'th time.');
                    this.reconnectCount++;
                    this.connect();
                }, reconnectInterval(this.reconnectCount));
            }
        };
        this._ws.onmessage = this.onmessage.bind(this);
        this._ws.onerror = this.onerror.bind(this);

        return this;
    }

    registerListeners(listeners: WebSocketEventListeners) {
        if (listeners.onopen) this.onopen = listeners.onopen.bind(listeners);
        if (listeners.onclose) this.onclose = listeners.onclose.bind(listeners);
        if (listeners.onerror) this.onerror = listeners.onerror.bind(listeners);
        this.onmessage = listeners.onmessage.bind(listeners);

        return this;
    }

    send(data: any) { this._ws.send(data); }

    onopen(e: Event) {}
    onmessage(e: MessageEvent)  {}
    onerror(e: ErrorEvent) {}
    onclose(e: CloseEvent) {}

    disconnect() {
        this.autoReconnect = false;
        this._ws.close();
    }
}

export interface WebSocketEventListeners {
    onopen?: (e: Event) => void;
    onmessage: (e: MessageEvent) => void;
    onerror?: (e: ErrorEvent) => void;
    onclose?: (e: CloseEvent) => void;
}

function reconnectInterval(k: number) {
    return Math.min(30, (Math.pow(2, k) - 1)) * 1000  * Math.random();
}

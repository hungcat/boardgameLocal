const defaultURL = 'ws://localhost:3000/ws';

export class WebSocketWrapper {
    url: string;
    _ws: WebSocket;
    reconnectCount: number;

    constructor(url?: string, listeners?: WebSocketEventListeners) {
        this.reconnectCount = 1;
        this.url = url || defaultURL;
        this.connect(listeners);
    }

    connect(listeners?: WebSocketEventListeners) {
        this._ws = new WebSocket(this.url);
        if (listeners) this.registerListeners(listeners);
        return this;
    }

    registerListeners(listeners: WebSocketEventListeners) {
        this._ws.onopen = (e: Event) => {
            this.reconnectCount = 1;
            if (listeners.onOpen) listeners.onOpen(e);
        };

        this._ws.onclose = (e: CloseEvent) => {
            if (listeners.onClose) listeners.onClose(e);
            setTimeout(() => {
                console.log('Try to reconnect at ' + this.reconnectCount + 'th time.');
                this.reconnectCount++;
                this.connect(listeners);
            }, reconnectInterval(this.reconnectCount));
        };

        if (listeners.onError) this._ws.onerror = listeners.onError.bind(listeners);

        this._ws.onmessage = listeners.onMessage.bind(listeners);

        return this;
    }

    send(data: any) { this._ws.send(data); }
}

export interface WebSocketEventListeners {
    onOpen?: (e: Event) => void;
    onMessage: (e: MessageEvent) => void;
    onError?: (e: ErrorEvent) => void;
    onClose?: (e: CloseEvent) => void;
}

function reconnectInterval(k: number) {
    return Math.min(30, (Math.pow(2, k) - 1)) * 1000  * Math.random();
}

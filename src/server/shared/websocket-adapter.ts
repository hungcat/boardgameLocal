
import * as http from "http";
import * as WebSocket from "ws";
import * as getUUID from "uuid/v4";
import { WSApp } from './websocket-app'

function WrapWebSocketAdapter(apps: Array<WSApp>) {
    return new WebSocketAdapter(apps).exportOnConnection();
}

interface WSAOptions {
    checkBeforeBroadcast?: boolean;
    brokenConnectionDetection?: WatchingOption;
}
interface WatchingOption {
    enabled: true;
    intervalSeconds?: number;
}


class WebSocketAdapter implements WSAOptions {
    conns: Map<WebSocket, { isAlive: boolean }>;
    apps: Array<WSApp>;
    checkBeforeBroadcast: boolean;
    brokenConnectionDetection: WatchingOption;
    

    constructor(apps: Array<WSApp>, options: WSAOptions = {
        checkBeforeBroadcast: true,
        brokenConnectionDetection: {
            enabled: true,
            intervalSeconds: 10 * 60
        }
    }) {
        this.conns = new Map();
        this.apps = apps;

        this.checkBeforeBroadcast = options.checkBeforeBroadcast;
        this.brokenConnectionDetection = options.brokenConnectionDetection;

        if (this.brokenConnectionDetection.enabled) {
            this.startBrokenConnectionDetection();
        }


    }

    exportOnConnection() { return this.onconnection.bind(this); }

    onconnection(ws: WebSocket, req: http.IncomingMessage) {
        this.conns.set(ws, { isAlive: true });
        ws.on('pong', () => { this.conns.get(ws).isAlive = true; });
        ws.on('message', (msg: string) => {
            this.onmessage(ws, msg)
        });
        this.apps.forEach((app) => { app.onconnection(this, ws, req); });
    }

    onmessage(ws: WebSocket, msg: string) {
        //console.log(msg);
        const obj = JSON.parse(msg);
        this.apps.forEach((app) => { app.onmessage(this, ws, obj.type, obj.data); });
        this.checkConnections();
    }

    terminateConn(ws: WebSocket, e?: Error) {
        this.conns.delete(ws);
        this.apps.forEach((app) => { app.ondisconnection(this, ws, e); });
        return ws.terminate();
    }

    send(ws: WebSocket, data: string, onerror?: (e: Error) => void) {
        ws.send(data, (e: Error) => {
            if (e) { 
                console.log('Failed to send.');
                if (onerror) onerror(e);
                //console.log(e);
                this.terminateConn(ws, e);
            }
        });
    }
 
    broadcast(data: string, excludes: Array<WebSocket> = []) {
        if (this.checkBeforeBroadcast) {
            this.checkConnections();
        }

        this.conns.forEach((v: any, ws: WebSocket) => {
            if (!excludes.includes(ws)) {
                this.send(ws, data);
            }
        });
    }

    checkConnections() {
        this.conns.forEach((v: any, ws: WebSocket) => {
            if (ws.readyState !== WebSocket.OPEN) {
                this.terminateConn(ws);
            }
        });
    }

    startBrokenConnectionDetection() {

        const interval = setInterval(() => {
            this.conns.forEach((v: any, ws: WebSocket) => {
                if (v.isAlive === false) return this.terminateConn(ws);

                v.isAlive = false;
                ws.ping('', false, true);
            });
        }, this.brokenConnectionDetection.intervalSeconds);
        

    }
}

export { WebSocketAdapter, WrapWebSocketAdapter }

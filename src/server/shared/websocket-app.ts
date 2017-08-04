
import * as http from "http";
import * as WebSocket from "ws";
import { WebSocketAdapter } from "./websocket-adapter";

interface WSApp {
    onconnection: (wsa: WebSocketAdapter, ws: WebSocket, req: http.IncomingMessage) => void;
    onmessage: (wsa: WebSocketAdapter, ws: WebSocket, type: string, data: any) => void;
    ondisconnection: (wsa: WebSocketAdapter, ws: WebSocket, e?: Error) => void;
}

export { WSApp };

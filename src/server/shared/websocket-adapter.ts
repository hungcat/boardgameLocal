
import * as http from "http";
import * as WebSocket from "ws";

class ConnData {
    id: number;
    userName: string;
    ip: string;
    agent: string;

    constructor(args: any = {}) {
        this.id = getNextID();
        this.userName = args.userName;
        this.ip = args.ip;
        this.agent = args.agent;
    }

    getName() { return this.userName || (this.id + 'th user'); }
}

var getNextID = (function() {
    let counter = 0;
    return () => { return counter++; }
})();

export class WebSocketAdapter {
    conns: Map<WebSocket, ConnData>;

    constructor(msgHandler?: (ws: WebSocket, type: string, data: any) => void) {
        this.conns = new Map();
        if (msgHandler) this.messageHandler = msgHandler;
    }

    exportOnConnection() { return this.onConnection.bind(this); }

    onConnection(ws: WebSocket, req: http.IncomingMessage) {
        this.conns.set(ws, new ConnData({
            ip: req.connection.remoteAddress,
            agent: req.headers['user-agent']
        }));
        console.log('New one arrived!');
        console.log('ip: ' + this.conns.get(ws).ip);
        console.log('agent: ' + this.conns.get(ws).agent);
        console.log('There are ' + this.conns.size + ' users');

        ws.on('message', (msg: string) => {
            this.onMessage.call(this, ws, msg)
        });

        ws.send(JSON.stringify({
            type: 'handshake'
        }));
    }

    onMessage(ws: WebSocket, msg: string) {
        console.log('There are ' + this.conns.size + ' users');
        console.log(msg);
        const obj = JSON.parse(msg);
        this.messageHandler(ws, obj.type, obj.data);
    }

    messageHandler(ws: WebSocket, type: string, data: any) {
        switch (type) {
            case 'newMessage':
                console.log(data);
                this.broadcast(JSON.stringify({
                    type: 'chatMessage',
                    data: data
                }));

                break;
            case 'newUser':
                break;
            case 'handshake':
                this.conns.get(ws).userName = data.userName;
                this.broadcast(JSON.stringify({
                    type: 'chatMessage',
                    data: {
                        userName: '#system',
                        text: data.userName + ' has entered the room'
                    }
                }));
                break;
            default:
                break;
        }
    }

    send(ws: WebSocket, data: string, onerror?: (e: Error) => void) {
        ws.send(data, onerror || ((e: Error) => {
            if (e) {
                console.log('Failed to send to ' + this.conns.get(ws).getName());
                //console.log(e);
                this.conns.delete(ws);
            }
        }));
    }
 
    broadcast(data: string, excludes: Array<WebSocket> = []) {
        this.conns.forEach((connData: ConnData, ws: WebSocket) => {
            if (!excludes.includes(ws)) {
                this.send(ws, data);
            }
        });
    }
}

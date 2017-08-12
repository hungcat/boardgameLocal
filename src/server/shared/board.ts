
import * as http from "http";
import * as WebSocket from "ws";
import * as getUUID from "uuid/v4";
import { WSApp } from "./websocket-app";
import { WebSocketAdapter } from "./websocket-adapter";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class UserInfo {
    private _id: string;
    private _name: string;
    private _isUser: boolean;

    constructor(args: any = {}) {
        this._id = getUUID();
        this._name = args.name;
        this._isUser = false;
    }

    get id() { return this._id; }
    set id(id: string) {
        if (uuidPattern.test(id)) this._id = id;
    }

    get name() { return this._name || ('[id:' + this._id + ']'); }
    set name(name: string) {
        this._isUser = true;
        this._name = name;
    }

    get isUser() { return this._isUser; }
}

class ConnInfo {
    ip: string;
    agent: string;

    constructor(args: any = {}) {
        let req = args.req;
        if (req) {
            this.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            this.agent = req.headers['user-agent'];
        }
    }
}

class WebSocketUser {
    user: UserInfo;
    conn: ConnInfo;

    constructor(args: any = {}) {
        this.user = new UserInfo(args);
        this.conn = new ConnInfo(args);
    }
}

class BoardApp implements WSApp {
    users: Map<WebSocket, WebSocketUser>;
    usersDB: Map<string, UserInfo>;

    constructor() {
        this.users = new Map();        
        this.usersDB = new Map();        
    }

    onconnection(wsa: WebSocketAdapter, ws: WebSocket, req: http.IncomingMessage) {
        let wsuser = new WebSocketUser({ req: req });

        this.users.set(ws, wsuser);

        console.log('New one arrived!');
        console.log('ip: ' + wsuser.conn.ip);
        console.log('agent: ' + wsuser.conn.agent);

        ws.send(JSON.stringify({
            type: 'handshake',
            data: { id: wsuser.user.id }
        }));

    }

    onmessage(wsa: WebSocketAdapter, ws: WebSocket, type: string, data: any) {
        console.log(type, data);
        console.log('There are ' + this.users.size + ' users');

        switch (type) {
            case 'registrationChallenge':
                let ok = true;

                // check dup
                //if (!this.usersDB.has(data.id)) {
                //    let dup = Array.prototype.some.call(this.users, (user: WebSocketUser) => {
                //        return user.name === data.userName;
                //    });

                //}

                ws.send(JSON.stringify({
                    type: 'registrationResponse',
                    data: {
                        isOK: ok,
                        id: data.id,
                        userName: data.userName
                    }
                }));

                break;
            case 'handshake':
                let wsuser = this.users.get(ws);

                if (wsuser && data.userName) {
                    const exists = this.isExistsID(data.id);

                    if (this.usersDB.has(data.id)) {
                        wsuser.user = this.usersDB.get(data.id);
                    }

                    let user = wsuser.user;
                    user.id = data.id;
                    user.name = data.userName;

                    this.usersDB.set(user.id, user);

                    console.log(user);

                    if (!exists) {
                        this.broadcast(wsa, JSON.stringify({
                            type: 'logMessage',
                            data: {
                                userName: '#system',
                                text: user.name + ' has entered the room'
                            }
                        }));
                    }
                }
                break;
            default:
                break;
        }
    }

    ondisconnection(wsa: WebSocketAdapter, ws: WebSocket, e?: Error) {
        console.log('disconnection')
        let user = this.users.get(ws).user;
        this.users.delete(ws);

        if (!this.isExistsID(user.id) && user.isUser) {
            this.broadcast(wsa, JSON.stringify({
                type: 'logMessage',
                data: {
                    userName: '#system',
                    text: user.name + ' has left the room'
                }
            }));
        }

        console.log('There are ' + this.users.size + ' users');
    }

    broadcast(wsa: WebSocketAdapter, data: string) {
        console.log('broadcast: ', data);

        this.users.forEach((wsuser: WebSocketUser, ws: WebSocket) => {
            if (wsuser.user.isUser) {
                wsa.send(ws, data);
            }
        });
    }

    isExistsID(id: string) {
        return Array.from(this.users.values()).some((wsuser: WebSocketUser) => {
            return wsuser.user.id === id && wsuser.user.isUser;
        });
    }
}

export { BoardApp }

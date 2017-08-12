import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketWrapper, WebSocketEventListeners } from "../shared/websocket-wrapper"

let storage = sessionStorage;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Message {
    userName: string;
    text: string;
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, WebSocketEventListeners {
    log: Array<Message> = [];
    ws: WebSocketWrapper = null;

    constructor(private _router: Router){}

    ngOnInit() {
        if (storage.getItem("userName") === null){
            this._router.navigate(['/login']);
        } else {
            this.ws = new WebSocketWrapper(null, this);
        }
    }

    onopen(e: Event) { console.log(e); }

    onmessage(e: MessageEvent) {
        console.log(e);
        if (e) {
            const obj = JSON.parse(e.data);
            this.messageHandler(obj.type, obj.data);
        }
    }

    messageHandler(type: string, data: any) {
        switch (type) {
            case 'logMessage':
                this.log.push(data);
                break;
            case 'handshake':
                let id = storage.getItem('id');
                if (!uuidPattern.test(id)) id = null;
                this.ws.send(JSON.stringify({
                    type: 'handshake',
                    data: {
                        'id': id,
                        'userName': storage.getItem("userName")
                    }
                }));
                if (!id) storage.setItem('id', data.id);
                break;
        }
    }

    onerror(e: ErrorEvent) { console.log(e); }
    onclose(e: CloseEvent) { console.log(e); }
}

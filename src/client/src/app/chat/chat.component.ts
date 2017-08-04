import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketWrapper, WebSocketEventListeners } from "../shared/websocket-wrapper";

let storage = sessionStorage;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Message {
    userName: string;
    text: string;
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, WebSocketEventListeners {
    @Input() message: string = '';
    conversation: Array<Message> = [];
    ws: WebSocketWrapper = null;

    constructor(private _router: Router){}

    ngOnInit() {
        if (storage.getItem("userName") === null){
            this._router.navigate(['/login']);
        } else {
            this.ws = new WebSocketWrapper(null, this);
        }
    }

    send() {
        if (this.message) {
            let msgData: Message = {
                'userName': storage.getItem("userName"),
                'text': this.message
            };

            this.ws.send(JSON.stringify({
                type: 'newMessage',
                data: msgData
            }));
            this.message = '';
        }
    }

    keypressHandler(event) {
        if (event.keyCode === 13){
            this.send();
        }
    } 

    isNewUserAlert(data){
        return data.userName === '';
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
            case 'chatMessage':
                this.conversation.push(data);
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

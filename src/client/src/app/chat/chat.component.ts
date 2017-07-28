import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketWrapper, WebSocketEventListeners } from "../shared/websocket-wrapper";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, WebSocketEventListeners {
    @Input() message: string = '';
    conversation = [];
    ws: WebSocketWrapper = null;

    constructor(private _router: Router){}

    ngOnInit() {
        if (sessionStorage.getItem("userName") === null){
            this._router.navigate(['/login']);
        }
        //this.ws = new WebSocketWrapper(null, this);
        //this.ws = new WebSocketWrapper().registerListeners(this);
        this.ws = new WebSocketWrapper(null);
        console.log(this.ws);
        console.log(this.ws.registerListeners);
        //this.ws.registerListeners(this);
        WebSocketWrapper.prototype.registerListeners.call(this.ws, this);

    }

    send() {
        if (this.message) {
            this.ws.send(JSON.stringify({
                type: 'newMessage',
                data: {
                    'userName': sessionStorage.getItem("userName"),
                    'text': this.message
                }
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

    onOpen(e: Event) { console.log(e); }

    onMessage(e: MessageEvent) {
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
                this.ws.send(JSON.stringify({
                    type: 'handshake',
                    data: {
                        'userName': sessionStorage.getItem("userName")
                    }
                }));
                break;
        }
    }

    onError(e: ErrorEvent) { console.log(e); }
    onClose(e: CloseEvent) { console.log(e); }
}

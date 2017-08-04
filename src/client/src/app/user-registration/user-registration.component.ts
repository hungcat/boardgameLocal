import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketWrapper } from "../shared/websocket-wrapper";
 
@Component({
    selector: 'user-registration',
    templateUrl: './user-registration.component.html',
    styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
    @Input() userName: string = '';
    ws: WebSocketWrapper = null;
 
    constructor(
        private _router: Router){}
 
    ngOnInit() {
        this.ws = new WebSocketWrapper(null, this);
        this.userName = sessionStorage.getItem('userName');
    }

    onmessage(e: MessageEvent) {
        console.log(e);
        if (e) {
            const obj = JSON.parse(e.data);
            this.messageHandler(obj.type, obj.data);
        }
    }

    messageHandler(type: string, data: any) {
        switch(type) {
            case 'registrationResponse':
                if (data.isOK) {
                    sessionStorage.setItem('id', data.id);
                    sessionStorage.setItem('userName', data.userName);
                    this.ws.disconnect();
                    this._router.navigate(['/chat']);
                }
                break;
        }
    }

    login() {
        if (this.userName !== null){
            this.ws.send(JSON.stringify({
                type: 'registrationChallenge',
                data: {
                    id: sessionStorage.getItem('id'),
                    userName: this.userName
                }
            }));
        }
    }
 
    keypressHandler(event) {
        if (event.keyCode  === 13){
            this.login();
        }
    } 
}

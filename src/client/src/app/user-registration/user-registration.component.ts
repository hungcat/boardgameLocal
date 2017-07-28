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
        this.ws = new WebSocketWrapper();
        WebSocketWrapper.prototype.registerListeners.call(this.ws, 
            { onMessage: (e: MessageEvent) => { console.log(e); }});
    }

    login() {
        if (this.userName !== null){
            sessionStorage.setItem("userName", this.userName);
            this._router.navigate(['/chat']);
            try {
                this.ws.send(JSON.stringify({
                    type: 'newUser',
                    data: {
                        name: this.userName
                    }
                }));
            } catch (e) {
                console.log(e);
                console.log(this.ws._ws.readyState);
            } finally {
                
            }
        }
    }
 
    keypressHandler(event) {
        if (event.keyCode  === 13){
            this.login();
        }
    } 
}

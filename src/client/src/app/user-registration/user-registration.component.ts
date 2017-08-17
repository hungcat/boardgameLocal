import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from "../shared/websocket.service";

@Component({
  selector: 'user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements OnInit {
  @Input() userName: string = '';

  constructor(
    private _router: Router,
    private _ws: WebSocketService,
  ){}

  ngOnInit() {
    this._ws.on('messageParsed', this.messageHandler.bind(this))
    this.userName = sessionStorage.getItem('userName');
  }

  messageHandler(type: string, data: any) {
    switch(type) {
      case 'registrationResponse':
        if (data.isOK) {
          sessionStorage.setItem('id', data.id);
          sessionStorage.setItem('userName', data.userName);
          this._router.navigate(['/board']);
        }
        break;
    }
  }

  login() {
    if (this.userName !== null){
      this._ws.send({
        type: 'registrationChallenge',
        data: {
          id: sessionStorage.getItem('id'),
          userName: this.userName
        }
      });
    }
  }

  keypressHandler(event) {
    if (event.keyCode  === 13){
      this.login();
    }
  } 
}

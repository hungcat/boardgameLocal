import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketWrapper, WebSocketEventListeners } from "../shared/websocket-wrapper";
import { AreaComponent } from "./items/area/area.component";

/**
 *  赤ずきん
 *
 *  おやすみカードトラップカード
 *  赤ずきんカードオオカミカード母豚カード子豚カード
 *  スコアリング
 *  プレイヤーターゲッティング
 *  プレイヤー意思決定済み
 *  公開
 */

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

    constructor(
      private _router: Router,
      private _cfr: ComponentFactoryResolver,
      private _vcr: ViewContainerRef
    ){}

    ngOnInit() {
        if (storage.getItem("userName") === null){
            this._router.navigate(['/login']);
        } else {
            this.ws = new WebSocketWrapper(null, this);

            // factory of area
            const factory = this._cfr.resolveComponentFactory(AreaComponent);
            // create area
            const ref = this._vcr.createComponent(factory);

            // set closing event
            ref.instance.setClosing(() => {
              ref.destroy();
            });
            ref.instance.isExitable = true;
            ref.instance.title = '消せる手札'
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

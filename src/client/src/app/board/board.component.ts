import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketWrapper, generateWebSocketEventListeners } from "../shared/websocket-wrapper";

import { DynamicComponentService } from "../shared/dynamic-component.service";
import { makeDroppable } from "../shared/utilities";
import { Card } from "../shared/models";

import { AreaComponent } from "./items/area/area.component";
import { CardComponent } from "./items/card/card.component";
import { DeckComponent } from "./items/deck/deck.component";
import { PlayerComponent } from "./items/player/player.component";
import { AreaGeneratorComponent } from "./items/area-generator/area-generator.component";

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

declare var $: any;

let storage = sessionStorage;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Message {
  userName: string;
  text: string;
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [ DynamicComponentService ]
})
export class BoardComponent implements OnInit {
  log: Array<Message> = [];
  ws: WebSocketWrapper = null;

  @ViewChild('container', { read: ViewContainerRef }) _vcr;

  constructor(
    private _router: Router,
    private _dcs: DynamicComponentService,
  ){}

  ngOnInit() {
    if (storage.getItem("userName") === null){
      this._router.navigate(['/login']);
    } else {
      let listeners = generateWebSocketEventListeners({
        messageHandler: this.messageHandler.bind(this)
      });
      this.ws = new WebSocketWrapper(null, listeners);

      this.makeBoardDroppable();

      let plComp = this.createComponent(PlayerComponent) as PlayerComponent;
      this.createComponent(DeckComponent, (compRef) => {
        let ins = compRef.instance as DeckComponent;
        ins.setCards(createTrumpCards(['d', 'h', 's']));
        ins.setCss({ top: plComp.getFullOffset().bottom });
      });
      this.createComponent(AreaComponent, (compRef) => {
        let ins = compRef.instance as AreaComponent;
        ins.setCards(createTrumpCards(['c'], { isFace: true }));
      });
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

  makeBoardDroppable() {
    makeDroppable($('#baseBoard'), {
      drop: (e, ui) => {
        console.log('dropped to board');

        let isSameArea = ui.draggable.parent().get(0) === $('#baseBoard').get(0);

          switch (ui.draggable.attr('data-item-type')) {
            case 'card':
              if (!isSameArea) {
                this.createComponent(CardComponent, (compRef) => {
                  let newCard = compRef.instance as CardComponent;
                  newCard.setCard(ui.draggable.data('getCard')());
                  newCard.setCss(ui.offset);
                });
                ui.draggable.data('removeCard')();
              }
              break;
            case 'deck':
              if (ui.draggable.hasClass('fixed')) {
                this.createComponent(CardComponent, (compRef) => {
                  let newCard = compRef.instance as CardComponent;
                  newCard.setCard(ui.draggable.data('popCard')());
                  newCard.setCss(ui.offset);
                });
              }
              break;
          }

      },
    });
  }

  createComponent(comp: any, callback?: (compRef: any) => void) {
    return this._dcs.createComponent(this._vcr, comp, callback);
  }
}

function createTrumpCards(suits: Array<string> = [], option = {}) {
  return ['c', 'd', 'h', 's']
    .filter(function(n) {
      return suits.indexOf(n) !== -1;
    }).reduce((result, suit) => {
      Array.prototype.push.apply(result,
        Array
          .from({ length: 13 }, (v, i) => i + 1)
          .map((i) => {
            return new Card(Object.assign({
              face: 'trump/' + suit + ('00' + i).slice(-2),
              back: 'trump/z01',
              isFace: false,
            }, option))
          })
      );
      return result;
    }, []);
}

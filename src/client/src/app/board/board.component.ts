import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { DynamicComponentService } from "../shared/dynamic-component.service";
import { WebSocketService } from "../shared/websocket.service";
import { makeDroppable, createTrumpCards, isUUID } from "../shared/utils";
import { ItemBase, Deck, Player } from "../shared/models";

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
 */

declare var $: any;

let storage = sessionStorage;

interface Message {
  userName: string;
  text: string;
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  providers: [
    DynamicComponentService,
  ]
})
export class BoardComponent implements OnInit {
  log: Array<Message> = [];

  @ViewChild('container', { read: ViewContainerRef }) _vcr;

  constructor(
    private _router: Router,
    private _dcs: DynamicComponentService,
    private _ws: WebSocketService,
  ){}

  ngOnInit() {
    if (storage.getItem("userName") === null){
      this._router.navigate(['/login']);
    } else {
      this._ws.on('messageParsed', this.messageHandler.bind(this));

      this.makeBoardDroppable();

      let plComp = this.createComponent(PlayerComponent);
      this.createComponent(DeckComponent, (compRef) => {
        let ins = compRef.instance;
        ins.setDeck(new Deck({ cards: createTrumpCards(['d', 'h', 's']) }));
        ins.setCss({ top: plComp.getFullOffset().bottom });
      });
      this.createComponent(AreaComponent, (compRef) => {
        let ins = compRef.instance;
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
        if (!isUUID(id)) id = null;
        this._ws.send({
          type: 'handshake',
          data: {
            'id': id,
            'userName': storage.getItem("userName")
          }
        });
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
          case 'Card':
            if (!isSameArea) {
              this.createComponent(CardComponent, (compRef) => {
                let newCard = compRef.instance;
                newCard.setCard(ui.draggable.data('getCard')());
                newCard.setCss(ui.offset);
              });
              ui.draggable.data('removeCard')();
            }
            break;
          case 'Deck':
            if (ui.draggable.hasClass('fixed')) {
              this.createComponent(CardComponent, (compRef) => {
                let newCard = compRef.instance;
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

  loadComponents(items: Array<ItemBase>) {
    items.forEach(item => {
      switch (item.itemType) {
        case 'Card':
          this.createComponent(CardComponent, (comp) => {
            comp.setCard(item);
            comp.setCss(item.offset);
          });   
          break;
        case 'Deck':
          this.createComponent(DeckComponent, (comp) => {
            comp.setDeck(item);
            comp.setCss(item.offset);
          });
          break;
        case 'Player':
          this.createComponent(PlayerComponent, (comp) => {
            comp.setPlayer(item);
            comp.setCss(item.offset);
          });
          if (item._id === storage.getItem('playerID')) {

          }
          break;
      }
    });
  }
}


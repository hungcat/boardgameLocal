import { Component, OnInit, ElementRef, ViewChildren, QueryList, NgZone, HostBinding } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utils";
import { Card, Deck } from "../../../shared/models";
import { CardComponent } from "../card/card.component";

declare var $: any;

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent extends DynamicComponentBase {
  @HostBinding('attr.data-item-type')
  itemType: string = 'area';

  deck = new Deck({ name: '手札' });
  get title() {
    return this.deck.name;
  };

  @ViewChildren('cards')
  cardsRef: QueryList<CardComponent>;

  constructor(
    _el: ElementRef,
    private _zone: NgZone,
  ) { super(_el); }

  ngOnInit() {
    super.ngOnInit();
    this.setDraggable();
    this.setDroppable();
  }

  setDraggable() {
    makeDraggable(this._el, { axis: 'y' });
  }
  setDroppable() {
    makeDroppable(this._el, {
      drop: (e, ui) => {
        console.log('dropped to ' + this.title);
        //console.log('cards: ' + this.cards.length);
        //console.log(e);
        let droppedPos = this.cardsRef
          .toArray()
          .map(cc => cc.getFullOffset())
          .map(o => (o.left + o.right) / 2)
          .findIndex(x => e.pageX < x);

        //console.log(this.cardsRef.toArray())
        //console.log(droppedPos)

        switch (ui.draggable.attr('data-item-type')) {
          case 'Card':
            let card = ui.draggable.data('getCard')();
            let idx = this.deck.findPos(card);
            if (idx > -1 && idx < droppedPos) droppedPos -= 1;
            ui.draggable.data('removeCard')();
            this.insertCard(card, droppedPos);
            break;
          case 'Deck':
            if (ui.draggable.hasClass('fixed')) {
              let card = ui.draggable.data('popCard')();
              this.insertCard(card, droppedPos);
            }
            break;
        }
      },
    });
  }

  onExitClicked(e?: any) {
    this.doDestroy.emit(null);
  }

  addCard(card: Card) {
    if (card) {
      this._zone.run(() => {
        this.deck.addCard(card);
      });
    }
  }

  insertCard(card: Card, pos: number) {
    if (card) {
      this._zone.run(() => {
        this.deck.insertCard(card, pos);
      });
    }
  }

  onCardDestroy(card: Card) {
    if (card) {
      let pos = this.deck.findPos(card);
      if (pos >= 0) {
        this._zone.run(() => {
          this.deck.popCard(pos);
        });
      }
    }
  }

  setDeck(deck: Deck) {
    if (deck) {
      this._zone.run(() => {
        this.deck = deck;
      });
    }
  }

  setCards(cards: Array<Card>) {
    if (cards) {
      this._zone.run(() => {
        this.deck.setCards(cards);
      });
    }
  }
}

import { Component, OnInit, ElementRef, ViewChildren, QueryList, NgZone, HostBinding } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utils";
import { Card } from "../../../shared/models";
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

  title: string = '手札';
  cards = [];

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
          case 'card':
            let card = ui.draggable.data('getCard')();
            let idx = this.cards.findIndex(c => c.equals(card));
            if (idx > -1 && idx < droppedPos) droppedPos -= 1;
            ui.draggable.data('removeCard')();
            this.insertCard(card, droppedPos);
            break;
          case 'deck':
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
        this.cards.push(card);
      });
    }
  }

  insertCard(card: Card, pos: number) {
    if (card) {
      if (pos < 0 || this.cards.length < pos) pos = this.cards.length;
      this._zone.run(() => {
        this.cards.splice(pos, 0, card);
      });
    }
  }

  onCardDestroy(card: Card) {
    if (card) {
      let pos = this.cards.findIndex(card.equals.bind(card));
      if (pos >= 0) {
        this._zone.run(() => {
          this.cards.splice(pos, 1);
        });
      }
    }
  }

  setCards(cards: Array<Card>) {
    if (cards) {
      this._zone.run(() => {
        this.cards = cards;
      });
    }
  }
}

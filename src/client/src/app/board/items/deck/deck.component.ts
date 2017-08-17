import { Component, Input, ElementRef, HostBinding, HostListener, NgZone } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utilities";
import { getImgPath } from '../../../shared/utilities';
import { Card } from "../../../shared/models";

declare var $: any;

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css'],
})
export class DeckComponent extends DynamicComponentBase {
  @HostBinding('attr.data-item-type')
  itemType: string = 'deck';

  deckType: string = 'trump';
  cards: Array<Card> = [];
  @HostBinding('class.with-shadow') 
  get hasCard() { return this.cards.length > 0; }
  @HostBinding('class.fixed') 
  fixed: boolean = false;

  pickingNum = 0;

  constructor(
    _el: ElementRef,
    private _zone: NgZone,
  ) { super(_el); }

  ngOnInit() {
    super.ngOnInit();

    this.setDraggable();
    this.setDroppable();

    $(this._el.nativeElement)
      .data('popCard', this.popCard.bind(this));
  }

  setDraggable() {
    makeDraggable(this._el, {
      helper: (e, ui) => {
        let $this = $(e.currentTarget);
        if ($this.hasClass('fixed')) {
          return $this
            .clone()
            .removeClass('.with-shadow');
        } else {
          return $this;
        }
      },
      start: (e, ui) => {
        this._zone.run(() => {
          this.pickingNum = this.fixed ? 1 : 0;
        });
      },
      stop: (e, ui) => {
        this._zone.run(() => {
          this.pickingNum = 0;
        });
      },
    });
  }

  setDroppable() {
    makeDroppable(this._el, {
      drop: (e, ui) => {
        console.log('dropped to ' + this.deckType + ' deck');
        switch (ui.draggable.attr('data-item-type')) {
          case 'card':
            this.addCard(ui.draggable.data('getCard')());
            ui.draggable.data('removeCard')();
            break;
        }
      },
    });
  }


  @HostListener('dblclick')
  toggleFixed() {
    this._zone.run(() => {
      this.fixed = !this.fixed;
    });
  }

  getNthCardUpSidePath(pos: number = 0) {
    let lastCard = this.cards[this.cards.length - 1 - pos];
    return (lastCard || Card.EMPTY).getImgPath();
  }

  addCard(card: Card, pos: string | number = 'top') {
    if (!card) return;

    if (pos === 'top') {
      this.cards.push(card);
    } else if (pos === 'bottom') {
      this.cards.unshift(card);
    } else if (isFinite(pos as number) && (0 <= pos || pos <= this.cards.length)) {
      this.cards.splice(pos as number, 0, card);
    } else {
      this.cards.push(card);
    }
  }

  setCards(cards: Array<Card>) {
    if (cards) this.cards = cards;
  }

  popCard() { return this.cards.pop(); }
}



import { Component, Input, ElementRef, HostBinding, HostListener, NgZone, ChangeDetectorRef } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utils";
import { Card, Deck } from "../../../shared/models";

declare var $: any;

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css'],
})
export class DeckComponent extends DynamicComponentBase {
  deck: Deck = new Deck();

  @HostBinding('attr.data-item-type')
  itemType: string = this.deck.itemType;
  @HostBinding('class.with-shadow') 
  get hasCard() { return this.deck.cards.length > 0; }
  @HostBinding('class.fixed') 
  fixed: boolean = false;
  pickingNum = 0;

  constructor(
    _el: ElementRef,
    private _cdr: ChangeDetectorRef,
  ) { super(_el); }

  ngOnInit() {
    super.ngOnInit();

    this.setDraggable();
    this.setDroppable();

    $(this.getDOM())
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
        this.pickingNum = this.fixed ? 1 : 0;
        this._cdr.detectChanges();
      },
      stop: (e, ui) => {
        this.pickingNum = 0;
        this._cdr.detectChanges();
      },
    });
  }

  setDroppable() {
    makeDroppable(this._el, {
      drop: (e, ui) => {
        console.log('dropped to deck');
        switch (ui.draggable.attr('data-item-type')) {
          case 'Card':
            this.deck.addCard(ui.draggable.data('getCard')());
            ui.draggable.data('removeCard')();
            break;
        }
      },
    });
  }


  @HostListener('dblclick')
  toggleFixed() {
    this.fixed = !this.fixed;
    this._cdr.detectChanges();
  }

  setDeck(deck: Deck) {
    if (deck) {
      this.deck = deck;
      this._cdr.detectChanges();
    }
  }

  popCard() {
    let card = this.deck.popCard();
    this._cdr.detectChanges();
    return card;
  }
}



import { Component, OnInit, Input, ElementRef, NgZone } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utilities";
import { Card } from "../shared/models";

declare var $: any;

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent extends DynamicComponentBase {
  @Input() public title: string = '手札';
  public cards = [];

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

        let cardAreaDOM = $(e.currentTarget)
          .find('.card-area').get(0);
        this._zone.run(() => {
          switch (ui.draggable.attr('data-item-type')) {
            case 'card':
              if (ui.draggable.parent().get(0) !== cardAreaDOM) {
                this.addCard(ui.draggable.data('getCard')());
                ui.draggable.data('removeCard')();
              }
              break;
            case 'deck':
              if (ui.draggable.hasClass('fixed')) {
                this.addCard(ui.draggable.data('popCard')());
              }
              break;
          }
        });
      },
    });
  }

  onExitClicked(e?: any) {
    this.doDestroy.emit(null);
  }

  addCard(card: Card) {
    if (card) this.cards.push(card);
  }

  onCardDestroy(card: Card) {
    if (card) {
      let pos = this.cards.findIndex(card.equals.bind(card));
      if (pos >= 0) {
        this.cards.splice(pos, 1);
      }
    }
  }

  setCards(cards: Array<Card>) {
    if (cards) this.cards = cards;
  }
}

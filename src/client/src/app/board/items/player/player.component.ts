import { Component, OnInit, ElementRef, ViewContainerRef, HostBinding, NgZone} from '@angular/core';
import { DynamicComponentBase, DynamicComponentService } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utils";
import { AreaComponent } from "../area/area.component";
import { Card, Player } from "../../../shared/models";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  providers: [ DynamicComponentService ]
})
export class PlayerComponent extends DynamicComponentBase {
  player: Player = new Player();

  @HostBinding('attr.data-item-type')
  itemType: string = this.player.itemType;

  constructor(
    _el: ElementRef,
    private _vcr: ViewContainerRef,
    private _dcs: DynamicComponentService,
    private _zone: NgZone,
  ) { super(_el); }

  ngOnInit() {
    super.ngOnInit();

    this.setDraggable();
    this.setDroppable();
  }

  setDraggable() {
    makeDraggable(this._el);
  }

  setDroppable() {
    makeDroppable(this._el, {
      drop: (e, ui) => {
        console.log('dropped to ' + this.player.name);
        //console.log('cards: ' + this.cards.length);

        switch (ui.draggable.attr('data-item-type')) {
          case 'Card':
            this.addCardToHand(ui.draggable.data('getCard')());
            ui.draggable.data('removeCard')();
            break;
          case 'Deck':
            if (ui.draggable.hasClass('fixed')) {
              this.addCardToHand(ui.draggable.data('popCard')());
            }
            break;
        }
      },
    });
  }

  showHand() {
    this._dcs.createComponent(this._vcr, AreaComponent, (comp) => {
      comp.setDeck(this.player.hand);
      comp.setCss({'top': '20vw'});
    });
  }

  setPlayer(player: Player) {
    if (player) {
      this._zone.run(() => {
        this.player = player;
      });
    }
  }

  addCardToHand(card: Card) {
    if (card) {
      this._zone.run(() => {
        this.player.hand.addCard(card);
      });
    }
  }
}

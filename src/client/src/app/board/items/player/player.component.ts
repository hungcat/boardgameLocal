import { Component, OnInit, ElementRef, ViewContainerRef, HostBinding } from '@angular/core';
import { DynamicComponentBase, DynamicComponentService } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utils";
import { AreaComponent } from "../area/area.component";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  providers: [ DynamicComponentService ]
})
export class PlayerComponent extends DynamicComponentBase {
  @HostBinding('attr.data-item-type')
  itemType: string = 'player';

  name: string = 'player1';
  hand = [];

  constructor(
    private _vcr: ViewContainerRef,
    private _dcs: DynamicComponentService,
    _el: ElementRef
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
        console.log('dropped to ' + this.name);
        //console.log('cards: ' + this.cards.length);

          switch (ui.draggable.attr('data-item-type')) {
            case 'card':
              this.hand.push(ui.draggable.data('getCard')());
              ui.draggable.data('removeCard')();
              break;
            case 'deck':
              if (ui.draggable.hasClass('fixed')) {
                this.hand.push(ui.draggable.data('popCard')());
              }
              break;
          }
      },
    });
  }

  showHand() {
    this._dcs.createComponent(this._vcr, AreaComponent, (compRef) => {
      let instance: AreaComponent = compRef.instance;
      instance.title = this.name + 'の手札';
      instance.setCss({'top': '20vw'});
      instance.setCards(this.hand);
    });
  }
}

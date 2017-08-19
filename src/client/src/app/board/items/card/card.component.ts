import { Component, Input, Output, EventEmitter, HostBinding, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, updateDraggableZIndex } from "../../../shared/utils";
import { Card } from "../../../shared/models";

declare var $: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent extends DynamicComponentBase {
  @Input() card: Card = new Card(); 

  @HostBinding('attr.data-item-type')
  itemType: string = this.card.itemType;
  @Output()
  onleave = new EventEmitter();

  constructor(
    _el: ElementRef,
    private _cdr: ChangeDetectorRef,
  ) { super(_el); }

  ngOnInit() {
    super.ngOnInit();

    this.setDraggable();

    $(this.getDOM())
      .data('getCard', this.getCard.bind(this))
      .data('removeCard', this.remove.bind(this));
  }

  setDraggable() {
    let $this = $(this.getDOM());
    let isInArea = $this.parent().hasClass('card-area');

    makeDraggable($this, {
      helper: isInArea ? 'clone' : 'original',
      appendTo: isInArea ? document.body : 'parent',
      start: function(e, ui) {
        $(this).filter(
          (i, v) => $(v).parent().hasClass('card-area')
        ).addClass('invisible placeholder');

        let scrollAnimation = (e) => {
          let hoveredArea = $.getTopElementManager()
            .list
            .map(obj => obj.element)
            .filter(el => el.tagName == 'APP-AREA');
          let $target = $(hoveredArea).first().find('.card-area');

          if ($target.length == 0) return;

          let relPos = e.pageX - $target.offset().left;
          let pw = $target.width();
          let fromCenter = relPos - pw / 2;
          let doMove = Math.abs(fromCenter) > pw * 0.25;

          if (doMove) {
            $target.not(':animated').animate({
              scrollLeft: $target.scrollLeft() + (fromCenter < 0 ? -500 : 500) 
            }, 'normal', 'linear', () => { scrollAnimation(e); });
          } else {
            $target.filter(':animated').stop();
          }
        }

        $('html').on('mousemove', scrollAnimation);
      },
      stop: function(e, ui) {
        $(this).filter(
          (i, v) => $(v).parent().hasClass('card-area')
        ).removeClass('invisible placeholder');

        $('html').off('mousemove');
      },
    });
  }

  @HostListener('dblclick')
  toggleFace() {
    this.card.changeFace();
    this._cdr.detectChanges();
  }

  getCard() { return this.card; }
  setCard(card: Card) {
    if (card) {
      this.card = card;
      this._cdr.detectChanges();
    }
  }

  remove() {
    if (this.isDestroyable) {
      this.doDestroy.emit(null);
    } else {
      this.onleave.emit(null);
    }
  }
}




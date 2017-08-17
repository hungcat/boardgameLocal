import { ElementRef } from '@angular/core';
import { Card } from './models';

export * from '../../../../common/utils'

declare var $: any;
declare type jQueryObj = any;

let draggableOptionsBase = {
  containment:'#baseBoard',
  scroll: false,
};

export function makeDraggable($target: ElementRef | jQueryObj, option: any = {}) {
  if ($target instanceof ElementRef) {
    $target = $($target.nativeElement);
  }
  $target.draggable(Object.assign({}, draggableOptionsBase, option));
  $target.mousedown(updateDraggableZIndex);
  updateDraggableZIndex.call($target.get(0));

  return $target;

}

let droppableOptionsBase = {
  drop: (e, ui) => {},
  tolerance: 'pointer',
};

export function makeDroppable($target: ElementRef | jQueryObj, option: any = {}) {
  if ($target instanceof ElementRef) {
    $target = $($target.nativeElement);
  }

  let op = Object.assign(
    {},
    droppableOptionsBase,
    option
  );
  let dropOption = op.drop;
  delete op.drop;

  $target.topDroppable({ drop: dropOption }).droppable(op);
  return $target;
}

export function updateDraggableZIndex() {
  let boxes = [],
  self = this,
  minZIndex = 2,  // 1はboard
    isFront = false;

  $('.ui-draggable').each(function (i) {
    if (this !== self) {
      boxes.push({
        box: this,
        zIndex: Number($(this).css('z-index'))
      });
    } else {
      isFront = true;
    }
  });

  boxes.sort((a, b) => a.zIndex - b.zIndex);

  if (isFront) boxes.push({ box: this });

  boxes.forEach(function (item, i) {
    $(item.box).css('z-index', i + minZIndex);
  });
}

export function createTrumpCards(suits: Array<string> = [], option = {}) {
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

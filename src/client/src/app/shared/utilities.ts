import { ElementRef } from '@angular/core';

const imgPrefix: string = 'assets/images/';
const imgExt: string = '.png';
export function getImgPath(imgCode: string) {
  return imgPrefix + imgCode + imgExt;
}

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


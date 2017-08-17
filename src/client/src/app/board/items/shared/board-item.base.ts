import { Component, Injectable, EventEmitter, Output, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { DynamicComponentBase } from "../../../shared/dynamic-component.service";
import { makeDraggable, makeDroppable } from "../../../shared/utilities";

@Component({})
export class DraggableItem extends DynamicComponentBase {
  exDraggableOptions = {};
  constructor(_el: ElementRef) { super(_el); }

  ngOnInit() {
    super.ngOnInit();
    makeDraggable(this._el, this.exDraggableOptions);
  }
}

@Component({})
export class DroppableItem extends DynamicComponentBase {
  exDroppableOptions = {};
  constructor(_el: ElementRef) { super(_el); }

  ngOnInit() {
    super.ngOnInit();
    makeDroppable(this._el, this.exDroppableOptions);
  }
}

@Component({})
export class DraggableDroppableItem extends DraggableItem {
  exDroppableOptions = {};
  constructor(_el: ElementRef) { super(_el); }

  ngOnInit() {
    super.ngOnInit();
    makeDroppable(this._el, this.exDroppableOptions);
  }
}





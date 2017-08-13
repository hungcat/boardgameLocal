import { Component, Injectable, EventEmitter, Output, ElementRef, OnInit, OnDestroy } from '@angular/core';

declare var $: any;

@Component({})
export class BoardItemBase implements OnInit, OnDestroy {
  @Output() oninit = new EventEmitter();
  @Output() ondestroy = new EventEmitter();
  closing = new EventEmitter();

  ngOnInit() {

    this.oninit.emit(null);
  }
  ngOnDestroy() {
    this.ondestroy.emit(null);

  }

  public setOnInit(next: any) {
    this.oninit.subscribe(next);
  }

  public setOnDestroy(next: any) {
    this.ondestroy.subscribe(next);
  }

  public setClosing(next: any) {
    this.closing.subscribe(next);
  }
}

@Injectable()
export class DraggableOptionsProvider {
  options = {
    containment:'#baseBoard',
    scroll: false,
    stack: '.ui-draggable'
  };

  public getOptions() { return this.options; }

  public setOptions(options: any) {
    Object.assign(this.options, options);
  }
}

@Component({})
export class DraggableItem extends BoardItemBase {
  constructor(
    protected el: ElementRef,
    protected dop: DraggableOptionsProvider
  ) {
    super();
  }

  ngOnInit() {
      super.ngOnInit();
      $(this.el.nativeElement).draggable(this.dop.getOptions());
  }
}

@Component({})
export class VerticalDraggableItem extends DraggableItem {
  constructor(el: ElementRef, dop: DraggableOptionsProvider) {
    super(el, dop);
    this.dop.setOptions({ axis: 'y' });
  }
}

import { 
  Injectable,
  ViewContainerRef,
  ComponentFactoryResolver,
  Component,
  ComponentRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
}  from '@angular/core';

declare var $: any;

@Component({})
export class DynamicComponentBase implements OnInit, OnDestroy {
  @Output() oninit = new EventEmitter();
  @Output() ondestroy = new EventEmitter();
  doDestroy = new EventEmitter();
  isDestroyable = false;

  constructor(protected _el: ElementRef) {}

  ngOnInit() {
    this.oninit.emit(null);
  }
  ngOnDestroy() {
    this.ondestroy.emit(null);
  }

  setOnInit(next: any) {
    this.oninit.subscribe(next);
  }

  setOnDestroy(next: any) {
    this.ondestroy.subscribe(next);
  }

  setDoDestroy(next: any) {
    this.doDestroy.subscribe(next);
  }

  setCss(css: any) {
    $(this._el.nativeElement).css(css);
  }

  getFullOffset() {
    let $this = $(this._el.nativeElement);
    let offset = $this.offset();
    offset.bottom = offset.top + $this.outerHeight(true);
    offset.right = offset.left + $this.outerWidth(true);
    return offset;
  }

  getDOM() { return this._el.nativeElement; }
}

@Injectable()
export class DynamicComponentService {
  public components: Set<ComponentRef<Component>> = new Set(); 
  constructor(private _cfr: ComponentFactoryResolver){}

  public createComponent(domRef: ViewContainerRef, comp: any, callback = (compRef: any) => {}) {
    const factory  = this._cfr.resolveComponentFactory(comp); 
    const compRef = domRef.createComponent(factory);

    const dComp = compRef.instance as DynamicComponentBase;
    if (dComp) {
      // set closing event
      dComp.setDoDestroy(() => {
        this.components.delete(compRef);
        compRef.destroy();
      });
      dComp.isDestroyable = true;
    }
    callback(compRef);
    this.components.add(compRef);

    return compRef.instance;
  }
}

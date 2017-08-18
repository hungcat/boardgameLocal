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
    $(this.getDOM()).css(css);
  }

  getFullOffset() {
    let $this = $(this.getDOM());
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

  public createComponent(domRef: ViewContainerRef, comp: any, callback = (compRef: ComponentRef<any>) => {}) {
    return this.createComponentG<typeof comp>(domRef, comp, callback);
  }
  public createComponentG<T extends DynamicComponentBase>(domRef: ViewContainerRef, comp: T, callback = (compRef: ComponentRef<T>) => {}): T {
    const factory  = this._cfr.resolveComponentFactory(comp as any); 
    const compRef = domRef.createComponent(factory) as ComponentRef<T>;

    const dComp = compRef.instance;
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

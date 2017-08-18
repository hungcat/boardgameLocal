import {
  Component,
  OnInit,
  ViewContainerRef,
  ElementRef,
} from '@angular/core';

import { AreaComponent } from "../area/area.component";
import { DynamicComponentBase, DynamicComponentService } from "../../../shared/dynamic-component.service";



@Component({
  selector: 'app-area-generator',
  templateUrl: './area-generator.component.html',
  styleUrls: ['./area-generator.component.css'],
  providers: [ DynamicComponentService ]
})
export class AreaGeneratorComponent extends DynamicComponentBase {

  constructor(
    _el: ElementRef,
    private _vcr: ViewContainerRef,
    private _dcs: DynamicComponentService
  ){ super(_el); }

  createArea() {
    this._dcs.createComponent(this._vcr, AreaComponent, (compRef) => {
      let instance = compRef.instance;
      instance.title = '消せる手札';
      instance.setCss({'top': '20vw'});
      instance.setOnDestroy(() => {
        console.log('area has destroyed')
      })
    });
  }

}

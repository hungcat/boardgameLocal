import { Component, Input } from '@angular/core';
import { DraggableItem } from "../shared/board-item.base";

declare var $: any;

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent extends DraggableItem {
  @Input() public title: string = '手札';
  public isExitable = false;

  onExitClicked(e?: any) {
    this.closing.emit(null);
  }
}

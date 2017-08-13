import { Component } from '@angular/core';
import { DraggableItem } from "../shared/board-item.base";
declare var $: any;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent extends DraggableItem {


}

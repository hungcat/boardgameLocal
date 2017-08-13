import { Component } from '@angular/core';
import { DraggableItem } from "../shared/board-item.base";

@Component({
  selector: 'app-draggable-item',
  templateUrl: './draggable-item.component.html',
  styleUrls: ['./draggable-item.component.css']
})
export class DraggableItemComponent extends DraggableItem {}


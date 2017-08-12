import { Component, ElementRef, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-draggable-item',
  templateUrl: './draggable-item.component.html',
  styleUrls: ['./draggable-item.component.css']
})
export class DraggableItemComponent implements OnInit {

  constructor(protected el: ElementRef) { }

  ngOnInit() {
      $(this.el.nativeElement)
            .draggable({
                containment:'#baseBoard',
                scroll: false,
            });
  }

}

import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { DraggableItemComponent } from "../draggable-item/draggable-item.component";
declare var $: any;

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent extends DraggableItemComponent {
    back: string = 'z01';
    @Input() imgPath: string = getImgPath(this.back);

    /*
    constructor(el: ElementRef) { 
        super(el); 
    }

    ngOnInit() {
        super.ngOnInit();
        $(this.el.nativeElement).dblclick(() => {
            this.isFace = !this.isFace;
            let side = this.isFace ? this.face : this.back;
            this.imgPath = getImgPath(side);
        });
    }
    */
}


const imgPrefix: string = 'assets/trump/';
const imgExt: string = '.png';
function getImgPath(imgCode: string) {
    return imgPrefix + imgCode + imgExt;
}

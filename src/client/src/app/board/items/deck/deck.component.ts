import { Component, Input } from '@angular/core';
import { DraggableItem } from "../shared/board-item.base";

declare var $: any;

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})
export class DeckComponent extends DraggableItem {
    back: string = 'z01';
    @Input() imgPath: string = getImgPath(this.back);

    /*
    constructor(el: ElementRef) { 
        super(el); 
    }

    ngOnInit() {
        super.ngOnInit();
    }
    */
}


const imgPrefix: string = 'assets/trump/';
const imgExt: string = '.png';
function getImgPath(imgCode: string) {
    return imgPrefix + imgCode + imgExt;
}

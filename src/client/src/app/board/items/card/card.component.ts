import { Component, Input } from '@angular/core';
import { DraggableItem } from "../shared/board-item.base";
declare var $: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent extends DraggableItem {
    face: string = 'c01';
    back: string = 'z01';
    @Input() imgPath: string = getImgPath(this.back);
    isFace: boolean = false;

    /*
    constructor(el: ElementRef) { 
        super(el); 
    }
    */

    ngOnInit() {
        super.ngOnInit();
        $(this.el.nativeElement).dblclick(() => {
            this.isFace = !this.isFace;
            let side = this.isFace ? this.face : this.back;
            this.imgPath = getImgPath(side);
        });
    }
}

const imgPrefix: string = 'assets/trump/';
const imgExt: string = '.png';
function getImgPath(imgCode: string) {
    return imgPrefix + imgCode + imgExt;
}



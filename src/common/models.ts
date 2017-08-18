import * as getUUID from "uuid/v4";

class ItemBase {
  _id: string;

  constructor() {
    this._id = getUUID();
  }

  equals(item: ItemBase) { return this._id === item._id; }
}

const imgPrefix: string = 'assets/images/';
const imgExt: string = '.png';

export class Card extends ItemBase {
  face: string;
  back: string;
  isFace: boolean;

  constructor(args: any = {}) {
    super();
    this.face = args.face || 'trump/s01';
    this.back = args.back || 'trump/z01';
    this.isFace = !!args.isFace;
  }

  toggleFace() { this.isFace = !this.isFace; }
  getUpSide() { return this.isFace ? this.face : this.back; }
  getImgPath() { return imgPrefix + this.getUpSide() + imgExt; }

  static readonly EMPTY = new Card({
    face: 'trump/empty',
    back: 'trump/empty',
    isFace: true,
  });
};

export class Deck extends ItemBase{

}

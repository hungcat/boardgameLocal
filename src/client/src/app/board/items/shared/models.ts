import * as getUUID from "uuid/v4";
import { getImgPath } from '../../../shared/utilities';

export class Card {
  _id: string;
  face: string;
  back: string;
  isFace: boolean;

  constructor(args: any = {}) {
    this._id = getUUID();
    this.face = args.face || 'trump/s01';
    this.back = args.back || 'trump/z01';
    this.isFace = !!args.isFace;
  }

  equals(card: Card) { return this._id === card._id; }
  toggleFace() { this.isFace = !this.isFace; }
  getUpSide() { return this.isFace ? this.face : this.back; }
  getImgPath() { return getImgPath(this.getUpSide()); }
};

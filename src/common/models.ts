import * as getUUID from "uuid/v4";

export class ItemBase {
  _id: string;
  get itemType(): string {
    return this.constructor.name;
  }
  offset: { top: number, left: number };

  constructor() {
    this._id = getUUID();
    this.offset = { top: 0, left: 0 };
  }

  equals(item: ItemBase) {
    return this._id === item._id;
  }

}

const imgPrefix: string = 'assets/images/';
const imgExt: string = '.png';

export class Card extends ItemBase {
  face: string;
  back: string;
  isFace: boolean;

  constructor(args: any = {}) {
    super();
    this.face = args.face || 'noimage';
    this.back = args.back || 'noimage';
    this.isFace = !!args.isFace;
  }

  changeFace(isFace?: boolean) {
    this.isFace = (isFace == null) ? !this.isFace : isFace;
  }
  getUpSide(forceSide?: boolean) {
    return (forceSide == null ? this.isFace : forceSide)
      ? this.face
      : this.back;
  }
  getImgPath(forceSide?: boolean) {
    return imgPrefix + this.getUpSide(forceSide) + imgExt;
  }

  static readonly EMPTY = new Card({ face: 'empty', back: 'empty' });
};

export class Deck extends ItemBase {
  name: string;
  cards: Array<Card>;

  constructor(args: any = {}) {
    super();
    this.name = args.name || "deck";
    this.cards = args.cards || [];
  }

  setCards(cards: Array<Card>) {
    if (cards) this.cards = cards;
  }

  getNthCardUpSidePath(pos: number = 0, forceSide?: boolean) {
    let lastCard = this.cards[this.cards.length - 1 - pos];
    return (lastCard || Card.EMPTY).getImgPath(forceSide);
  }

  addCard(card: Card, pos: string | number = 'top') {
    if (!card) return;

    if (pos === 'top') {
      this.cards.push(card);
    } else if (pos === 'bottom') {
      this.cards.unshift(card);
    } else if (isFinite(pos as number) && (0 <= pos || pos <= this.cards.length)) {
      this.cards.splice(pos as number, 0, card);
    } else {
      this.cards.push(card);
    }
  }

  insertCard(card: Card, pos: number) {
    if (card) {
      if (pos < 0 || this.cards.length < pos) pos = this.cards.length;
      this.cards.splice(pos, 0, card);
    }
  }

  popCard(target?: Card | number) {
    if (target == null) {
      return this.cards.pop();
    }
    if (target instanceof Card) {
      target = this.findPos(target);
    }
    if (0 <= target && target < this.cards.length) {
      this.cards.splice(target, 1);
    } else {
      return null;
    }
  }

  findPos(card: Card) {
    return this.cards.findIndex(c => card.equals(c));
  }
}

export class Player extends ItemBase {
  name: string;
  hand: Deck;

  constructor(args: any = {}) {
    super();
    this.name = args.name || 'Player0';
    this.hand = new Deck({ name: this.name + 'の手札' });
  }
}

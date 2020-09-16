import { Graphics, Sprite, TextStyle, Text } from "pixi.js";
import { by, gameTink } from "../../../util";
// import { getDisUrl, getProto } from "../../../data/bag/util";
import { SimpleDetail } from "./detail";
export class BagUtil extends Graphics {
    kind = -1
    _page = 0
    get page() {
        return this._page;
    }
    set page(value) {
        this._page = value;
        this.reDisplay();
    }
    constructor(kind) {
        super();
        this.initDraw();
        this.kind = kind;
        this.visible = false;
    }
    /**
     * @type {SingleThing[]}
     */
    sprites = []
    initDraw() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                this.lineStyle(1, 0xffffff, 0.8);
                this.drawRoundedRect(i * 60, j * 60, 50, 50, 5);
                this.lineStyle(1, 0x999999, 0.5);
                this.beginFill(0x00aaaa, 0.1);
                this.drawStar(i * 60 + 25, j * 60 + 25, 6, 25);
                this.endFill();
            }
        }
    }
    refresh() {
        this.sprites.forEach(s => s._destroyed || s.destroy());
        let bag = this.nowProtos;
        this.sprites = bag.map(proto => {
            let textureUrl = getDisUrl(proto);
            return new SingleThing(by(textureUrl), proto).onTap(this.tapHandler);
        });
        this.reDisplay();
    }
    tapHandler = undefined
    /**
     * @param {(this:SingleThing)=>void} fun 
     */
    onTap(fun) {
        this.tapHandler = fun;
        return this;
    }
    /**
     * @param {SingleThing} st 
     */
    removeThing(st) {
        this.sprites.splice(this.sprites.indexOf(st), 1);
        this.removeChild(st);
    }
    /**
     * @param {SingleThing} st 
     */
    addThing(st) {
        this.sprites.push(st);
        this.addChild(st);
    }
    reDisplay() {
        this.removeChildren();
        let k = 0;
        for (let i = this.page * 25; i < 25 * (this.page + 1); i++) {
            let sprite = this.sprites[i];
            if (!sprite) break;
            let thing = sprite.thing;
            let proto = getProto(thing);
            sprite.x = (k % 5) * 60;
            sprite.y = Math.floor(k / 5) * 60;
            sprite.over = _ => {
                SimpleDetail.show(thing, proto, sprite);
                sprite.out = _ => {
                    SimpleDetail.hide();
                }
            }
            this.addChild(sprite);
            k++;
        }
    }
    /**
     * @type {[]}
     */
    nowProtos
    load(protos) {
        this.nowProtos = protos;
        this.refresh();
        return this;
    }

}
export class SingleThing extends Sprite {
    countSprite
    _count = 1
    get count() {
        return this._count;
    }
    set count(value) {
        this._count = value;
        this.countSprite.text = value;
    }
    thing
    static countStyle = new TextStyle({
        fill: 0xffffff,
        strokeThickness: 2,
        stroke: 0x000000,
        fontWeight: 'normal',
        fontSize: 20
    })
    constructor(texture, thing) {
        super(texture);
        this.thing = thing;
        gameTink.makeInteractive(this);
        if (thing.count) {
            this._count = thing.count;
            this.countSprite = new Text(thing.count, SingleThing.countStyle);
            this.countSprite.anchor.set(1, 1);
            this.countSprite.position.set(50, 50);
            this.addChild(this.countSprite);
        }
    }
    onTap(handler) {
        this.tap = handler;
        return this;
    }
}
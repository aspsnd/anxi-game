import { AnimatedSprite, Text, TextStyle } from "pixi.js";
import { gameTink } from "../../../util";

export const DefaultActTextStyle = new TextStyle({
    fill: 0xffffff,
    fontSize: 16,
    fontWeight: 'bold'
})

export class ActSprite extends AnimatedSprite {
    _pointer = 0
    get pointer() {
        return this._pointer;
    }
    set pointer(value) {
        while (value >= this.length) {
            value -= this.length;
        }
        this._pointer = value;
        this.refresh();
    }
    constructor(textures, texts = []) {
        super(textures);
        this.texts = texts;
        this.length = textures.length;
        this.anchor.set(0.5, 0.5);
        this.text = new Text(texts[0], DefaultActTextStyle);
        this.text.anchor.set(0.5, 0.5);
        this.addChild(this.text);
        gameTink.makeInteractive(this);
        this.tap = _ => {
            this.pointer++;
            this.pointerChange(this.pointer);
        }
    }
    pointerChange = function () { }
    refresh() {
        this.gotoAndStop(this._pointer);
        this.text.text = this.texts[this._pointer];
    }
}
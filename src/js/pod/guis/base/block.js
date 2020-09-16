import { Graphics, TextStyle, Text } from "pixi.js";

export class ObjWrap extends Graphics {
    static basestyle = new TextStyle({
        fill: 0xffffff,
        fontSize: 12
    })
    constructor(_text) {
        super();
        this.lineStyle(1, 0xffffff);
        this.drawRoundedRect(0, 0, 50, 50, 5);
        let text = new Text(_text, ObjWrap.basestyle);
        text.position.set(25, 25);
        text.anchor.set(0.5, 0.5);
        this.text = text;
        this.addChild(text);
    }
}
export class FlowerObjWrap extends Graphics {
    constructor(_text) {
        super();
        this.lineStyle(1, 0xffffff, 0.8);
        this.drawRoundedRect(0, 0, 50, 50, 5);
        this.lineStyle(1, 0x999999, 0.5);
        this.beginFill(0x00aaaa, 0.1);
        this.drawStar(25, 25, 6, 25);
        this.endFill();
    }
}
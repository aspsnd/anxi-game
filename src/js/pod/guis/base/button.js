import { Graphics, Text, TextStyle } from "pixi.js";
import { gameTink } from "../../../util";

export class TextButton extends Graphics {
    constructor(_text, x = 0, y = 0, style = {}, width = 70, height = 25, fill = 0xeeaa00) {
        super();
        this.beginFill(fill);
        this.drawRoundedRect(0, 0, width, height, 5);
        this.endFill();
        let text = new Text(_text, new TextStyle({
            fill: 0x000000,
            fontWeight: 'bold',
            fontSize: 16,
            ...style
        }));
        this.text = text;
        text.anchor.set(0.5, 0.5);
        text.x = width / 2;
        text.y = height / 2;
        this.addChild(text);
        gameTink.makeInteractive(this);
        this.x = x;
        this.y = y;
    }
    overColor(color1 = 0x000000, color2 = 0x54edfd) {
        this.over = _ => {
            this.text.style.fill = color2;
        }
        this.out = _ => {
            this.text.style.fill = color1;
        }
        return this;
    }
}
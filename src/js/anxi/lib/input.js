import { Text, Graphics, TextStyle } from "pixi.js";
import { gameTink } from "../../util";

export class Input extends Graphics {
    static defaultOptions = () => false || {
        width: 220,
        height: 36,
        fontSize: 14,
        backgroundColor: 0x111,
        radius: 3,
        alpha: 1,
        color: 0xffffff,
        border: 0xffffff,
        borderWidth: 1
    }
    saveText = ''
    /**
     * @param {String} tip 
     * @param {{
     * width: number,
     * height: number,
     * fontSize: number,
     * backgroundColor: number,
     * radius: number,
     * alpha: number,
     * color: number,
     * border:number,
     * borderWidth:number
     * }} options 
     * @param {*} passwordable 
     */
    constructor(tip, options = {}, passwordable = false) {
        super();
        options = Object.assign(this.__proto__.constructor.defaultOptions(), options);
        let offsetY = (options.height - options.fontSize) >> 1;
        let tipText = new Text(tip, new TextStyle({
            fontSize: options.fontSize,
            fill: options.color
        }));
        tipText.position.set(0, offsetY);
        this.addChild(tipText);
        this.saveText = '';
        this.lineStyle(options.borderWidth, options.border);
        this.beginFill(options.backgroundColor, options.alpha);
        this.drawRoundedRect(80, 0, options.width, options.height, options.radius);
        this.endFill();
        this.root = new Text(passwordable ? "*".repeat(this.saveText.length) : this.saveText, new TextStyle({
            fontSize: options.fontSize,
            fill: options.color,
        }));
        this.root.position.set(90, offsetY);
        this.addChild(this.root);
        this.interactive = true;
        this.on('tap', _ => {
            new ZY.Inputer('', (bool, value) => {
                if (!bool) return;
                this.saveText = value;
                this.root.text = passwordable ? "*".repeat(this.saveText.length) : value;
            }, this.saveText);
        });
    }
}
export class Button extends Graphics {
    static defaultStyle = () => false || {
        width: 300,
        height: 36,
        fontSize: 14,
        backgroundColor: 0xffffff,
        radius: 3,
        alpha: 1,
        color: 0x111111,
        border: 0x111111,
        borderWidth: 1
    }
    constructor(value = '', style = {}) {
        super();
        style = Object.assign(this.__proto__.constructor.defaultStyle(), style);
        this.lineStyle(style.borderWidth, style.border);
        this.beginFill(style.backgroundColor, style.alpha);
        this.drawRoundedRect(0, 0, style.width, style.height, style.radius);
        this.endFill();
        let text = new Text(value, new TextStyle({
            fontSize: style.fontSize,
            fill: style.color,
        }));
        text.position.set(style.width >> 1, style.height >> 1);
        text.anchor.set(0.5, 0.5);
        this.addChild(text);
        this.interactive = true;
        this.on('tap',_=>{
            this.tap?.();
        })
    }
}
export class SimpleButton extends Graphics {
    static defaultStyle = () => false || {
        width: 180,
        height: 40,
        fontSize: 28,
        radius: 3,
        alpha: 1,
        color: 0xffffff,
        overColor: 0xff9900,
    }
    constructor(value = '', style = {}) {
        super();
        style = Object.assign(this.__proto__.constructor.defaultStyle(), style);
        this.drawRect(0, 0, style.width, style.height);
        let text = new Text(value, new TextStyle({
            fontSize: style.fontSize,
            fill: style.color,
        }));
        this.root = text;
        text.position.set(style.width >> 1, style.height >> 1);
        text.anchor.set(0.5, 0.5);
        this.addChild(text);
        gameTink.makeInteractive(this);
        this.over = _ => {
            text.style.fill = style.overColor;
        }
        this.out = _ => {
            text.style.fill = style.color;
        }
    }
}
export class SpanLine extends Graphics {
    constructor(width = 200, height = 5) {
        super();
        this.lineStyle(height, 0xffffff, 0.02);
        let d = 50;
        let d21 = 1 / d;
        for (let i = d; i--;) {
            this.moveTo((d21 * width * (d - i)) >> 1, 0);
            this.lineTo((d21 * width * (d + i)) >> 1, 0);
        }
    }
}
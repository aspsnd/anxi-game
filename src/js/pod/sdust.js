import * as PIXI from "pixi.js";
export class SDust {
    constructor(stage) {
        this.container = stage;
    }

    /**
     * @type [{
     *      text:PIXI.Text,
     *      timer:number
     * }]
     */
    texts = []
    /**
     * @type [{
     *      sprite:PIXI.Sprite,
     *      timer:number,
     *      dead:boolean
     * }]
     */
    controls = []

    /**
     * @type [{
     *      sprite:PIXI.Sprite,
     *      timer:number
     * }]
     */
    floatFades = []

    update() {
        if (this.texts.length > 0) {
            this.texts.forEach(ele => {
                ele.timer++;
                ele.text.y -= 1;
            });
            this.texts = this.texts.filter(ele => {
                if (ele.timer <= 60) {
                    return true;
                } else {
                    ele.text.destroy();
                    return false;
                }
            })
        }
        if (this.controls.length > 0) {
            this.controls.forEach(ele => {
                if (ele.timer > 0) {
                    ele.sprite.visible = true;
                    ele.timer--;
                } else {
                    ele.sprite.visible = false;
                }
            })
            this.controls = this.controls.filter(ele => {
                if (ele.dead) {
                    ele.sprite.destroy();
                    return false;
                }
                return true;
            })
        }
        if (this.floatFades.length > 0) {
            this.floatFades.forEach(ele => {
                if (ele.timer > 0) {
                    ele.sprite.alpha = ele.timer / 60;
                    ele.sprite.y -= 1;
                    ele.timer--;
                } else {
                    ele.sprite.visible = false;
                }
            })
            this.floatFades = this.floatFades.filter(ele => {
                if (ele.timer <= 0) {
                    ele.sprite.destroy();
                    return false;
                }
                return true;
            })
        }
    }
    /**
     * 用于创建上浮文本，掉血回血回蓝专用
     * 默认1秒后消失
     * @param {string} _t 
     * @param {PIXI.Container} parent 
     * @param {number} color 
     */
    text(_t, parent, fontSize = 30, color = 0xff0000) {
        let s = new PIXI.Text(_t, new PIXI.TextStyle({
            stroke: 0xffffff,
            strokeThickness: 2,
            fill: [color, 0xffae20],
            fontSize: fontSize,
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowColor: 0x00000,
            dropShadowDistance: 0,
            dropShadowBlur: 5,
        }));
        s.anchor.set(0.5, 0);
        s.x = parent.x;
        s.y = parent.y;
        parent.parent.addChild(s);
        this.texts.push({
            timer: 0,
            text: s
        });
        return s;
    }

    /**
     * 托管一个即将消失的物品，透明度逐渐增加，且逐渐上浮，一秒消失
     * @param {PIXI.Sprite} sprite 
     */
    contorlOpacity(sprite) {
        let ele = {
            sprite: sprite,
            timer: 60
        }
        this.floatFades.push(ele);
        return ele;
    }
    /**
     * 用于定时显示和隐藏
     * @param {PIXI.Sprite} sprite 
     */
    control(sprite, timer = 0) {
        let ele = {
            sprite,
            timer,
            dead: false
        }
        this.controls.push(ele);
        return ele;
    }
}
import { Graphics, Text, TextStyle, Sprite, Container, DisplayObject } from "pixi.js";
import { gameTink } from "../../../util";
// import { ThingProto } from "../../../data/bag/base";
import { QualityColor, QualityText, PropText } from "../../../anxi/define/util";
import { typicalProp } from "../../../anxi/atom/vita";

class Detail extends Graphics {
    static INSTANCE = new Detail();
    nameStyle = new TextStyle({
        fontSize: 18,
        fill: 0xffffff
    })
    qualityStyle = new TextStyle({
        fontSize: 18,
        dropShadow: true,
        dropShadowDistance: 1,
        dropShadowAlpha: 0.8,
        dropShadowBlur: 2
    });
    name = new Text('----', this.nameStyle)
    quality = new Text('', this.qualityStyle)
    propContainer = new Container()
    skillContainer = new Container()
    intro = new Text('', new TextStyle({
        fill: 0xffffff,
        fontSize: 14,
        wordWrap: true,
        breakWords: true,
        wordWrapWidth: 135,
        letterSpacing: 1,
        lineHeight: 18
    }))
    sale = new Text('售价：', new TextStyle({
        fill: 0xffffff,
        fontSize: 16
    }))
    propStyle = new TextStyle({
        fill: 0xff9830,
        fontSize: 18
    })
    skillStyle = new TextStyle({
        fill: 0xff5050,
        fontSize: 16,
        fontWeight: 'bold'
    })
    constructor() {
        super();
        let container = this;

        this.name.position.set(20, 15);
        container.addChild(this.name);
        this.quality.position.set(20, 40);
        container.addChild(this.quality);

        this.propContainer.position.set(20, 65);
        container.addChild(this.propContainer);

        this.skillContainer.position.set(20, 65);
        container.addChild(this.skillContainer);

        this.intro.width = 135;
        container.addChild(this.intro);
        this.intro.x = 20;

        this.sale.x = 20;
        container.addChild(this.sale);
    }
    hide() {
        this.visible = false;
    }
    /**
     * @param {ThingProto} proto 
     * @param {Sprite} sprite 
     * @param {Container} parent
     */
    show(thing, proto, sprite, parent) {
        this.clear();
        this.propContainer.removeChildren();
        this.skillContainer.removeChildren();
        if (parent) {
            parent.addChild(this);
            this.position.set(sprite.gx - parent.getGlobalPosition().x + 50, sprite.gy - parent.getGlobalPosition().y);
        } else {
            this.position.set(sprite.x + 50, sprite.y);
            sprite.parent?.addChild(this);
        }
        this.nameStyle.fill = this.qualityStyle.fill = QualityColor[proto.quality];
        this.name.style = this.nameStyle;
        this.name.text = proto.name;
        this.sale.text = `售价：${proto.money}`;
        [this.showEquip, this.showMaterial][proto.kind].call(this, thing, proto, sprite);
        this.visible = true;
    }
    /**
     * @param {ThingProto} proto 
     * @param {Sprite} sprite 
     */
    showEquip(thing, proto, sprite) {
        this.quality.text = `品质：${QualityText[proto.quality]}`;
        let yi = 0;
        typicalProp.forEach(prop => {
            let value = thing.prop[prop];
            if (value) {
                let text = new Text(`${PropText[prop]}:${['crt', 'dod'].includes(prop) ? `${(value * 100) | 0}%` : value}`, this.propStyle);
                text.position.set(0, yi);
                yi += 25;
                this.propContainer.addChild(text);
            }
        })
        let sy = 0;
        this.skillContainer.y = 65 + yi;
        thing.extraIntro?.forEach(intro => {
            let text = new Text(intro, this.skillStyle);
            text.position.set(0, sy);
            sy += text.height;
            this.skillContainer.addChild(text);
        })
        this.intro.y = 70 + yi + sy;
        this.intro.text = proto.intro;
        this.sale.y = 80 + yi + sy + this.intro.height;
        this.lineStyle(1, 0xffffff);
        this.beginFill(0x000000, 0.7);
        this.drawRect(0, 0, 175, this.height + 30);
        this.endFill();
    }
    /**
     * @param {ThingProto} proto 
     * @param {Sprite} sprite 
     */
    showMaterial(thing, proto, sprite) {
        this.quality.text = `数量：${thing.count}`;
        this.skillContainer.y = 65;
        this.intro.y = 70;
        this.intro.text = proto.intro;
        this.sale.y = 80 + this.intro.height;
        this.lineStyle(1, 0xffffff);
        this.beginFill(0x000000, 0.7);
        this.drawRect(0, 0, 175, this.height + 30);
        this.endFill();
    }
}
export const SimpleDetail = Detail.INSTANCE;
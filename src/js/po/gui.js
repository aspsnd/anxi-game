import { Sprite, Container, Text, TextStyle, Graphics } from "pixi.js";
import { gameApp, GameWidth } from "../util";
import { Role } from "./atom/role";
export class GUI {
    /**
     * @param {Role} role 
     * @param {boolean} left 
     */
    constructor(role, left) {
        role.gui = this;
        let barContainer = new Container();
        let width = 250;
        barContainer.position.set(left ? 0 : GameWidth - width, 0);
        this.basebar = barContainer;
        let aveterSprite = new Sprite(gameApp.loader.resources[role.proto.defaultView.head].texture);
        aveterSprite.anchor.set(0.5, 0.5);
        aveterSprite.scale.set(left ? 1.4 : -1.4, 1.4);
        aveterSprite.x = left ? 30 : width - 30;
        aveterSprite.y = 35;
        barContainer.addChild(aveterSprite);
        let levelSprite = new Text(role.level, new TextStyle({
            fill: 0xffffff,
            fontSize: 20,
            fontWeight: 'bold',
        }));
        levelSprite.x = left ? 45 : width - 45 - levelSprite.width;
        levelSprite.y = 45;
        this.level = levelSprite;
        {
            let hpContainer = new Graphics();
            hpContainer.beginFill(0x000000);
            hpContainer.x = left ? 80 : width - 80 - 154;
            hpContainer.y = 20;
            hpContainer.drawRect(0, 0, 154, 10);
            hpContainer.endFill();
            let hpbar = new Graphics();
            hpbar.beginFill(0xff0000);
            hpbar.x = 2;
            hpbar.y = 1;
            hpbar.drawRect(0, 0, 150, 8);
            hpbar.endFill();
            let hptext = new Text(`${role.varProp.hp}/${role.prop.hp}`, new TextStyle({
                fontWeight: 'bold',
                fontSize: 10,
                fill: 0xffffff
            }));
            hptext.x = 77;
            hptext.y = 5;
            hptext.anchor.set(0.5, 0.5);
            hpContainer.addChild(hpbar);
            hpContainer.addChild(hptext);
            barContainer.addChild(hpContainer);
            this.hpbar = hpbar;
            this.hptext = hptext;
        }
        {
            let mpContainer = new Graphics();
            mpContainer.beginFill(0x000000);
            mpContainer.x = left ? 80 : width - 80 - 154;
            mpContainer.y = 35;
            mpContainer.drawRect(0, 0, 154, 10);
            mpContainer.endFill();
            let mpbar = new Graphics();
            mpbar.beginFill(0x0085ff);
            mpbar.x = 2;
            mpbar.y = 1;
            mpbar.drawRect(0, 0, 150, 8);
            mpbar.endFill();
            let mptext = new Text(`${role.varProp.mp}/${role.prop.mp}`, new TextStyle({
                fontWeight: 'bold',
                fontSize: 10,
                fill: 0xffffff
            }));
            mptext.x = 77;
            mptext.y = 5;
            mptext.anchor.set(0.5, 0.5);
            mpContainer.addChild(mpbar);
            mpContainer.addChild(mptext);
            barContainer.addChild(mpContainer);
            this.mpbar = mpbar;
            this.mptext = mptext;
        }
        {
            let expContainer = new Graphics();
            expContainer.beginFill(0x000000);
            expContainer.x = left ? 80 : width - 80 - 154;
            expContainer.y = 50;
            expContainer.drawRect(0, 0, 154, 10);
            expContainer.endFill();
            let expbar = new Graphics();
            expbar.beginFill(0xff8500);
            expbar.x = 2;
            expbar.y = 1;
            expbar.drawRect(0, 0, 150, 8);
            expbar.endFill();
            expbar.width = role.exp / role.fexp * 150;
            let exptext = new Text(`${role.exp}/${role.fexp}`, new TextStyle({
                fontWeight: 'bold',
                fontSize: 10,
                fill: 0xffffff
            }));
            exptext.x = 77;
            exptext.y = 5;
            exptext.anchor.set(0.5, 0.5);
            expContainer.addChild(expbar);
            expContainer.addChild(exptext);
            barContainer.addChild(expContainer);
            this.expbar = expbar;
            this.exptext = exptext;
        }
        barContainer.addChild(levelSprite);
        role.on('nhpchange', e => {
            let per = role.varProp.hp / role.prop.hp;
            this.hpbar.width = 150 * per;
            this.hptext.text = `${role.varProp.hp | 0}/${role.prop.hp | 0}`;
        }, true);
        role.on('hpchange', e => {
            let per = role.varProp.hp / role.prop.hp;
            this.hpbar.width = 150 * per;
            this.hptext.text = `${role.varProp.hp | 0}/${role.prop.hp | 0}`;
        }, true);
        role.on('nmpchange', e => {
            let per = role.varProp.mp / role.prop.mp;
            this.mpbar.width = 150 * per;
            this.mptext.text = `${role.varProp.mp | 0}/${role.prop.mp | 0}`;
        }, true)
        role.on('mpchange', e => {
            let per = role.varProp.mp / role.prop.mp;
            this.mpbar.width = 150 * per;
            this.mptext.text = `${role.varProp.mp | 0}/${role.prop.mp | 0}`;
        }, true)

        role.on('addlevel', e => {
            this.level.text = e.value;
            let per = role.exp / role.fexp;
            this.expbar.width = 150 * per;
            this.exptext.text = `${role.exp | 0}/${role.fexp | 0}`;
        }, true)

        role.on('getexp', e => {
            let per = role.exp / role.fexp;
            this.expbar.width = 150 * per;
            this.exptext.text = `${role.exp | 0}/${role.fexp | 0}`;
        }, true);

        /**
         * @TODO 无双格
         */
        let urabar = new Graphics();
        urabar.x = left ? 240 : width - 240 - 10;
        urabar.y = 20;
        urabar.beginFill(0x000000, 1);
        urabar.drawRect(0, 0, 10, 42);
        barContainer.addChild(urabar);
        let ura = new Graphics();
        ura.beginFill(0xeeee00, 1);
        ura.drawRect(0, 0, 8, 40);
        ura.position.set(1, 1);
        ura.endFill();
        urabar.addChild(ura);
        role.on('timing', e => {
            // ura.height = 40 * role.uraController.uras;
            // ura.y = 40 * (1 - role.uraController.uras) + 1;
        }, true);
    }
    refresh() {
        let hpper = role.varProp.hp / role.prop.hp;
        this.hpbar.width = 150 * hpper;
        this.hptext.text = `${role.varProp.hp | 0}/${role.prop.hp | 0}`;
        let mpper = role.varProp.mp / role.prop.mp;
        this.mpbar.width = 150 * mpper;
        this.mptext.text = `${role.varProp.mp | 0}/${role.prop.mp | 0}`;
    }
}

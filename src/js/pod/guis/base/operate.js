import { Graphics, Sprite } from "pixi.js";
import { gameTink, by } from "../../../util";
// import { ThingProto } from "../../../data/bag/base";
// import { EquipProto } from "../../../data/bag/util/equip";
import { BagController } from "../bag";
// import { MaterialProto } from "../../../data/bag/util/material";

class Operater extends Graphics {
    static INSTANCE = new Operater();
    btns = []
    _textures
    get textures() {
        if (!this._textures) {
            this._textures = Array.from(new Array(8), (v, k) => by(`./res/util/gui/use${k + 1}.png`));
            this._textures.unshift('');
        }
        return this._textures;
    }
    constructor() {
        super();
        this.visible = false;
        this.lineStyle(1, 0xffffff);
        this.beginFill(0x000000, 0.8);
        this.drawRoundedRect(0, 0, 86, 120, 10);
        this.endFill();
        gameTink.makeInteractive(this);
        this.shouldBeHand = false;
        this.out = () => {
            this.hide();
        }

        let btn1 = new Sprite();
        btn1.position.set(8, 11);

        let btn2 = new Sprite();
        btn2.position.set(8, 47);

        let btn3 = new Sprite();
        btn3.position.set(8, 83);

        this.btns.push(btn1, btn2, btn3);
        this.addChild(btn1, btn2, btn3);

        this.tap = () => {
            let pointer = gameTink.pointers[0];
            if (pointer.hitTestSprite(btn1)) {
                btn1?.tap?.();
            } else if (pointer.hitTestSprite(btn2)) {
                btn2?.tap?.();
            } else if (pointer.hitTestSprite(btn3)) {
                btn3?.tap?.();
            }
        }
    }
    /**
     * @param {ThingProto} proto 
     * @param {Sprite} sprite 
     * @param {BagController} bagCtrl
     */
    show(thing, proto, sprite, bagCtrl) {
        this.cleanHandler();
        this.position.set(sprite.x + 25, sprite.y + 25);
        sprite.parent?.addChild(this);
        [this.showEquip, this.showMaterial][thing.kind].call(this, ...arguments);
        this.visible = true;
    }
    /**
     * @param {EquipProto} proto 
     * @param {Sprite} sprite 
     * @param {BagController} bagCtrl
     */
    showEquip(thing, proto, sprite, bagCtrl) {
        let role = bagCtrl.role;
        if (proto.isSuitForVita(role)) {
            this.btns[0].texture = this.textures[5];
            this.btns[0].tap = () => {
                let arr = role.bag.equip;
                arr.splice(role.bag.equip.indexOf(thing), 1);
                role.bag.equip = arr;
                role.equipController.change(thing);
                this.refreshHandler();
                this.hide();
            }
        } else {
            this.btns[0].texture = this.textures[1];
        }
        if (bagCtrl.roles.length == 2) {
            this.btns[1].texture = this.textures[7];
            this.btns[1].tap = _ => {
                let equips = role.bag.equip;
                equips.splice(equips.indexOf(thing), 1);
                let anotherEquips = bagCtrl.roles[1 - bagCtrl.roleIndex].bag.equip;
                anotherEquips.push(thing);
                this.refreshHandler();
                this.hide();
            }
        } else {
            this.btns[1].texture = this.textures[3];
        }
        this.btns[2].texture = this.textures[8];
        this.btns[2].tap = _ => {
            let equip = role.bag.equip;
            equip.splice(equip.indexOf(thing), 1);
            role.getMoney(proto.money);
            this.refreshHandler();
            this.hide();
        }
    }
    /**
     * @param {MaterialProto} proto 
     * @param {Sprite} sprite 
     * @param {BagController} bagCtrl
     */
    showMaterial(thing, proto, sprite, bagCtrl) {
        let role = bagCtrl.role;
        if (proto.canUse && proto.isSuitForVita(role)) {
            this.btns[0].texture = this.textures[6];
            this.btns[0].tap = () => {
                role.useMaterial(thing);
                this.refreshHandler();
                this.hide();
            }
        } else {
            this.btns[0].texture = this.textures[2];
        }
        if (bagCtrl.roles.length == 2) {
            this.btns[1].texture = this.textures[7];
            this.btns[1].tap = _ => {
                let anotherRole = bagCtrl.roles[1 - bagCtrl.roleIndex];
                let material = role.bag.material;
                material.splice(material.indexOf(thing), 1);
                anotherRole.getMaterial(thing);
                this.refreshHandler();
                this.hide();
            }
        } else {
            this.btns[1].texture = this.textures[3];
        }
        this.btns[2].texture = this.textures[8];
        this.btns[2].tap = _ => {
            let material = role.bag.material;
            let count = thing.count;
            material.splice(material.indexOf(thing), 1);
            role.getMoney(proto.money * count);
            this.refreshHandler();
            this.hide();
        }
    }
    cleanHandler() {
        this.btns.forEach(btn => btn.tap = undefined);
    }
    hide() {
        this.visible = false;
    }
    refreshHandler = _ => { }
    whenRefresh(handler) {
        this.refreshHandler = handler;
    }
}
export const SimpleOperator = Operater.INSTANCE;
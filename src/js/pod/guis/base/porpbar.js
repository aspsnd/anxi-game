import { Container, Text, TextStyle, Graphics } from "pixi.js";
import { Role } from "../../../po/role";

export class PropBar extends Container {
    /**
     * @type {Text}
     */
    text1
    /**
     * @type {Text}
     */
    text2

    set value(v) {
        this.text2.text = v;
    }
    get value() {
        return this.text2.text;
    }
    set name(n) {
        this.text1.text = n;
    }
    get name() {
        return this.text1.text;
    }
    constructor(_text, x, y, _style = {}, width = 100, height = 18) {
        super();
        this.position.set(x, y);
        let style = new TextStyle({
            fontSize: 12,
            fill: [0xffeeee, 0xeeeeff],
        });
        this.text1 = new Text(_text, new TextStyle({
            fill: 0xffffff,
            fontSize: 15,
            fontWeight: 'bold',
            ..._style
        }));
        this.addChild(this.text1);
        let bar = new Graphics();
        bar.lineStyle(1, 0xffffff, 0.5);
        bar.drawRoundedRect(0, 0, width, height, 2);
        bar.position.set(40, 0);
        this.text2 = new Text('--/--', style);
        this.text2.x = width / 2;
        this.text2.y = height / 2;
        this.text2.anchor.set(0.5, 0.5);
        bar.addChild(this.text2);
        this.addChild(bar);
    }
}
export class WholePropBar extends Container {
    /**
     * @param {Role} role 
     */
    bars = {
        hp: new PropBar('生命', 0, 0),
        mp: new PropBar('魔法', 150, 0),
        atk: new PropBar('攻击', 0, 35),
        def: new PropBar('防御', 150, 35),
        crt: new PropBar('暴击', 0, 70),
        dod: new PropBar('闪避', 150, 70),
        hpr: new PropBar('回血', 0, 105),
        mpr: new PropBar('回蓝', 150, 105),
        exp: new PropBar('EXP', 0, 140, {
            fontSize: 20
        }, 250),
        money: new PropBar('灵魂', 340, 143, {
            fill: 0xeeaa00
        }, 70)
    }
    constructor(role) {
        super();
        this.role = role;
        for (let prop in this.bars) {
            this.addChild(this.bars[prop]);
        }
        this.refresh(role);
    }
    /**
     * @param {Role} role 
     */
    refresh(role) {
        this.bars.hp.value = `${role.nhp | 0} / ${role.hp | 0} `;
        this.bars.mp.value = `${role.nmp | 0} / ${role.mp | 0}`;
        this.bars.atk.value = role.atk | 0;
        this.bars.def.value = role.def | 0;
        this.bars.crt.value = `${((role.crt * 100) + '').substr(0, 2) | 0}%`;
        this.bars.dod.value = `${((role.dod * 100) + '').substr(0, 2) | 0}%`;
        this.bars.hpr.value = role.hpr | 0;
        this.bars.mpr.value = role.mpr | 0;
        this.bars.exp.value = `${role.exp | 0} / ${role.fexp}`;
        this.bars.money.value = role.money | 0;
    }
}
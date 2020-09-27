import { Atom } from "./atom"
import { ItemEvent } from "./event"
import { HurtProto } from "./proto/hurt"

/**
 * 一次行动，攻击或技能动作
 */
export class Hurt {
    crtAble = true
    dodAble = true
    crt = 0
    crtBase = Math.random();
    debuff = []
    get crted() {
        return this.crtAble && (this.crtBase < this.crt);
    }
    set crted(bool) {
        if (!this.crtAble) return;
        this.crtBase = bool ? 0 : 100;
    }
    /**
     * @param {HurtProto} proto 
     * @param {Atom} belonger 
     */
    constructor(proto, belonger) {
        this.proto = proto;
        this.belonger = belonger;
        for (let key in proto) {
            this[key] = proto[key];
        }
        this.crt = belonger.prop?.crt ?? 0;
        this.belonger.on(new ItemEvent('createhurt', this));
    }
}
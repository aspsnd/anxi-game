import { Vita } from "../atom/vita";
import { StateCache } from "../controller/state";
import { Attack } from "../hurt/attack";
import { Circle } from "../shape/shape";
import { HurtProto } from "./hurt";

export class AttackProto extends HurtProto {
    index
    freeze = 0
    time = 60
    /**
    * @type [{
    *      state:Number, //状态类型
    *      last:Number,  //持续时间
    *      dataGetter:(affect:Affect)=>{}
    * }]
    */
    debuff = []
    /**
     * @param {AttackProto} proto 
     */
    constructor(proto) {
        super({});
        Object.assign(this, proto);
    }
    checkTimes = []
    absoluteCheck = false
    /**
     * @type {(this:Attack)=>void}
     */
    executeProto = () => {}
    /**
     * @type {ActionData}
     */
    acitonData = {}
    /**
     * @param {number[]} pos 
     * @param {number} face 
     * @param {Vita} vita 
     */
    getHitGraph(pos, face, vita) {
        return new Circle(x + 50 * face, y, 50);
    }
    /**
     * 不穿透
     */
    notrans = false
}
export const defaultDebuff = [
    {
        state: StateCache.beHitBehind,
        last: 10
    }
];
export const behindDebuff = num => [
    {
        state: StateCache.beHitBehind,
        last: num
    }
];
import { getDefaultMonstView } from "../../util";
import { VitaProto } from "./vita";

export class MonstProto extends VitaProto {
    /**
     * @param {MonstProto} proto 
     */
    constructor(proto) {
        super(proto);
        Object.assign(this, proto);
    }
    /**
     * @type {{
     *  intelli:number,
     *  skillFreeze:number,
     *  attackDistance:number,
     *  skill:{
     *      index:number,
     *      rate:number,
     *      attackDistance:number,
     *      skillFreeze:number
     * }[]
     * }}
     */
    ai
    /**
     * @param {{
     *  intelli:number,
     *  skillFreeze:number,
     *  skill:{
     *      index:number,
     *      rate:number,
     *      attackDistance:number,
     *      skillFreeze:number
     * }[]
     * }} ai 
     */
    useAI(ai) {
        this.ai = ai;
        return this;
    }
    reward = {
        money: 1,
        exp: 1
    }
    useReward(money = this.reward.money, exp = this.reward.exp) {
        this.reward.money = money;
        this.reward.exp = exp;
        return this;
    }
    /**
     * @type {{
     *  equip:[number,number][],
     *  material: [number,number][],
     *  extra: [number,number][]
     * }}
     */
    drops = {
        equip: [],
        material: [],
        extra: []
    }
    /**
     * @param {{
     *  equip:[number,number][],
     *  material: [number,number][],
     *  extra: [number,number][]
     * }} drops 
     */
    useDrops(drops) {
        this.drops = drops;
        return this;
    }
    useView(index) {
        this.defaultView = getDefaultMonstView(index);
        return this;
    }
}
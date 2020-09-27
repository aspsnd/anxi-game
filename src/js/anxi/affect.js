import { Vita } from "./atom/vita";
import { ItemEvent } from "./event";
import { Hurt } from "./hurt";

export class Affect {
    /**
     * 是否暴击
     */
    crted
    // 具体伤害值
    harm = {
        common: 0,
        absolute: 0
    }
    // 减伤
    reduce = {
        common: 0,
        absolute: 0
    }
    finalHarm = 0
    /**
     * @type [{
     *      state:Number, //状态类型
     *      last:Number,  //持续时间
     *      dataGetter:(affect:Affect)=>{}
     * }]
     */
    debuff = []
    /**
     * @type [{
     *      state:Number, //状态类型
     *      last:Number,  //持续时间
     *      dataGetter:(affect:Affect)=>{}
     * }]
     */
    finalDefuff = []
    /**
     * @param {Hurt} proto 
     * @param {Vita} from 
     * @param {Vita} to 
     */
    constructor(proto, from, to) {
        this.proto = proto;
        this.from = from;
        this.to = to;
        this.debuff = proto.debuff ?? this.debuff;
        this.isCrt = proto.isCrt ?? this.isCrt;
        this.harm = proto.harm ?? this.harm;
    }
    bedoded = false
    setout() {
        this.from.on(new ItemEvent('setAffect', this, this.to));
        this.finalDefuff = this.debuff;
        this.to.on(new ItemEvent('getAffect', this, this.from));
        this.bedoded || this.to.on(new ItemEvent('beAffect', this, this.from));
        this.from.on(new ItemEvent('resAffect', this, this.to));
    }
}
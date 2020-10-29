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
     * @param {(this:Affect, affect:Affect)=>void} initer
     */
    constructor(proto, from, to, initer = _ => { }) {
        this.proto = proto;
        this.from = from;
        this.to = to;
        this.debuff = proto.debuff ?? this.debuff;
        this.isCrt = proto.isCrt ?? this.isCrt;
        this.harm = proto.harm ?? this.harm;
        initer.call(this, this);
    }
    bedoded = false
    setout() {
        //施法者放出效果，此时可以附加效果
        this.from.on(new ItemEvent('setAffect', this, this.to));
        this.finalDefuff = this.debuff;
        // 被击者对伤害进行数值减免
        // this.to.on(new ItemEvent('getAffectpre', this, this.from));
        //被击者对伤害进行减免
        this.to.on(new ItemEvent('getAffect', this, this.from));

        if (this.harm.common < this.reduce.common) {
            this.reduce.common = this.harm.common;
        }
        if (this.harm.absolute < this.reduce.absolute) {
            this.reduce.absolute = this.harm.absolute;
        }

        /**
         * 确定应掉血量
         */
        this.finalHarm = Math.round(this.harm.common + this.harm.absolute - this.reduce.common - this.reduce.absolute);


        //被击者结算伤害
        this.bedoded || this.to.on(new ItemEvent('beAffect', this, this.from));
        //施法者结算
        this.from.on(new ItemEvent('resAffect', this, this.to));
    }
}
import { Vita } from "../anxi/atom/vita";
import { ItemEventDispatcher } from "../anxi/event";
import { SkillProto } from "../anxi/proto/skill";

export class Skill extends ItemEventDispatcher {
    index = 0
    // 是否可以主动触发，可以同时具备被动
    active = true
    //普通技能或是法宝技能，额外被动技能
    commonType = 0
    /**
     * @type [import("../../po/eventName").EventComt]
     */
    listeners = []
    inited = false
    freezeUtil = -1
    executing = false
    data = {}
    init() {
        this.inited = true
        //添加监听器 并保存监听器们
        this.proto.initedListens.forEach(il => {
            let ecomt = this.vita.on(il.event, il.handler(this.vita, this), true);
            this.listeners.push(ecomt);
        });
        this.proto.recacutimes.forEach(en => {
            let ecomt = this.vita.on(en, e => {
                this.vita.needCompute = true;
            }, true);
            this.listeners.push(ecomt);
        })
        this.proto._onceInit.call(this, this);
        this.proto._init?.call(this, this.data);
    }
    initfunc
    removed = false
    /**
     * 移除监听器
     */
    remove() {
        this.removed = true;
        this.listeners.forEach(ecomt => {
            this.vita.removeHandler(ecomt);
        })
    }
    // 执行，可以是被动技能在某个状态触发，也可以是主动触发
    execute() { }
    // 用于结束蓄力状态
    cancel() { }
    /**
     * 
     * @param {SkillProto} data 
     */
    constructor(data) {
        super();
        this.index = data.index;
        this.proto = data;
        this.execute = data._execute;
        this.cancel = data._cancel;
        this.active = data._active;
        this.name = data._name;
        this.describe = data._describe;
        this.initfunc = data._init
        this._actionData = data._actionDataGetter(this);
    }
    /**
     * @param {Vita} vita 
     */
    link(vita) {
        this.vita = vita;
        return this;
    }
    getMp() {
        let mp = this.proto.mp;
        return typeof mp == 'number' ? mp : mp.call(this);
    }
    preventing() {
        return this.vita.stateController.includes(...this.proto.prevents);
    }
}

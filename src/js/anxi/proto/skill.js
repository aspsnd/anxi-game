import { Skill } from "../../po/skill";
import { Vita } from "../atom/vita";
import { StateCache } from "../controller/state";
import { ItemEvent } from "../event";


export class SkillProto {
    index
    constructor(index, name, describe) {
        this._name = name;
        this._describe = describe;
        this.index = index;
    }
    _init = data => { }
    /**
     * @param {(this:Skill,data:{})=>{}} _init
     */
    init(_init) {
        this._init = _init;
        return this;
    }
    _onceInit = _ => { }
    /**
     * @param {(this:Skill,skill:Skill)=>void} _onceInit 
     */
    onceInit(_onceInit) {
        this._onceInit = _onceInit;
        return this;
    }
    /**
     * @param {function(this:Skill,...)} _fn 
     */
    execute(_fn) {
        this._execute = _fn;
        return this;
    }
    _cancel = () => { }
    /**
     * @param {function(this:Skill,...)} _fn 
     */
    cancel(_fn) {
        this._cancel = _fn;
        return this;
    }
    _active = false
    active(_active = true) {
        this._active = _active;
        return this;
    }
    initedProps = {}
    /**
     * 初始化属性加成
     * @param {function(number,Vita,Skill)} func 
     */
    initProp(prop, func) {
        if (!this.initedProps[prop]) {
            this.initedProps[prop] = [];
        }
        this.initedProps[prop].push(func);
        return this;
    }
    /**
     * @type [{event:string,handler:function(Vita):function(ItemEvent)}]
     */
    initedListens = []
    /**
     * 初始化监听器
     * @param {import("../eventName").EventName} eventName
     * @param {function(Vita,Skill):function(ItemEvent)} handlerGetter
     */
    initListen(eventName, handlerGetter) {
        this.initedListens.push({
            event: eventName,
            handler: handlerGetter
        })
        return this;
    }
    recacutimes = []
    /**
     * @param {import("../eventName").EventName[]} eventNames 
     */
    whenReCacu(eventNames = []) {
        this.recacutimes = eventNames;
        return this;
    }
    mp = 0
    lost(_mp) {
        this.mp = _mp;
        return this;
    }
    getMp() {
        return typeof mp == 'number' ? this.mp : this.mp();
    }
    /**
     * 技能僵直时间 
     */
    stand = 0;
    standing(time) {
        this.stand = time;
        return this;
    }
    /**
     * 释放此技能的最小间隔
     */
    freeze = 0;
    freezing(freeze) {
        this.freeze = freeze;
        return this;
    }
    prevents = [StateCache.hard, StateCache.attack, StateCache.beHitBehind, StateCache.dizzy]
    bePrevent(arr) {
        this.prevents = arr;
        return this;
    }
    /**
     * @type {(skill:Skill)=>import("../../pod/define/type").ActionData}
     */
    _actionDataGetter = _ => { }
    /**
     * @param {import('../../pod/define/type').ActionData} _actionData 
     */
    useCommonActionData(_actionData) {
        this._actionDataGetter = _ => _actionData;
        return this;
    }
    /**
     * @param {(skill:Skill)=>import("../../pod/define/type").ActionData} adGetter 
     */
    useComplexActionData(adGetter) {
        this._actionDataGetter = adGetter;
        return this;
    }
}
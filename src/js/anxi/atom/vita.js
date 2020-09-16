import { Atom } from "../atom";
import { ItemEvent } from "../event";
import { Wall } from "./wall";
import { VitaProto } from "../proto/vita";
import { StateController } from "../controller/state";
import { ViewController } from "../controller/view";
import { World } from "./world";

export const typicalProp = ['hp', 'mp', 'atk', 'def', 'crt', 'dod', 'hpr', 'mpr', 'speed'];
/**
 * 典型单位
 */
export class Vita extends Atom {
    static ID = 0
    id = Vita.ID++
    level = 0
    name = 'undefined'
    group = -1
    selectable = false
    face = 1
    /**
     * 不要直接操作！
     */
    baseProp = {}
    extraProp = {}
    prop = {}
    registeredProp = new Set()
    varProp = {
        nhp: 0,
        hmp: 0
    }
    computeFucntions = {}
    compute() {
        this.registeredProp.forEach(pn => {
            this.caculate(pn);
        })
        this.caculateTimespeed();
    }
    caculate(prop) {
        let base_value = this.baseProp[prop];
        let old_extra_value = this.extraProp[prop];
        let new_extra_value = 0;
        this.computeFucntions[prop].forEach(fun => {
            new_extra_value += fun.call(this, base_value);
        });
        if (old_extra_value !== new_extra_value) {
            this.extraProp[prop] = new_extra_value;
            this.on(new ItemEvent(`e${prop}change`, [old_extra_value, new_extra_value]));
        }
    }
    registerProp(propName, baseValue = 0, extraValue = 0) {
        this.registeredProp.add(propName);
        this.computeFucntions[propName] = [];
        this.baseProp[propName] = baseValue;
        this.extraProp[propName] = extraValue;
        this.prop[propName] = baseValue + extraValue;
        this.on(`b${propName}change`, e => {
            let old_value = this.prop[propName]
            let new_base_value = e.value[1];
            this.prop[propName] = new_base_value + this.extraProp[propName];
            this.on(new ItemEvent(`${propName}change`, [old_value, this.prop[propName]]));
        }, true);
        this.on(`e${propName}change`, e => {
            let old_value = this.prop[propName]
            let new_extra_value = e.value[1];
            this.prop[propName] = new_extra_value + this.baseProp[propName];
            this.on(new ItemEvent(`${propName}change`, [old_value, this.prop[propName]]));
        }, true);
    }
    setBaseValue(prop, value) {
        if (!this.registeredProp.has(prop)) throw new Error('属性不存在');
        let old = this.baseProp[prop];
        if (old !== value) {
            this.baseProp[prop] = value;
            this.on(new ItemEvent(`b${prop}change`, [old, value]));
        }
    }
    skills = []
    wingSkill = undefined
    talents = []
    height = 100
    jumpTimes = 0
    maxJumpTimes = 1
    /**
     * 当前附着物
     * @type {Wall}
     */
    stickingWall = null
    inair() {
        return this.stickingWall == null;
    }
    needCompute = false
    constructor(vita_proto) {
        super(vita_proto);
        this.init(vita_proto);
    }
    init(proto) {
        this.initSelf(proto);
        this.initController();
        this.initInstruct();
        this.initStating();
        this.initReaction();
        this.initVar();
    }
    /**
     * 注册基本属性
     * @param {VitaProto} proto 
     */
    initSelf(proto) {
        typicalProp.forEach(propName => {
            this.registerProp(propName, proto.baseProp[propName]);
        });
        this.height = proto.height;
        this.name = proto.name;
        this.level = proto.level;
        this.skills = proto.skills;
        this.talents = proto.talents;
    }
    /**
     * 注册各个控制器
     */
    initController() {
        this.stateController = new StateController(this);
        this.viewController = new ViewController(this);
    }
    /**
     * 注册指令
     */
    initInstruct() {

    }
    /**
     * 注册状态监听
     */
    initStating() {

    }
    /**
     * 注册被攻击，血量变化，死亡等事件监听
     */
    initReaction() {

    }
    initVar() {

    }
    onTimer() {
        super.onTimer();
    }
    _tempX = 0
    _tempY = 0
    get x() {
        return this._tempX;
    }
    get y() {
        return this._tempY;
    }
    set x(value) {
        let oldX = this.x;
        let moveUtil = {
            old: oldX,
            value: value
        };
        this.on(new ItemEvent('movex', moveUtil));
        this._tempX = moveUtil.value;
    }
    set y(value) {
        let oldY = this.y;
        let moveUtil = {
            old: oldY,
            value: value
        };
        this.on(new ItemEvent('movey', moveUtil));
        this._tempY = moveUtil.value;
    }
    get centerY() {
        return this._tempY - this.height >> 1;
    }
    set centerY(value) {
        this.y = value + this.height >> 1;
    }
    toPlainObject() {
        return {
            name: this.name,
            level: this.level,
            attackController: this.proto.attackController,
            skills: this.skills,
            talents: this.talents,
            baseProp: this.baseProp
        };
    }
    use(instructor) {
        instructor(this);
    }
    /**
     * @param {World} world 
     */
    link(world){
        this.world = world;
        return this;
    }
}
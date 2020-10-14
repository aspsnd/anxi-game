import { Atom } from "../atom";
import { ItemEvent } from "../event";
import { Wall } from "../conster/wall";
import { VitaProto } from "../proto/vita";
import { SingleState, StateCache, StateController, StateItem } from "../controller/state";
import { ViewController } from "../controller/view";
import { World } from "./world";
import { GameHeight, jumpContinue, jumpSpeed } from "../../util";
import { Shape } from "../shape/shape";
import { Affect } from "../affect";
import { AttackController } from "../controller/attack";
import { SkillController } from "../controller/skill";
import { Controller } from "../controller";
import { Role } from "../../po/atom/role";

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
    selectable = true
    face = 1
    /**
     * 不要直接操作！
     */
    baseProp = {}
    extraProp = {}
    prop = {}
    registeredProp = new Set()
    varProp = {
        hp: 0,
        mp: 0
    }
    computeFunctions = {}
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
        this.computeFunctions[prop].forEach(fun => {
            new_extra_value += fun.call(this, base_value);
        });
        if (old_extra_value !== new_extra_value) {
            this.extraProp[prop] = new_extra_value;
            this.on(new ItemEvent(`e${prop}change`, [old_extra_value, new_extra_value]));
        }
    }
    registerProp(propName, baseValue = 0, extraValue = 0) {
        this.registeredProp.add(propName);
        this.computeFunctions[propName] = [];
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
        this.initEvent();
    }
    /**
     * 注册各个控制器
     */
    initController() {
        this.stateController = new StateController(this);
        this.viewController = new ViewController(this);
        this.attackController = new AttackController(this, this.proto.attacks);
        this.skillController = new SkillController(this);
    }
    getCanRun() {
        var ps = this.stateController.states[StateCache.go];
        return this.timer - ps.lastGet < 25 && this.timer > 25;
    }
    jumpTimes = 0
    maxJumpTimes = 1
    /**
     * 注册指令
     */
    initInstruct() {
        this.on('wantleft', e => {
            if (this.stateController.includes(StateCache.hard, StateCache.beHitBehind, StateCache.dizzy, StateCache.attack)) return;
            if (this.stateController.has(StateCache.go) && this.face == -1) return;
            if (this.getCanRun() && this.face == -1) {
                this.stateController.setStateInfinite(StateCache.go, false);
                this.stateController.setStateInfinite(StateCache.run, true);
            } else {
                this.face = -1;
                this.stateController.setStateInfinite(StateCache.go, true);
            }
        }, true)
        this.on('wantright', e => {
            if (this.stateController.includes(StateCache.hard, StateCache.beHitBehind, StateCache.dizzy, StateCache.attack)) return;
            if (this.stateController.has(StateCache.go) && this.face == 1) return;
            if (this.getCanRun() && this.face == 1) {
                this.stateController.setStateInfinite(StateCache.go, false);
                this.stateController.setStateInfinite(StateCache.run, true);
            } else {
                this.face = 1;
                this.stateController.setStateInfinite(StateCache.go, true);
            }
        }, true);
        this.on('cancelleft', e => {
            if (this.face == 1) return;
            this.stateController.setStateInfinite(StateCache.go, false);
            this.stateController.setStateInfinite(StateCache.run, false);
        }, true)
        this.on('cancelright', e => {
            if (this.face == -1) return;
            this.stateController.setStateInfinite(StateCache.go, false);
            this.stateController.setStateInfinite(StateCache.run, false);
        }, true);
        this.on('wantjump', e => {
            if (this.stateController.includes(StateCache.hard, StateCache.attack, StateCache.beHitBehind, StateCache.dizzy)) return;
            if (this.maxJumpTimes < 1 || this.jumpTimes == this.maxJumpTimes) return;
            if (this.stickingWall?.glue) {
                return;
            }
            this.jumpTimes++;
            if (this.jumpTimes == 1) {
                this.stateController.setStateTime(StateCache.jump, jumpContinue.jump);
            } else {
                this.stateController.removeState(StateCache.jump);
                this.stateController.setStateTime(StateCache.jumpSec, jumpContinue.jumpSec);
            }
        }, true);
        this.on('wantdown', e => {
            if (this.stateController.has(StateCache.drop) || this.stateController.includes(StateCache.jumpSec, StateCache.jump, StateCache.hover)) return;
            if (!this.stickingWall) return;
            if (!this.stickingWall.candown) return;
            this.stateController.setStateInfinite(StateCache.drop, true);
        }, true);
        this.on('wantdrop', e => {
            if (this.stateController.has(StateCache.drop) || this.stateController.includes(StateCache.jumpSec, StateCache.jump, StateCache.hover)) return;
            if (this.stickingWall) return;
            this.stateController.setStateInfinite(StateCache.drop, true);
        }, true);
    }
    /**
     * 注册状态监听
     */
    initStating() {
        this.on(`stating_${StateCache.drop}`, e => {
            /**
             * @type {SingleState}
             */
            let ps = e.value;
            this.y += Math.min(((ps.timer + 5) ** 2) * 0.0018 * this.prop.speed, 6);
        }, true);
        this.on(`stating_${StateCache.go}`, e => {
            this.x += this.face * this.prop.speed;
        }, true)
        this.on(`stating_${StateCache.run}`, e => {
            this.x += this.face * this.prop.speed * 1.5;
        }, true)
        this.on(`stating_${StateCache.jump}`, e => {
            this.y -= jumpSpeed.jump(e.value.timer, this.prop.speed);
        }, true)
        this.on(`stating_${StateCache.jumpSec}`, e => {
            this.y -= jumpSpeed.jumpSec(e.value.timer, this.prop.speed);
        }, true)
        this.on(`stating_${StateCache.drop}`, e => {
            if (this.stateController.includes(StateCache.jumpSec, StateCache.jump, StateCache.hover)) {
                this.stateController.setStateInfinite(StateCache.drop, false);
                return;
            }
        }, true);
        this.on(`loststate_${StateCache.jump}`, e => {
            if (this.stickingWall) return;
            if (this.stateController.includes(StateCache.jump, StateCache.jumpSec, StateCache.hover)) return;
            this.stateController.setStateInfinite(StateCache.drop, true);
        }, true);
        this.on(`loststate_${StateCache.jumpSec}`, e => {
            if (this.stickingWall) return;
            if (this.stateController.includes(StateCache.jump, StateCache.jumpSec, StateCache.hover)) return;
            this.stateController.setStateInfinite(StateCache.drop, true);
        }, true);
        this.on(`loststate_${StateCache.hover}`, e => {
            if (this.stickingWall) return;
            if (this.stateController.includes(StateCache.jump, StateCache.jumpSec, StateCache.hover)) return;
            this.stateController.setStateInfinite(StateCache.drop, true);
        }, true);
        this.slowSpeed = 0;
        this.fastSpeed = 0;
        this.on(`timing`, e => {
            let despeed = Math.max(0, ...this.stateController.getSingleState(StateCache.slow).items.map(item => item.data));
            let fastspeed = this.stateController.getSingleState(StateCache.fast).items.reduce((p, c) => p + c.data, 0);
            let newExtra = fastspeed - despeed;
            if (this.extraProp.speed != newExtra) {
                let revalue = this.extraProp.speed;
                this.extraProp.speed = newExtra;
                this.on(new ItemEvent('espeedchange', [revalue, newExtra]));
            }
        }, true);
        this.on('movex', e => {
            let moveUtil = e.value;
            let { old, value } = moveUtil;
            let limit = this.world.stepManager.limit;
            value = Math.max(limit[0], Math.min(limit[1], value));
            this.world.walls.some(wall => {
                if (wall.canup) return false;
                if (wall.willHitByX(value, this.y, this.height)) {
                    console.log('hti');
                    if (value > old) {
                        value = wall.x;
                        wall.on(new ItemEvent('holdvita_1', this));
                        this.on(new ItemEvent('behold_1'), wall);
                    } else {
                        value = wall.x + wall.width;
                        wall.on(new ItemEvent('holdvita_2', this));
                        this.on(new ItemEvent('behold_2'), wall);
                    }
                    return true;
                }
                return false;
            })
            if (this.stickingWall?.willOutByX(value)) {
                this.stickingWall = null;
                this.stateController.setStateInfinite(StateCache.drop, true);
            }
            moveUtil.value = value;
        }, true);
        this.on('movey', e => {
            let moveUtil = e.value;
            let { old, value } = moveUtil;
            this.stickingWall = null;
            this.stateController.setStateInfinite(StateCache.drop, true);
            if (value > old) {
                //下落 看看是否有墙体收留
                this.world.walls.some(wall => {
                    if (wall.willStickByY(old + this.height, value + this.height, this.x)) {
                        this.stickingWall = wall;
                        this.stateController.removeState(StateCache.drop);
                        this.jumpTimes = 0;
                        moveUtil.value = wall.y - this.height;
                        return true;
                    }
                    return false;
                })
            } else {
                //上升 判断是否撞墙
                this.world.walls.some(wall => {
                    if (wall.canup) return false;
                    if (wall.willHitByY(this.x, value)) {
                        moveUtil.value = wall.y + wall.height;
                        wall.on(new ItemEvent('holdvita_0', this));
                        this.on(new ItemEvent('behold_0', wall));
                        return true;
                    }
                    return false;
                })
            }
        }, true);
        this.on('timing', e => {
            if (this.die || this.timer % 60 > 0) return;
            if (this.varProp.hp < this.prop.hp && this.prop.hpr > 0) {
                let rhp = this.varProp.hp;
                this.varProp.hp = Math.min(this.prop.hpr + rhp, this.prop.hp);
                this.on(new ItemEvent('nhpchange', [rhp, this.varProp.hp], this));
            }
            if (this.varProp.hp < this.prop.mp && this.prop.mpr > 0) {
                let rmp = this.varProp.mp;
                this.varProp.mp = Math.min(this.prop.mpr + rmp, this.prop.mp);
                this.on(new ItemEvent('nhpchange', [rmp, this.varProp.mp], this));
            }
        }, true);
        this.on('behold_0', e => {
            this.state.removeState(StateCache.jump, StateCache.jumpSec);
        }, true)
        this.once(`timer_${1}`, e => {
            this.on('wantdrop');
        });
    }
    // 初始化最基本的变化 基础(额外)属性变化-> 最终属性变化
    initEvent() {
        typicalProp.forEach(p => {
            this.on(`b${p}change`, e => {
                let oldbasevalue = e.value[0];
                let newbasevalue = e.value[1];
                this.prop[p] = newbasevalue + this.extraProp[p];
                let changeEvent = new ItemEvent(`${p}change`, [this.extraProp[p] + oldbasevalue, this.prop[p]]);
                this.on(changeEvent);
            }, true);
            this.on(`e${p}change`, e => {
                let oldextravalue = e.value[0];
                let newextravalue = e.value[1];
                this.prop[p] = newextravalue + this.baseProp[p];
                let changeEvent = new ItemEvent(`${p}change`, [this.baseProp[p] + oldextravalue, this.prop[p]]);
                this.on(changeEvent);
            }, true);
        })
    }
    /**
     * 注册被攻击，血量变化，死亡等事件监听
     */
    initReaction() {
        /**
         * 闪避判定
         * 护甲减伤判定
         * 状态免疫判定
         */
        this.on('getAffect', e => {
            /**
             * @type {Affect}
             */
            let affect = e.value;

            affect.bedoded = affect.proto.dodAble && Math.random() < this.prop.dod;
            if (affect.bedoded) {
                this.on(new ItemEvent('dodaffect', affect, e.from));
                e.from.on(new ItemEvent('dodedaffect', affect, this));
                return;
            }

            /**
             * 参考lol护甲减伤机制
             */
            affect.reduce.common += this.prop.def >= 0 ? affect.harm.common * this.prop.def / (this.prop.def + 100) : affect.harm * this.prop.def / 100;

            if (affect.harm.common < affect.reduce.common) {
                affect.reduce.common = affect.harm.common;
            }
            if (affect.harm.absolute < affect.reduce.absolute) {
                affect.reduce.absolute = affect.harm.absolute;
            }

            /**
             * 确定应掉血量
             */
            affect.finalHarm = Math.round(affect.harm.common + affect.harm.absolute - affect.reduce.common - affect.reduce.absolute);

            /**
             * 是否无敌
             */
            if (this.stateController.has(StateCache.IME)) {
                affect.reduce.common = affect.harm.common;
                affect.reduce.absolute = affect.harm.absolute;
            }

            /**
             * 免控减少机制
             */
            if (this.stateController.has(StateCache.URA)) {
                affect.finalDefuff = [];
            } else {

            }
        }, true);
        this.on('beAffect', e => {
            /**
             * @type {Affect}
             */
            let affect = e.value;
            /**
             * 触发掉血事件
             */
            let rhp = this.varProp.hp;
            let nhp = Math.max(rhp - affect.finalHarm, 0);
            this.varProp.hp = nhp;
            this.on(new ItemEvent('nhpchange', [rhp, nhp], e.from));

            //实现控制效果
            if (affect.finalDefuff.find(buff => [StateCache.beHitBehind, StateCache.dizzy].includes(buff.state))) {
                this.stateController.removeState(StateCache.go, StateCache.run, StateCache.attack, StateCache.rest);
            }
            affect.finalDefuff.forEach(buff => {
                this.stateController.insertState(buff.state, new StateItem(buff.last, false, buff.dataGetter?.(affect)));
            })
        }, true)
        this.on('nhpchange', e => {
            if (this.varProp.hp <= 0) {
                if (!this.dead) {
                    this.dead = true;
                    this.on(new ItemEvent('dead', undefined, e.from));
                }
            }
        }, true)
        this.on('dead', e => {
            this.ai && this.ai.destory();
            this.ai = null;
            this.stateController.setStateInfinite(StateCache.dead, true);
        }, true)
    }
    initVar() {
        this.varProp = {
            hp: this.prop.hp,
            mp: this.prop.mp
        }
    }
    onTimer() {
        super.onTimer();
        if (this.needCompute) {
            this.needCompute = false;
            this.compute();
        }
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
        if (Number.isNaN(value)) throw new Error('argsError');
        if (value == this._tempX) return;
        let oldX = this._tempX;
        let moveUtil = {
            old: oldX,
            value: value
        };
        this.on(new ItemEvent('movex', moveUtil));
        this._tempX = moveUtil.value;
    }
    set y(value) {
        if (Number.isNaN(value)) throw new Error('argsError');
        if (value == this._tempY) return;
        let oldY = this._tempY;
        let moveUtil = {
            old: oldY,
            value: value
        };
        this.on(new ItemEvent('movey', moveUtil));
        this._tempY = moveUtil.value;
    }
    get centerY() {
        return this._tempY + (this.height >> 1);
    }
    set centerY(value) {
        this.y = value - (this.height >> 1);
    }
    toPlainObject() {
        return {
            name: this.name,
            level: this.level,
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
    link(world) {
        this.world = world;
        return this;
    }
    /**
     * @return {Shape}
     */
    getHitGraph() {
        return this.proto.getHitGraph([this.x, this.y], this.face, this);
    }
    /**
     * @return {Controller}
     * @param {string} name 
     * @param {Controller} ControllerClass 
     */
    getController(name, ControllerClass) {
        if (!this[name]) {
            this[name] = new ControllerClass(this);
        }
        return this[name];
    }
}
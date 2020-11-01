import { Graphics } from "pixi.js";
import { typicalProp, Vita } from "../../anxi/atom/vita";
import { World } from "../../anxi/atom/world";
import { EquipController } from "../../anxi/controller/equip";
import { MoneyController } from "../../anxi/controller/money";
import { StateCache } from "../../anxi/controller/state";
import { URAController } from "../../anxi/controller/ura";
import { EquipKind, ExtraKind, MaterialKind } from "../../anxi/define/util";
import { AnxiError } from "../../anxi/error/base";
import { ItemEvent } from "../../anxi/event";
import { RoleProto } from "../../anxi/proto/role";
import { ThingProto } from "../../anxi/proto/thing/base";
import { RoleProtos } from "../../data/role/all";
import { GUI } from "../gui";

export class Role extends Vita {
    static RoleGroup = 0
    /**
     * @type {GUI}
     */
    gui
    group = Role.RoleGroup
    exp = 0
    fexp = 1
    money = 0
    /**
     * @type {{
        *      weapon,
        *      body,
        *      dcrt,
        *      wing
        * }}
        */
    equip = {
        weapon: undefined,
        body: undefined,
        dcrt: undefined,
        wing: undefined
    }
    /**
     * @type {{
     *  equip:[],
     *  material:{
     *      proto:number,
     *      count:number
     * }[],
     *  extra:[]
     * }}
     */
    bag = {
        equip: [],
        material: [],
        extra: []
    }
    maxJumpTimes = 2
    constructor(role_proto, world = World.instance) {
        let realProto = Object.assign({}, role_proto, RoleProtos[role_proto.index], role_proto);
        super(realProto, world);
        this.initRole(realProto);
    }
    /**
     * @param {RoleProto} role_proto 
     */
    initRole(role_proto) {
        this.index = role_proto.index;
        this.exp = role_proto.exp || this.exp;
        this.fexp = role_proto.getFexp(this.level);
        this.money = role_proto.money || this.money;
        this.bag = role_proto.bag || this.bag;
        this.equip = role_proto.equip || this.equip;
        this.wingSkill = role_proto.wingSkill || this.wingSkill;
        this.skillController.initWingSkill();
    }
    initController() {
        super.initController();
        this.moneyController = new MoneyController(this);
        this.uraController = new URAController(this);
        this.equipController = new EquipController(this);
    }
    initEvent() {
        super.initEvent();
        this.on('overexp', e => {
            this.reduceEXP(this.fexp);
            let growth = this.proto.nextLevel(this, this.level + 1);
            for (const key in growth) {
                let value = growth[key];
                this.setBaseValue(key, this.baseProp[key] + value);
            }
            this.varProp.hp = this.prop.hp;
            this.varProp.mp = this.prop.mp;
            this.on('nhpchange');
            this.on('nmpchange');
            this.level = this.level + 1;
            this.fexp = this.proto.getFexp(this.level);
            this.on(new ItemEvent('addlevel', this.level));
        }, true);
        this.on('dead', e => {
            let roles = this.world.roles;
            if (roles.every(role => role.dead)) {
                this.world.once(`timer_${this.world.timer + 90}`, e => {
                    this.world.stop();
                    this.world.end(true);
                })
            }
        }, true);
        this.on('getmoney', e => {
            let r = Math.random();
            if (r < 0.02) {
                this.getHP(parseInt(this.prop.hp * 0.05 * (0.5 + Math.random())), this);
            } else if (r < 0.04) {
                this.getMP(parseInt(this.prop.mp * 0.05 * (0.5 + Math.random())), this);
            } else if (r < 0.08) {
                this.getHP(parseInt(this.prop.hp * 0.05 * (0.5 + Math.random())), this);
                this.getMP(parseInt(this.prop.mp * 0.05 * (0.5 + Math.random())), this);
            }
        }, true);
        this.on(`stating_${StateCache.common}`, e => {
            if (e.value.behaveTime >= this.proto.restInterval) {
                this.stateController.setStateTime(StateCache.rest, this.proto.restTime);
            }
        }, true);
        this.on(event => {
            let eventName = event.type;
            return eventName.startsWith('getstate_') && !eventName.endsWith(StateCache.rest)
        }, e => {
            this.stateController.removeState(StateCache.rest);
        }, true)
    }
    toPlainObject() {
        return Object.assign(super.toPlainObject(), {
            index: this.index,
            exp: this.exp,
            fexp: this.fexp,
            money: this.money,
            bag: this.bag,
            equip: this.equip,
            wingSkill: this.wingSkill
        });
    }
    // 获取经验
    getEXP(exp, reason = 0) {
        if (exp <= 0) throw new Error('大于0');
        this.exp += exp;
        this.on(new ItemEvent('getexp', exp, reason));
        while (this.exp >= this.fexp) {
            this.on(new ItemEvent('overexp', this.exp, reason));
        }
    }
    // 升级减少经验
    reduceEXP(exp) {
        if (this.exp < exp) throw new Error('不够');
        this.exp -= exp;
        this.on(new ItemEvent('reduceexp', exp));
    }
    // 用于游戏中获取灵魂
    getMoney(money, reason = 0) {
        if (money <= 0) throw new Error('大于0');
        this.money += money;
        let event = new ItemEvent('getmoney', money, reason);
        this.on(event);
    }
    // 使用灵魂
    reduceMoney(money, reason = 0) {
        if (money <= 0) throw new Error('大于0');
        if (money > this.money) return false;
        this.money -= money;
        let event = new ItemEvent('reducemoney', money, reason);
        this.on(event);
        return true;
    }
    refresh() {
        this.dead = false;
        this.realDead = false;
        this.world = null;
        this.group = Role.RoleGroup;
        this.lastTimerFrame = 0;
        this.frame = 0;
        this.stickingWall = null;
        this.timer = 0;
        this.face = 1;
        this.computeFunctions = {};
        this.timeChangeRates = [];
        typicalProp.forEach(p => {
            this.computeFunctions[p] = [];
        })
        this.refreshHandler();
        for (let p in this) {
            if (/Controller$/.test(p)) {
                this[p]?.refresh();
            }
        }
        this.compute();
        this.varProp.hp = this.prop.hp;
        this.varProp.mp = this.prop.mp;
        this.on('nhpchange');
        this.on('nmpchange');
        this.gui.refresh();
    }
    /**
     * @param {ThingProto} thing 
     */
    getThing(thing) {
        switch (thing.kind) {
            case EquipKind: this.bag.equip.push(thing); break;
            case MaterialKind: {
                this.getMaterial(thing);
            }; break;
            case ExtraKind: this.bag.extra.push(thing); break;
        }
    }
    getMaterial(material) {
        let index = this.bag.material.findIndex(tb => tb.id == material.id);
        if (index == -1) {
            this.bag.material.push(material);
        } else {
            this.bag.material[index].count += material.count;
        };
    }
    reduceThing(obj) {
        switch (obj.kind) {
            case 0: this.bag.equip.splice(this.bag.equip.indexOf(obj), 1); break;
            case 1: {
                this.reduceMaterial(obj, 1);
            }; break;
            case 2: this.bag.extra.splice(this.bag.extra.indexOf(obj), 1); break;
        }
    }
    reduceMaterial(thing, count = 1) {
        thing.count -= count;
        if (thing.count < 0) throw new AnxiError('imposible error!');
        if (thing.count == 0) {
            this.bag.material.splice(this.bag.material.indexOf(thing), 1);
        }
    }
}
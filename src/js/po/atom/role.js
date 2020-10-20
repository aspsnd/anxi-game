import { Vita } from "../../anxi/atom/vita";
import { MoneyController } from "../../anxi/controller/money";
import { StateCache } from "../../anxi/controller/state";
import { URAController } from "../../anxi/controller/ura";
import { ItemEvent } from "../../anxi/event";
import { RoleProto } from "../../anxi/proto/role";
import { RoleProtos } from "../../data/role/all";

export class Role extends Vita {
    group = 0
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
    constructor(role_proto) {
        let realProto = Object.assign({}, role_proto, RoleProtos[role_proto.index], role_proto);
        super(realProto);
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
    }
    initController() {
        super.initController();
        this.moneyController = new MoneyController(this);
        this.uraController = new URAController(this);
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
        this.on('finishcard', e => {
            if (this.world.win) {
                this.world.cross();
                this.world.end(true);
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
        for (let p in this) {
            if (/Controller$/.test(p)) {
                this[p]?.refresh();
            }
        }
        this.compute();
        this.varProp.hp = this.prop.hp;
        this.varProp.mp = this.prop.mp;
        this.gui.refresh();
        this.dead = false;
    }
}
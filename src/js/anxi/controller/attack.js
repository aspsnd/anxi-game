import { AttackProtos } from "../../data/attack/all";
import { by } from "../../util";
import { Controller } from "../controller";
import { AnxiError } from "../error/base";
import { Attack } from "../hurt/attack";
import { StateCache } from "./state";

export class AttackController extends Controller {
    bulletTexture
    lastAttackType = 0
    types = []
    jumptype = 0
    // 被禁用 角色时间到达此处前不得再次攻击
    freezeUntil = 0
    /**
     * @param {Vita} vita 
     * @param {Array | {protos:number[],jump:number}} rule 
     */
    constructor(vita, rule) {
        super(vita);
        this.use(rule);
        this.init();
    }
    /**
     * 
     * @param {Array | {protos:number[],jump:number}} rule 
     */
    use(rule) {
        if (rule instanceof Array || rule instanceof Proxy) {
            this.types = Array.of(...rule);
            this.jumptype = this.types[this.types.length - 1];
        } else {
            this.types = Array.of(...rule.protos);
            this.jumptype = Number(rule.jump);
        }
    }
    changeBullet(bulletUrl) {
        this.bulletTexture = by(bulletUrl);
    }
    init() {
        this.bulletTexture = by(this.belonger.proto.bulletUrl);
        this.belonger.on('wantattack', e => {
            if (this.belonger.dead) return;
            let { timer, stateController } = this.belonger;
            if (this.freezeUntil > timer) return;
            if (stateController.includes(StateCache.beHitBehind, StateCache.dizzy, StateCache.hard, StateCache.attack)) return;
            if (stateController.includes(StateCache.jump, StateCache.jumpSec, StateCache.drop)) {
                this.execute(this.jumptype);
            } else if (stateController.includes(StateCache.go, StateCache.run)) {
                stateController.removeState(StateCache.go, StateCache.run);
                this.execute(this.types[this.nextCType()]);
            } else {
                this.execute(this.types[this.nextCType()]);
            }
        }, true);
        this.belonger.on(`loststate_${StateCache.attack}`, e => {
            this.belonger.viewController.removeAction(this.lastActionIndex);
        }, true);
    }
    execute(type) {
        const timer = this.belonger.timer;
        const attackProto = AttackProtos[type];
        this.freezeUntil = timer + (attackProto.freeze || attackProto.time);
        this.belonger.stateController.setStateTime(StateCache.attack, attackProto.time);
        this.lastActionIndex = this.belonger.viewController.insertAction(attackProto.acitonData);
        new Attack(attackProto, this.belonger).execute();
    }
    nextCType() {
        let len = this.types.length;
        if (this.belonger.timer - this.belonger.stateController.states[StateCache.attack].lastLost < 30) {
            return (this.lastAttackType++) % len;
        } else {
            return (this.lastAttackType = 0);
        }
    }
    refresh() {
        this.lastAttackType = 0;
        this.freezeUntil = 0;
    }
}
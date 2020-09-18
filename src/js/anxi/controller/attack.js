import { by } from "../../util";
import { Controller } from "../controller";
import { AnxiError } from "../error/base";
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
    init() {
        this.bulletTexture = by(this.belonger.proto.bulletUrl);
        this.belonger.on('wantattack', e => {
            let { timer, stateController } = this.belonger;
            if (this.freezeUntil > timer) return;
            if (stateController.includes(StateCache.beHitBehind, StateCache.dizzy, StateCache.hard)) return;
            if (stateController.includes(StateCache.jump, StateCache.jumpSec, StateCache.drop)) {
                this.execute(this.jumptype);
            } else if (stateController.includes(StateCache.go, StateCache.run)) {
                stateController.removeState(StateCache.go, StateCache.run);
                this.execute(this.nextCType());
            } else {
                this.execute(this.nextCType());
            }
        }, true);
    }
    execute(_type) {
        let type = this.types[_type - 1];
        const timer = this.belonger.timer;
        // const attackInstance = AttackActions[type];
        this.freezeUntil = timer + (attackInstance.freeze || attackInstance.time);
        this.vita.state.setStateTime(StateCache.attack, attackInstance.time);
        let action = AttackActions[type];
        this.lastActionIndex = this.vita.viewController.insertAction(action);
        new Attack(type).from(this.vita).execute();
    }
    nextCType() {
        let len = this.types.length;
        if (this.belonger.timer - this.belonger.stateController.states[StateCache.attack].lastLost < 30) {
            return (this.lastAttackType++) % len;
        } else {
            return (this.lastAttackType = 0);
        }
    }
}
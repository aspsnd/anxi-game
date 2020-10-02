import { ActionData } from "../action/action";
import { Affect } from "../affect";
import { Vita } from "../atom/vita";
import { ItemEvent } from "../event";
import { Hurt } from "../hurt";
import { AttackProto } from "../proto/attack";

/**
 * 一次攻击实例化一个Attack对象
 */
export class Attack extends Hurt {
    harm = {
        common: 0,
        absolute: 0
    }
    checkTimes = []
    /**
     * @param {AttackProto} proto 
     * @param {Vita} vita 
     */
    constructor(proto, vita) {
        super(proto, vita);
        this.proto = proto;
        this.belonger = vita;
        this.checkbar = vita;
        for (let key in proto) {
            this[key] = proto[key];
        }
        this.harm.common = vita.prop.atk;
        this.belonger.on(new ItemEvent('createAttack', this));
    }
    absoulteCheck = false
    notrans = false
    checkbar
    check(checker){
        this.checkbar = checker;
    }
    execute() {
        this.executeProto();
        let vita = this.belonger;
        for (let wait of this.checkTimes) {
            vita.once(`timer_${vita.timer + wait}`, e => {
                if (this.finished) return;
                if (this.interrupted && !this.absoluteCheck) return;
                /**@type Vita[] */
                let shoots = this.getShootedVita();
                if (this.proto.notrans && shoots.length > 0) {
                    this.finish = true;
                }
                shoots.forEach(vita => {
                    this.shootedVitas.push(vita.id);
                    /**
                     * 这是单位之间一对一的效果 可以包括伤害和debuff
                     */
                    let affect = new Affect(this, this.belonger, vita);
                    affect.setout();
                })
            });
        }
    }
    shootedVitas = []
    executeProto() { }
    /**
     * @type {ActionData}
     */
    acitonData = {}
    finished = false
    interrupted = false
    beInterrupt() {

    }
    getShootedVita() {
        let hitarea = this.proto.getHitGraph([this.checkbar.x, this.checkbar.y], this.belonger.face, this.belonger);
        let allVitas = this.belonger.world.selectableVitas();
        return allVitas.filter(vita => vita.group != this.belonger.group)
            .filter(vita => !this.shootedVitas.includes(vita.id))
            .filter(vita => hitarea.hit(vita.getHitGraph()));
    }
}
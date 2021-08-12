import { IFC } from "../../../util";
import { Vita } from "../../atom/vita";
import { Controller } from "../../controller";
import { Instruct } from "./instruct";
import { AnxiMonstBehaviorTree } from "./src/behaviortree";

export class AIController extends Controller {
    /**
     * @type {import("../../define/type").HAI}
     */
    hai
    //是否进行技能循环判断
    haveSkill = false
    // 防止频繁释放技能
    nextSkillTime = 0
    //计算视野范围
    watchDistance = 0
    //索敌时间
    catchTime = 0
    //索敌距离
    catchDistance = 0
    //索敌延迟
    catchWait = 0
    //思考周期
    thinkCyc = 1
    /**
     * @type {Instruct[]}
     */
    instructs = []
    /**
     * @param {Vita} atom 
     */
    constructor(atom) {
        super(atom);
        this.hai = Object.assign({}, atom.proto.ai);
        this.init();
    }
    init() {
        this.belonger.on(`timing`, this.onTimer.bind(this));
        this.reInitHAI();
    }
    reInitHAI() {
        this.haveSkill = this.hai.skill && this.hai?.skill.length > 0;
        this.attackDistance = this.hai.attackDistance ?? 50;
        let intelli = this.hai.intelli;
        this.watchDistance = new IFC(intelli)
            .less(4, 150)
            .less(7, 200 + this.attackDistance)
            .less(9, 960)
            .null(1000).value;
        this.catchTime = new IFC(intelli)
            .less(4, 60)
            .less(7, 3 * 60)
            .less(9, 5 * 60)
            .null(30 * 60).value;
        this.catchDistance = new IFC(intelli)
            .less(4, Math.max(this.attackDistance - 15, 10))
            .less(7, 15 + 0.6 * this.attackDistance)
            .less(9, this.attackDistance)
            .null(this.attackDistance + 50).value;
        this.catchWait = new IFC(intelli)
            .less(4, 120)
            .less(7, 60)
            .less(9, 30)
            .equal(9, 10)
            .null(5).value;
        this.thinkCyc = new IFC(intelli)
            .less(4, 30)
            .less(7, 20)
            .less(9, 10)
            .equal(9, 5)
            .null(1).value;
    }
    /**
     * @type {Vita}
     */
    catchingEnemy
    onTimer() {
        let timer = this.belonger.timer;
        let istct = this.instructs[0];
        if (istct && !istct.used && (timer >= istct.waitTime + 1)) {
            istct.used = true;
            this.belonger.on(istct.event);
        }
        if (!this.belonger.dead && timer % this.thinkCyc == 0) this.think();
    }
    think(timer = this.belonger.timer) {
        // 思考流程 ： 是否可以自由行动 -> 攻击范围有没有人 -> 是否在追击中 （继续追）-> 视野是否有人(大概率决定方向) -> 徘徊 
        //                                              -> 打人，放技能或A （优先打追击中的）
        let vita = this.belonger;
        let instruct = AnxiMonstBehaviorTree.getNextInstruct(vita);
        if (!instruct.event) return;
        this.instructs.unshift(instruct);
    }
    /**
      * @return [{
      *      vita:Vita,
      *      distance:number
      * }]
      * @param {number} distance 
      */
    getEnemyByDistance(distance) {
        return this.belonger.world.selectableVitas()
            .filter(vita => vita.group != this.belonger.group)
            .map(vita => {
                return {
                    vita: vita,
                    distance: (vita.x - this.belonger.x)
                }
            })
            .filter(_vita => Math.abs(_vita.distance) <= distance)
            .sort((_v1, _v2) => _v1.distance - _v2.distance);
    }
    /**
      * @return [{
      *      vita:Vita,
      *      distance:number
      * }]
      * @param {number} distance 
      */
    getEnemyByAbsDistance(distance) {
        return this.belonger.world.selectableVitas()
            .filter(vita => vita.group != this.belonger.group)
            .map(vita => {
                return {
                    vita: vita,
                    distance: Math.abs(vita.x - this.belonger.x)
                }
            })
            .filter(_vita => Math.abs(_vita.distance) <= distance)
            .sort((_v1, _v2) => _v1.distance - _v2.distance);
    }
    /**
     * @param {Vita} target 
     * @param {number} distance 
     */
    inDistance(target, distance) {
        return target && !target.dead && Math.abs(this.belonger.x - target.x) <= distance;
    }
    randomWait() {
        return this.catchWait == 0 ? 0 : Math.floor(this.belonger.world.random() * this.catchWait);
    }
}
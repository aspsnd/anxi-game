import { IFC } from "../../../util";
import { Vita } from "../../atom/vita";
import { Controller } from "../../controller";
import { Instruct } from "./instruct";

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
        this.hai = atom.proto.ai;
        this.init();
    }
    init() {
        this.belonger.on(`timing`, this.onTimer.bind(this));
        this.reInitHAI();
    }
    reInitHAI() {
        this.haveSkill = this.hai.skill.length > 0;
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
    onTimer() {
        let istct = this.instructs[0];
        if (istct && !istct.used && (time >= istct.waitTime + 1)) {
            istct.used = true;
            this.belonger.on(istct.event);
        }
        if (this.belonger.timer % this.thinkCyc == 0) this.think(time);
    }
    think(timer = this.belonger.timer) {
        // 思考流程 ： 是否可以自由行动 -> 攻击范围有没有人 -> 是否在追击中 （继续追）-> 视野是否有人(大概率决定方向) -> 徘徊 
        //                                              -> 打人，放技能或A （优先打追击中的）
        let vita = this.belonger;
        let state = vita.stateController;
    }
}
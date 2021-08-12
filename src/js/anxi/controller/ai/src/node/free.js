import { randomNode } from "../../../../../util";
import { Vita } from "../../../../atom/vita";
import { ItemEvent } from "../../../../event";
import { StateCache } from "../../../state";
import { Instruct } from "../../instruct";
import { BehaviorTree } from "../base";
import { NullNode } from "../behaviortree";

export const FreeNode = new BehaviorTree(vita => {

    /**
     * 是否释放技能
     */
    if (vita.aiController.haveSkill && vita.aiController.nextSkillTime < vita.timer) {
        for (const _skill of vita.aiController.hai.skill) {
            let skill = vita.skillController.skills[_skill.index];
            if (!vita.skillController.isExecutableSkill(skill)) continue;
            if (vita.world.random() > _skill.rate) continue;
            /**
             * @type {Vita}
             */
            let target;
            if (vita.aiController.inDistance(vita.aiController.catchingEnemy,
                Math.min(vita.aiController.catchDistance, _skill.attackDistance))) {
                target = vita.aiController.catchingEnemy;
            } else {
                const skilledEnemys = vita.aiController.getEnemyByDistance(_skill.attackDistance);
                if (skilledEnemys.length == 0) continue;
                target = randomNode(skilledEnemys).vita;
                vita.aiController.catchingEnemy = target;
            }
            vita.face = target.x > vita.x ? 1 : -1;
            let event = new ItemEvent('wantskill', _skill.index + 1, vita);
            let instruct = new Instruct(event).waitUntil(vita.aiController.randomWait() + vita.timer);
            vita.aiController.nextSkillTime = vita.timer + _skill.skillFreeze ?? vita.aiController.hai.skillFreeze ?? 0;
            return instruct;
        }
    };

    /**
     * 是否进行攻击
     */
    const atkedEnemys = vita.aiController.getEnemyByDistance(vita.aiController.attackDistance);
    if (atkedEnemys.length > 0 && vita.world.random() * 20 <= 10 + vita.aiController.hai.intelli) {
        let target;
        if (vita.aiController.inDistance(vita.aiController.catchingEnemy,
            Math.min(vita.aiController.catchDistance, vita.aiController.attackDistance))) {
            target = vita.aiController.catchingEnemy;
        } else {
            target = randomNode(atkedEnemys);
            vita.aiController.catchingEnemy = target;
        }
        vita.face = target.x > vita.x ? 1 : -1;
        let event = new ItemEvent('wantattack');
        let instruct = new Instruct(event).waitUntil(vita.timer + vita.aiController.randomWait());
        return instruct;
    }
    /**
     * 追击指令
     */
    vita.aiController.catchingEnemy = null;
    const watchedEnemys = vita.aiController.getEnemyByDistance(vita.aiController.watchDistance);
    if (watchedEnemys.length > 0 && vita.world.random() > watchedEnemys[0].distance / 960) {
        let enemy = watchedEnemys[0].vita;
        vita.face = enemy.x > vita.x ? 1 : -1;
        let event = new ItemEvent('wantgo', 150);
        let instruct = new Instruct(event);
        return instruct;
    }
    /**
     * 徘徊指令
     */
    if (vita.stateController.includes(StateCache.go, StateCache.run)) return NullNode.getNextInstruct(vita);
    if (vita.world.random() > 0.2) {
        vita.world.random() < 0.75 && (vita.face *= -1);
        let event = new ItemEvent('wantgo', parseInt(80 + 70 * vita.world.random()));
        let instruct = new Instruct(event);
        return instruct;
    }
    return NullNode.getNextInstruct(vita);
})
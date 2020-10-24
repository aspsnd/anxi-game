import { BehaviorTree } from "../base";
import { NullNode } from "../behaviortree";

export const InCtrlNode = new BehaviorTree(vita => {
    //检测是否存在可以在控制时间释放的技能
    // if (!vita.aiController.haveSkill || vita.aiController.nextSkillTime <= vita.timer) return NullNode.getNextInstruct(vita);
    // let canUseSkills = vita.skillController.skills.filter(skill => {
    //     if (!vita.skillController.isExecutableSkill(skill)) return false;

    // })
    return NullNode.getNextInstruct(vita);
})
export const SetoutSkillNode = new BehaviorTree((vita) => {

})
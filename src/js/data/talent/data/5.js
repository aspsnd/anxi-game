import { StateCache, StateItem } from "../../../anxi/controller/state";
import { SkillProto } from "../../../anxi/proto/skill";

export default new SkillProto(5, '不灭', '进入濒死状态后，自己会复活，生命值为[已击杀的敌人数量+15]%,蓝量为死亡时蓝量的一般 + [已击杀的敌人数量]%,且前4秒自身处于世界边缘，无法被伤害。')
    .active(false)
    .init(data => {
        data.used = false;
    })
    .initListen('wantdie', (vita, skill) => e => {
        if (vita.varProp.hp <= 0) {
            skill.data.used = true;
            skill.execute();
        }
    })
    .execute(function () {
        let { vita } = this;
        let power = vita.killedEnemyIds.length;
        let hp = (power + 15) * 0.01 * vita.prop.hp;
        let mp = power * 0.01 * vita.prop.mp + vita.varProp.mp * 0.5;
        vita.getHP(hp);
        vita.getMP(Math.max(mp - vita.varProp.mp, 0));
        vita.stateController.insertState(StateCache.border,
            new StateItem(240));
    })
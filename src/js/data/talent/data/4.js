import { StateCache, StateItem } from "../../../anxi/controller/state";
import { SkillProto } from "../../../anxi/proto/skill";

export default new SkillProto(4, '掠杀', '开启无双时，进入世界的边缘，一般的攻击无效，最多持续8秒。当造成伤害时，会提前结束该状态。')
    .active(false)
    .initListen('getura', (vita, skill) => e => skill.execute())
    .execute(function () {
        let { vita } = this;
        let lastTime = (Math.min(8, vita.level / 3 + 2) * 60) | 0;
        let index = vita.stateController.insertState(StateCache.border, new StateItem(lastTime));
        vita.once(`timer_${vita.timer + lastTime}`, e => {
            vita.removeHandler(vita.on('resAffect', e => {
                if (e.value.finalHarm > 0) {
                    vita.stateController.removeStateItem(StateCache.border, index);
                    return true;
                }
            }))
        });
    })
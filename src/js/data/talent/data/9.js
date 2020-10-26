import { SkillProto } from "../../../anxi/proto/skill";

export default new SkillProto(9, '冰冻世界', '开启无双时，冻结场上所有敌人时间，持续2-4秒。')
    .active(false)
    .initListen('getura', (vita, skill) => e => skill.execute())
    .execute(function () {
        let { vita } = this;
        let targets = vita.world.selectableVitas().filter(v => v.group != vita.group);
        let worldTime = vita.world.timer;
        let freezeTime = ((Math.max(vita.level / 6 + 1, 4) * 60) | 0);
        for (let target of targets) {
            target.running = false;
        }
        vita.world.once(`timer_${worldTime + freezeTime}`, e => {
            for (let target of targets) {
                target.running = true;
            }
        })
    });
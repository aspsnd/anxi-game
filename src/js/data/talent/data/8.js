import { SkillProto } from "../../../anxi/proto/skill";

export default new SkillProto(8, '绯红之王', '开启无双时，会使自身时间迅速跳跃4——9秒。')
    .active(false)
    .initListen('getura', (vita, skill) => e => skill.execute())
    .execute(function () {
        let { vita } = this;
        let time = 60 * (Math.min(3 + vita.level / 3, 9) | 0);
        for (let i = 0; i < time; i++) {
            vita.onTimer();
        }
    })

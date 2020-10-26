import { Affect } from "../../../anxi/affect";
import { Flyer } from "../../../anxi/atom/flyer";
import { Vita } from "../../../anxi/atom/vita";
import { SkillProto } from "../../../anxi/proto/skill";

export default new SkillProto(3, '雷劫', '每造成10次伤害，会在最后一次伤害的敌人引发雷击，3s冷却')
    .active(false)
    .init(data => {
        data.power = 0;
        data.lastExecute = -180;
        data.freeze = 180;
    })
    .initListen('resAffect', (vita, skill) => e => {
        if (skill.data.lastExecute + data.freeze > vita.timer) return;
        /**
         * @type {Affect}
         */
        let affect = e.value;
        if (affect.finalHarm == 0) return;
        if (++skill.data.power == 10) {
            skill.data.power = 0;
            skill.data.lastExecute = vita.timer;
        }
    })
    .execute(function (enemy) {
        /**
         * @type {Vita}
         */
        let target = enemy;
        let { vita } = this;
        let { x, centerY: y } = target;
        new Flyer();
    })
import { Affect } from "../../../../anxi/affect";
import { SkillProto } from "../../../../anxi/proto/skill";

export default new SkillProto(7, '坚决之躯', '造成的所有伤害增加自身2%当前生命值大小，受到的所有伤害减少2%已损失生命值大小。')
    .active(false)
    .initListen('getaffect', (vita, skill) => e => {
        /**
         * @type {Affect}
         */
        let affect = e.value;
        affect.reduce.common += (0.02 * (vita.prop.hp - vita.varProp.hp)) | 0;
    })
    .initListen('setAffect', (vita, skill) => e => {
        /**
         * @type {Affect}
         */
        let affect = e.value;
        affect.harm.common += (0.02 * vita.varProp.hp) | 0;
    });
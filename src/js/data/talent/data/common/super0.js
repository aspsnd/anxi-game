import { Affect } from "../../../../anxi/affect";
import { SkillProto } from "../../../../anxi/proto/skill";

export const talent10 = new SkillProto(10, '凯旋', '击杀一个单位回复该单位攻击力 * 0.5的生命值')
    .active(false)
    .initListen('killenemy', (vita, skill) => e => {
        let hpget = (e.value?.prop?.atk ?? 0) >> 1;
        if (hpget > 0) {
            vita.getHP(hpget, skill);
        }
    });

export const talent11 = new SkillProto(11, '汲魂', '击杀一个单位回复该单位防御力 * 0.5的蓝量')
    .active(false)
    .initListen('killenemy', (vita, skill) => e => {
        let mpget = (e.value?.prop?.def ?? 0) >> 1;
        if (mpget > 0) {
            vita.getMP(mpget, skill);
        }
    });
export const talent12 = new SkillProto(12, '藐视', '自身生命值95%以上时增加3 + 等级的攻击力')
    .active(false)
    .init(data => {
        data.opened = true;
    })
    .initProp('atk', (value, vita, skill) => skill.data.opened ? 3 + vita.level : 0)
    .initListen('nhpchange', (vita, skill) => e => {
        let shouldOpen = vita.varProp.hp > 0.95 * vita.prop.hp;
        if (skill.data.opened ^ shouldOpen) {
            skill.data.opened = shouldOpen;
            vita.needCompute = true;
        }
    })

export const talent13 = new SkillProto(13, '砍倒', '对最大生命值大于自身的单位造成的伤害增大5%')
    .active(true)
    .initListen('setAffect', (vita, skill) => e => {
        if (e.from.prop.hp > vita.prop.hp) {
            /**
             * @type {Affect}
             */
            let affect = e.value;
            affect.harm.common *= 1.05;
            affect.harm.absolute *= 1.05;
        }
    })

export const talent14 = new SkillProto(14, '斩杀', '对生命值少于40%的单位造成的伤害增大6%')
    .active(true)
    .initListen('setAffect', (vita, skill) => e => {
        if (e.from.prop.hp * 0.4 > e.from.varProp.hp) {
            /**
             * @type {Affect}
             */
            let affect = e.value;
            affect.harm.common *= 1.06;
            affect.harm.absolute *= 1.06;
        }
    })

export const talent15 = new SkillProto(15, '坚毅不倒', '生命值低于50%时造成的伤害增大8%')
    .active(true)
    .initListen('setAffect', (vita, skill) => e => {
        if ((vita.prop.hp >> 1) > vita.varProp.hp) {
            /**
             * @type {Affect}
             */
            let affect = e.value;
            affect.harm.common *= 1.08;
            affect.harm.absolute *= 1.08;
        }
    })

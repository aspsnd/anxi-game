import { Affect } from "../../../../anxi/affect";
import { SkillProto } from "../../../../anxi/proto/skill";

export const talent28 = new SkillProto(28, '岩甲', '增加基础防御值5% + 5 的防御值')
    .initProp('def', (value) => value * 0.05 + 5);

export const talent29 = new SkillProto(29, '骸骨镀层', '受到的伤害减少10——60，冷却1秒')
    .init(data => {
        data.nextTimer = 0;
    })
    .initListen('getAffect', (vita, skill) => e => {
        if (skill.data.nextTimer > vita.timer) return;
        skill.data.nextTimer = vita.timer + 60;
        /**
         * @type {Affect}
         */
        let affect = e.value;
        affect.reduce.common += 10 * Math.min((vita.level / 3) | 0, 6);
    })

export const talent30 = new SkillProto(30, '生命不息', '受到伤害回复8%已损失生命值，冷却3秒')
    .init(data => {
        data.nextTimer = 0;
    })
    .initListen('beAffect', (vita, skill) => e => {
        if (skill.data.nextTimer > vita.timer) return;
        skill.data.nextTimer = vita.timer + 180;
        vita.getHP(0.08 * (vita.prop.hp - vita.varProp.hp));
    })

export const talent32 = new SkillProto(32, '不灭', '生命值每降低100, 每秒回血增加1')
    .initProp('hpr', (value, vita, skill) => ((vita.prop.hp - vita.varProp.hp) * 0.01) | 0)
    .whenReCacu(['nhpchange']);

export const talents33 = new SkillProto(33, '命运', '增加本关卡受到最大伤害值20%的攻击力')
    .init(data => {
        data.power = 0;
    })
    .initProp('atk', (value, vita, skill) => skill.data.power)
    .initListen('beAffect', (vita, skill) => e => {
        /**
         * @type {Affect}
         */
        let affect = e.value;
        let power = 0.2 * (affect.harm.common + affect.harm.absolute);
        if (power > skill.data.power) {
            skill.data.power = power;
            vita.needCompute = true;
        }
    })

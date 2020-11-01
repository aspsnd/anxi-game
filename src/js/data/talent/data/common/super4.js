import { Affect } from "../../../../anxi/affect";
import { SkillProto } from "../../../../anxi/proto/skill";

export const talent34 = new SkillProto(34, '来自未来的馈赠', '濒死时会回复一分钟应得的回血和回蓝，限一次')
    .init(data => {
        data.used = false;
    })
    .initListen('wantdie', (vita, skill) => e => {
        let data = skill.data;
        if (data.used) return true;
        data.used = true;
        let { hpr, mpr } = vita.prop;
        vita.getHP(hpr * 60, skill);
        vita.getMP(mpr * 60, skill);
    })

export const talent35 = new SkillProto(35, '算法回流', '第一次攻击到一个怪时，使其智商-1(仅限电脑AI控制的怪)')
    .init(data => {
        data.targets = [];
    })
    .initListen('resAffect', (vita, skill) => e => {
        let enemy = e.from;
        if (!enemy.aiController || skill.data.targets.includes(enemy.id)) return;
        skill.data.targets.push(enemy.id);
        enemy.aiController.hai.intelli--;
        enemy.aiController.reInitHAI()
    })

export const talent36 = new SkillProto(36, '莫比乌斯时空', '受到使自身损失15%以上生命值的伤害时，回复已损失20%的蓝量，10秒冷却')
    .init(data => {
        data.nextTimer = 0;
    })
    .initListen('beAffect', (vita, skill) => e => {
        if (skill.data.nextTimer > vita.timer) return;
        /**
         * @type {Affect}
         */
        let affect = e.value;
        if (affect.finalHarm > vita.prop.hp * 0.15) {
            skill.data.nextTimer = vita.timer + 600;
            vita.getMP((vita.prop.mp - vita.varProp.mp) * 0.2);
        }
    })

export const talent37 = new SkillProto(37, '虚拟世界', '即将受到一个怪的首次伤害时，扭转本次伤害的施加方和接收方')
    .init(data => {
        data.targets = [];
    })
    .initListen('getAffect', (vita, skill) => e => {
        if (skill.data.targets.includes(e.from.id)) return;
        skill.data.targets.push(e.from.id);
        /**
         * @type {Affect}
         */
        let affect = e.value;
        affect.to = affect.from;
        affect.from = vita;
    });
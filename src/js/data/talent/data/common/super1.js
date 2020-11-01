import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { Attack } from "../../../../anxi/hurt/attack";
import { SkillProto } from "../../../../anxi/proto/skill"

export const talent16 = new SkillProto(16, '专注', '生命值高于70%时，增加15攻击力')
    .active(false)
    .init(data => {
        data.opened = true;
    })
    .initProp('atk', (value, vita, skill) => skill.data.opened ? 15 : 0)
    .initListen('nhpchange', (vita, skill) => e => {
        let shouldOpen = vita.varProp.hp > 0.7 * vita.prop.hp;
        if (skill.data.opened ^ shouldOpen) {
            skill.data.opened = shouldOpen;
            vita.needCompute = true;
        }
    })

export const talent17 = new SkillProto(17, '迅捷', '移动速度增大0.5')
    .init(function () {
        let { vita } = this;
        vita.once(`timer_${1}`, e => {
            vita.stateController.insertState(StateCache.fast, new StateItem(0, true, 0.5));
        })
    })

export const talent18 = new SkillProto(18, '焦灼', '对每个敌人的首次伤害增加10+等级*3')
    .init(data => {
        data.targets = [];
    })
    .initListen('setAffect', (vita, skill) => e => {
        if (skill.data.targets.includes(e.from.id)) return;
        skill.data.targets.push(e.from.id);
        let affect = e.value;
        affect.harm.absolute += 10 + 3 * vita.level;
    });

export const talent19 = new SkillProto(19, '会心一击', '每过5秒, 下次普通攻击伤害翻倍')
    .init(data => {
        data.nextTimer = 0;
    })
    .initListen('createAttack', (vita, skill) => e => {
        if (skill.data.nextTimer >= vita.timer) return;
        skill.data.nextTimer = vita.timer + 60 * 5;
        /**
         * @type {Attack}
         */
        let attack = e.value;
        attack.harm.common *= 2;
    })

export const talent20 = new SkillProto(20, '蓝缎带', '增大15%的基础蓝量')
    .initProp('mp', value => value * 0.15);

export const talent21 = new SkillProto(21, '风暴聚集', '每过30秒，增加1——6攻击力，最多10层')
    .init(function (data) {
        data.power = 0;
        let { vita } = this;
        for (let i = 0; i < 10; i++) {
            vita.once(`timer_${(i + 1) * 60 * 30}`, e => {
                data.power++;
                vita.needCompute = true;
            })
        }
    })
    .initProp('atk', (value, vita, skill) => Math.min((vita.level / 3) | 0, 6) * skill.data.power);

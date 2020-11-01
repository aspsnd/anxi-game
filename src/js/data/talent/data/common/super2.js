import { Affect } from "../../../../anxi/affect";
import { Vita } from "../../../../anxi/atom/vita";
import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { MonstProto } from "../../../../anxi/proto/monst";
import { SkillProto } from "../../../../anxi/proto/skill";

export const talent22 = new SkillProto(22, '灾厄', '生命值少于15%时，获得0.5秒无敌和3秒的15%伤害吸血')
    .init(data => {
        data.used = false;
    })
    .initListen('nhpchange', (vita, skill) => e => {
        if (skill.data.used) return true;
        if (vita.varProp.hp < vita.prop.hp * 0.15) {
            skill.data.used = true;
            skill.execute();
        }
    })
    .execute(function () {
        let { vita } = this;
        vita.stateController.insertState(StateCache.IME, new StateItem(30));
        let comt = vita.on('resAffect', e => {
            console.log(e.value.finalHarm);
            /**
             * @type {Affect}
             */
            let affect = e.value;
            if (affect.finalHarm > 0) {
                vita.getHP(affect.finalHarm * 0.15);
            }
        });
        vita.once(`timer_${vita.timer + 180}`, e => {
            vita.removeHandler(comt);
        })
    })

export const talent23 = new SkillProto(23, '寄生', '造成伤害时自身恢复5——30生命值，冷却2秒')
    .init(data => {
        data.nextTimer = 0;
    })
    .initListen('resAffect', (vita, skill) => e => {
        if (skill.data.nextTimer > vita.timer) return;
        if (e.value.finalHarm == 0) return;
        skill.data.nextTimer = vita.timer + 120;
        vita.getHP(5 * Math.min((vita.level / 3) | 0, 6));
    })

export const talent24 = new SkillProto(24, '趁火打劫', '对受到眩晕的敌人发起的伤害50%转化为真实伤害')
    .initListen('setAffect', vita => e => {
        /**
         * @type {Vita}
         */
        let target = e.from;
        /**
         * @type {Affect}
         */
        let affect = e.value;
        if (target.stateController.has(StateCache.dizzy)) {
            affect.harm.absolute += affect.harm.common >> 1;
            affect.harm.common >>= 1;
        }
    })

export const talent25 = new SkillProto(25, '魔王', '击杀敌人时额外获得25%的经验。')
    .initListen('killenemy', (vita, skill) => e => {
        /**
         * @type {MonstProto}
         */
        let proto = e.value.proto;
        let exp = proto.reward.exp;
        vita.getEXP(exp >> 2, skill);
    })

export const talent26 = new SkillProto(26, '骁勇', '增加5%闪避率，每击杀一种敌人，增大0.5%，最多10%')
    .init(data => {
        data.power = 0;
    })
    .initProp('dod', (value, vita, skill) => 0.05 + 0.005 * skill.data.power)
    .initListen('killenemy', (vita, skill) => e => {
        if (skill.data.power == 10) return true;
        skill.data.power++;
        vita.needCompute = true;
    })

export const talent27 = new SkillProto(27, '统领', '身边每有一个单位死亡，自身回复5——30生命值')
    .init(function () {
        this.vita.once('timer_1', e => {
            this.vita.world.on('somedie', e => {
                /**
                 * @type {Vita}
                 */
                let target = e.value;
                if (Math.abs(target.x - this.vita.x) <= 250) {
                    this.vita.getHP(5 * Math.min((this.vita.level / 3) | 0, 6));
                }
            })
        })
    })
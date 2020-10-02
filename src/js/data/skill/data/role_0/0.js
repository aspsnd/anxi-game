import { Affect } from "../../../../anxi/affect";
import { ItemEvent } from "../../../../anxi/event";
import { SkillProto } from "../../../../anxi/proto/skill";

export default new SkillProto(0,'轻灵之心', '【被动】增加[8+([等级]/10)%]的闪避率，且每当成功闪避一次攻击会回复自身已损失蓝量的10%。无双状态下每次伤害附加敌人1%当前生命值真实伤害')
.active(false)
.initProp('dod', (bv, role) => (Math.round(8 + role.level * 0.1) / 100))
.whenReCacu(['addlevel'])
.initListen('setAffect', vita => {
    return e => {
        if (vita.uraController?.uring) {
            /**
             * @type {Affect}
             */
            let affect = e.value;
            if (affect.harm.absolute <= 0 && affect.harm.common <= 0) return;
            affect.harm.absolute += Math.round(affect.to.varProp.hp * 0.01);
        }
    }
})
.initListen('dodaffect', vita => {
    return e => {
        let lostmp = vita.prop.mp - vita.varProp.mp;
        let mpr = Math.round(lostmp * 0.1);
        let rmp = vita.nmp;
        vita.varProp.mp += mpr;
        vita.on(new ItemEvent('nmpchange', [rmp, vita.varProp.mp], 'skill'));
    }
});
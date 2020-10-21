import { Sprite } from "pixi.js";
import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { ItemEvent } from "../../../../anxi/event";
import { SkillProto } from "../../../../anxi/proto/skill";
import { by, tween } from "../../../../util";

export default new SkillProto(12, '量子挪移', '激怒第一个与自己对视的人，使其陷入疯狂与所有其他单位为敌，增加血量，攻击力，时间速度，免除控制，但每秒失去10%最大生命值。对老怪无法使用，当找不到目标时且自身生命值低于10%该技能会对自己使用')
    .active(true)
    .lost(60)
    .standing(31)
    .execute(function () {
        let vita = this.vita;
        let face = vita.face;
        let timer = vita.timer;
        let [preTime, afterTime] = [30, 30];
        let target = vita.world.selectableVitas().filter(v => !v.isBoss && typeof v.group == 'number').filter(v => ((v.x - vita.x) ^ face) > 0).filter(v => (v.face ^ face) < 0)[0];
        if (!target) {
            if (vita.varProp.hp / vita.prop.hp >= 0.1) {
                return;
            } else {
                target = vita;
            }
        }
        let flag1 = new Sprite(by('./res/util/role/1/shadow/32.png'));
        flag1.anchor.set(0.5, 0.5);
        flag1.position.set(0, -5);
        let flag2 = new Sprite(by('./res/util/role/1/shadow/31.png'));
        flag2.anchor.set(0.5, 0.5);
        flag2.position.set(0, -5);
        target.viewController.toDestory.push(flag2);
        vita.viewController.view.addChild(flag1);
        for (let i = 1; i <= preTime * 0.5; i++) {
            let k = i;
            vita.once(`timer_${timer + k}`, e => {
                if (!this.executing) return;
                flag1.alpha = k / preTime * 2;
            });
            vita.once(`timer_${timer + preTime * 0.5 + k}`, e => {
                if (!this.executing) return;
                flag1.alpha = 1 - k / preTime * 2;
                flag1.scale.set(1 + k * 0.1, 1 + k * 0.1);
            })
        }
        vita.once(`timer_${timer + preTime + afterTime}`, e => {
            flag1._destroyed || flag1.destroy();
        })
        vita.once(`timer_${timer + preTime}`, e => {
            if (!this.executing) {
                flag2._destroyed || flag2.destroy();
                return;
            }
            if (target.id !== vita.id && (target.dead || (target.face ^ face) >= 0 || ((target.x - vita.x) ^ face) <= 0)) return;
            target.viewController.view.addChild(flag2);
            let nowTimer = target.timer;
            for (let i = 1; i <= afterTime; i++) {
                let j = i;
                target.once(`timer_${nowTimer + j}`, e => {
                    flag2.scale.set(0.2 + 0.8 * j / afterTime, 0.2 + 0.8 * j / afterTime);
                    flag2.alpha = 0.2 + 0.8 * j / afterTime;
                    flag2.angle = 540 * (1 - j / afterTime);
                })
            }
            target.group = Symbol();
            let atkadder = bv => bv * 0.5;
            let hpadder = bv => bv * 0.8;
            target.computeFunctions['atk'].push(atkadder);
            let rhp = target.varProp.hp;
            target.varProp.hp += target.baseProp.hp * 0.8;
            target.on(new ItemEvent('nhpchange', [rhp, target.varProp.hp], vita));
            target.computeFunctions['hp'].push(hpadder);
            target.timeChangeRates.push(0.8);
            target.stateController.insertState(StateCache.URA, new StateItem(0, true));
            target?.ai?.reinit(Math.min(target.ai?.intelli * 2, 8));
            target.on('timing', e => {
                if ((target.timer - nowTimer) % 60 == 1) {
                    let rhp = target.nhp;
                    target.varProp.hp -= target.prop.hp * 0.1;
                    target.on(new ItemEvent('nhpchange', [rhp, target.varProp.hp], vita));
                }
            })
            target.needCompute = true;
        })
    })
    .useCommonActionData({
        hand_l: {
            len: 31,
            changedFrame: 1,
            value: tween([14, 60, 105], 10, [14, 62, 0], 15, [14, 62, 0], 5, [14, 60, 105])
        }
    })
import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { tween } from "../../../../util";
import { ctrlFilter, stoneFilter } from "../../../ffilter/filter";

export default new SkillProto(7, '噩梦攻心', '释放恐惧，使与自己对视的敌人石化，望向自己后背的敌人减速，持续3秒').lost(0).freezing(120).standing(60).active(true)
    .execute(function () {
        let vita = this.vita;
        let face = vita.face;
        let timer = vita.timer;
        vita.stateController.removeState(StateCache.go, StateCache.run);
        let x = vita.x;
        vita.once(`timer_${timer + 10}`, e => {
            if (!this.executing) return true;
            vita.stateController.insertState(StateCache.URA, new StateItem(40).whenDisappear(_ => {
                vita.viewController.removeFilter(ctrlFilter);
            }));
            vita.viewController.addFilter(ctrlFilter);
            vita.once(`timer_${timer + 50}`, e => {
                let enemys = vita.world.selectableVitas().filter(v => v.group != vita.group);
                let leftShoots = enemys.filter(role => (role.x < x) && (role.face == 1));
                let rightShoots = enemys.filter(role => (role.x > x) && (role.face == -1));
                let [dizzyShoots, despeedShoots] = face == 1 ? [rightShoots, leftShoots] : [leftShoots, rightShoots];
                despeedShoots.forEach(role => {
                    if (role.stateController.has(StateCache.URA)) return;
                    // 减速
                    role.stateController.insertState(StateCache.slow, new StateItem(180, false, role.baseProp.speed * 0.5));
                });
                dizzyShoots.forEach(role => {
                    if (role.stateController.has(StateCache.URA)) return;
                    //石化
                    role.stateController.removeState(StateCache.go, StateCache.run, StateCache.jump, StateCache.jumpSec);
                    role.stateController.insertState(StateCache.dizzy, new StateItem(180).whenDisappear(_ => {
                        role.viewController.removeFilter(stoneFilter);
                    }));
                    role.viewController.addFilter(stoneFilter);
                })
            })
        })
    })
    .useCommonActionData({
        hand_r: {
            len: 60,
            changedFrame: 1,
            value: [
                ...tween([16, 37, -10], [16, 37, -100], 10),
                ...Array.from(new Array(40), v => [16, 37, -100]),
                ...tween([16, 37, -100], [16, 37, -10], 10),
            ]
        },
        weapon: {
            len: 60,
            changedFrame: 1,
            value: [
                ...tween([20, 27, 80], [5, 37, -20], 10),
                ...Array.from(new Array(40), v => [5, 37, -20]),
                ...tween([5, 37, -20], [20, 37, 80], 10),
            ]
        }
    });
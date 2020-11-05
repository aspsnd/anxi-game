import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { Flyer } from "../../../../anxi/atom/flyer";
import { World } from "../../../../anxi/atom/world";
import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { defaultArrowUrl } from "../../../../sound/util";
import { by, gameSound, IFC, tween } from "../../../../util";
import { accumFilter } from "../../../ffilter/filter";

export default new SkillProto(6, '眺望远射', '蓄力射出强力一击').lost(0).freezing(120).active(true).standing(80)
    .execute(function () {
        let vita = this.vita;
        let timer = vita.timer;
        let x = vita.x;
        let y = vita.y;
        vita.stateController.removeState(StateCache.go, StateCache.run)
        vita.stateController.insertState(StateCache.URA, new StateItem(60));
        let target = World.instance.selectableVitas().filter(v => v.group != vita.group)[0];
        if (!target) return;
        let face = target.x > x ? 1 : -1;
        vita.face = face;
        let angle = 45;
        vita.skillController[Symbol.for('skill7')] = angle;
        vita.once(`timer_${timer + 15}`, e => {
            if (vita.dead) return;
            let arrow = new Sprite(by('./res/util/monst/3/9.png'));
            let realarrow = new Flyer(arrow, arrow => {
                arrow.anchor.set(0.2, 0.5);
                arrow.scale.set(face, 1);
                arrow.position.set(x - 18 * face, vita.centerY);
                arrow.filters = [accumFilter];
            }).bindTo(vita).useAngleGetter(timer => {
                if (timer >= 55) return angle * face * -1;
                let tan = -((target.y - y) / (target.x - x) * face);
                let a = Math.round(Math.atan(tan) * 180 / Math.PI);
                if (a > angle && angle < 90) {
                    angle++;
                } else if (a < angle && angle > 0) {
                    angle--;
                }
                vita.skillController[Symbol.for('skill7')] = angle;
                return angle * face * -1;
            }).useHitAreaGetter((x, y) => new Circle(x, y, 25)).checkFromArray(Array.from(new Array(40), (v, k) => 55 + k))
                .useAffectGetter((from, to) => {
                    let affect = new Affect(this, from, to);
                    affect.harm.common = vita.prop.atk * 1;
                    affect.harm.absolute = vita.prop.atk * 0.8;
                    affect.debuff.push({
                        state: StateCache.beHitBehind,
                        last: 15
                    });
                    return affect;
                }).useLiveTime(120).useFilter(vitas => vitas.filter(v => v.group != vita.group));
            realarrow.once(`timer_${55}`, e => {
                realarrow.useConstSpeed(16 * face);
                vita.viewController.removeFilter(accumFilter);
            })
            vita.viewController.addFilter(accumFilter);
            World.instance.vitaContainer.addChild(arrow);
        });
    })
    .useCommonActionData({
        weapon: {
            changedFrame(ps, time, vita) {
                let timer = ps.timer;
                return new IFC(timer).less(14, timer).null(15 + vita.skillController[Symbol.for('skill7')]).value;
            },
            len: 106,
            value: [
                ...tween([0, 35, 30], [0, 35, -45], 15),
                ...tween([0, 35, 0], [0, 35, -90], 91),
            ]
        }
    });
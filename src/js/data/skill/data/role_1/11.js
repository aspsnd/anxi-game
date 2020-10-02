import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { Flyer } from "../../../../anxi/atom/flyer";
import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { by, r2a, tween } from "../../../../util";

export default new SkillProto(11, '净化', '免除自身所有控制，向前下射出箭矢，自身收到冲击向后上方移动。【可在被控状态使用】')
    .active(true)
    .lost(20)
    .bePrevent([StateCache.attack])
    .standing(20)
    .execute(function () {
        let [preTime, relTime, flyTime, moveTime] = [5, 20, 25, 15]
        let vita = this.vita;
        let timer = vita.timer;
        let face = vita.face;
        vita.stateController.removeState(StateCache.banhover, StateCache.dizzy, StateCache.beHitBehind, StateCache.hard, StateCache.poison);
        vita.stateController.insertState(StateCache.URA, new StateItem(preTime + moveTime));
        let x = vita.x;
        let y = vita.centerY;
        let vortex = new Sprite(by('./res/util/role/1/shadow/22.png'));
        vortex.position.set(x, y + 20);
        vortex.anchor.set(0.5, 0.5);
        vita.world.vitaContainer.addChild(vortex);
        for (let i = 1; i <= relTime; i++) {
            let k = i;
            vita.once(`timer_${timer + i}`, e => {
                let process = k / relTime;
                vortex.scale.set(0.5 + 0.5 * (1 - process));
                vortex.alpha = (1 - process);
                vortex.angle -= 15;
            })
        };
        vita.once(`timer_${timer + relTime}`, e => {
            vortex._destroyed || vortex.destroy();
        });
        vita.stateController.maxStateTime(StateCache.hover, moveTime);
        vita.once(`timer_${timer + preTime + 1}`, e => {
            vita.stickingWall = undefined;
        })
        for (let i = 1; i < moveTime; i++) {
            vita.once(`timer_${timer + preTime + i}`, e => {
                vita.x -= face * 6;
                vita.y -= 8;
            })
        }
        let arrow = new Sprite(by('./res/util/role/1/shadow/21.png'));
        arrow.position.set(x, y + 20);
        arrow.anchor.set(0.8, 0.5);
        arrow.scale.set(1, face);
        let angle = r2a(Math.atan(0.75));
        new Flyer(arrow).from(vita).useConstAngle(90 - face * angle).useLiveTime(flyTime).useConstSpeed(12)
            .useFilter(vitas => vitas.filter(v => v.group != vita.group))
            .useHitAreaGetter((x, y) => new Circle(x, y, 25))
            .checkFromBool(true)
            .useAffectGetter((from, to) => {
                let affect = new Affect(this, from, to);
                affect.harm.common = 100 + vita.prop.atk * 1.5;
                affect.debuff.push({
                    state: StateCache.beHitBehind,
                    last: 25
                });
                return affect;
            });
    })
    .useCommonActionData({
        hand_r: {
            len: 20,
            changedFrame: 1,
            value: tween([14, 37, 60], 5, [14, 37, 90 - r2a(Math.atan(0.75))], 10, [14, 37, 90 - r2a(Math.atan(0.75))], 5, [14, 37, 60])
        },
        weapon: {
            len: 20,
            changedFrame: 1,
            value: tween([14, 33, 60], 5, [14, 33, 90 - r2a(Math.atan(0.75))], 10, [14, 33, 90 - r2a(Math.atan(0.75))], 5, [14, 33, 60])
        },
        wing: {
            len: 20,
            changedFrame: 1,
            value: tween([0, 39, 0], 5, [0, 39, -18], 10, [0, 39, -18], 5, [0, 39, 0])
        },
        head: {
            len: 20,
            changedFrame: 1,
            value: tween([16, 20, 0], 5, [16, 20, 10], 10, [16, 20, 10], 5, [16, 20, 0])
        },
        leg_l: {
            len: 20,
            changedFrame: 1,
            value: tween([12, 68, 30], 5, [12, 68, 5], 10, [12, 68, 5], 5, [12, 68, 30])
        },
        leg_r: {
            len: 20,
            changedFrame: 1,
            value: tween([17, 68, -30], 5, [12, 68, -45], 10, [17, 68, -45], 5, [17, 68, -30])
        }
    })
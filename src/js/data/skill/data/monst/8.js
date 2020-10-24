import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { StateCache } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { a2r, by } from "../../../../util";

export default new SkillProto(8, '大杀四方', '蓄力产生多个瞄准敌人的光枪，对敌人造成伤害').lost(0).freezing(120).standing(60).active(true)
    .execute(function () {
        let vita = this.vita;
        let face = vita.face;
        let timer = vita.timer;
        vita.stateController.removeState(StateCache.go, StateCache.run);
        let x = vita.x;
        let y = vita.y;
        let arrowCount = 5;
        let preTime = 10;
        let findTime = 30;
        let flyTime = 40;
        let arrows = Array.from(new Array(arrowCount), () => new Sprite(by('./res/util/monst/5/10.png')));
        vita.world.vitaContainer.addChild(...arrows);
        vita.viewController.toDestory.push(...arrows);
        arrows.forEach((arrow, index) => {
            arrow.alpha = 0;
            arrow.anchor.set(1, 0.5);
            arrow.position.set(x - face * (100 - 8 * index), y + 35 - index * 20);
            arrow.angle = 90 + (-90 + 12 * index) * face;
        })
        for (let i = 1; i <= preTime; i++) {
            vita.once(`timer_${timer + i}`, _ => {
                arrows.forEach(arrow => arrow.alpha = i / preTime);
            });
        }
        vita.once(`timer_${timer + preTime}`, _ => {
            if (!this.executing) return;
            let sawEnemys = vita.world.selectableVitas().filter(v => v.group != vita.group);
            let len = sawEnemys.length;
            let targets = Array.from(new Array(arrowCount), (v, k) => len > 0 ? sawEnemys[k % len] : vita);
            for (let i = 1; i <= findTime; i++) {
                vita.once(`timer_${timer + preTime + i}`, _ => {
                    for (let j = 0; j < arrowCount; j++) {
                        let arrow = arrows[j];
                        let target = targets[j];
                        if (target.dead) continue;
                        let angle = arrow.angle;
                        let cy = target.centerY - arrow.y;
                        let cx = target.x - arrow.x;
                        let tan = cy / cx;
                        let a = Math.round(Math.atan(tan) * 180 / Math.PI);
                        if (cx < 0) a += 180;
                        if (a < 0) a += 360;
                        if (a > angle) {
                            angle += Math.max(1, (a - angle) * 0.2);
                        } else if (a < angle) {
                            angle -= Math.max(1, (angle - a) * 0.2);
                        }
                        arrow.angle = angle;
                    }
                })
            };
            let speed = 10;
            let uvSpeeds;
            vita.once(`timer_${timer + preTime + findTime}`, _ => {
                uvSpeeds = Array.from(new Array(arrowCount), (v, k) => {
                    let r = a2r(arrows[k].angle);
                    return [Math.cos(r), Math.sin(r)];
                });
            });
            let shootedVitas = Array.from(new Array(arrowCount), _ => []);
            for (let i = 1; i <= flyTime; i++) {
                vita.once(`timer_${timer + preTime + findTime + i}`, _ => {
                    speed += 0.5;
                    arrows.forEach((arrow, index) => {
                        let uvs = uvSpeeds[index];
                        arrow.x += uvs[0] * speed;
                        arrow.y += uvs[1] * speed;
                        let hitarea = new Circle(arrow.x, arrow.y, 20);
                        let shoots = vita.world.selectableVitas().filter(v => v.group != vita.group)
                            .filter(role => !shootedVitas[index].includes(role.id)).filter(role => hitarea.hit(role.getHitGraph()));
                        shoots.forEach(role => {
                            shootedVitas[index].push(role.id);
                            let affect = new Affect(this, vita, role);
                            affect.harm.common = vita.prop.atk * 0.65 + 10;
                            affect.debuff.push({
                                state: StateCache.beHitBehind,
                                last: 25
                            });
                            affect.setout();
                        })
                    });
                })
            }
        })
        vita.once(`timer_${timer + preTime + findTime + flyTime + 1}`, e => {
            arrows.forEach(a => a._destroyed || a.destroy());
        })
    });
import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { World } from "../../../../anxi/atom/world";
import { StateCache } from "../../../../anxi/controller/state";
import { ItemEvent } from "../../../../anxi/event";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Circle } from "../../../../anxi/shape/shape";
import { tween } from "../../../../util";

export default new SkillProto(5, '射箭', '普通的向前射箭')
    .lost(0)
    .freezing(60)
    .active(true)
    .execute(function () {
        let monst = this.vita;
        let timer = monst.timer;
        let face = monst.face;
        let head = monst.viewController.blocks.head;
        let view = monst.viewController.view;
        monst.stateController.removeState(StateCache.go, StateCache.run);
        monst.on(`timer_${timer + 15}`, e => {
            if (!this.executing) return true;
            head.alpha = 0;
            let arrow = new Sprite(head.texture);
            arrow.anchor.set(1, 0);
            arrow.scale.x = face;
            arrow.position.set(head.x * face + view.x, head.y + view.y);
            arrow.angle = 15 * face;
            World.instance.vitaContainer.addChild(arrow);
            let shootedVitas = [];
            let sx = 9 * face;
            let sy = [4, 4, 3, 3, 2, 2, 1, 1, 0, 0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5];
            for (let i = 0; i < 30; i++) {
                monst.on(`timer_${timer + i + 16}`, e => {
                    arrow.x += sx;
                    arrow.y -= sy[i];
                    arrow.angle = (15 + i) * face;
                    let circle = new Circle(arrow.x, arrow.y, 5);
                    let shoots = World.instance.selectableVitas().filter(vita => vita.group != monst.group)
                        .filter(vita => !shootedVitas.includes(vita.id))
                        .filter(vita => circle.hit(vita.getHitGraph()));
                    shoots.forEach(vita => {
                        shootedVitas.push(vita.id);
                        let affect = new Affect(this, monst, vita);
                        affect.harm.common = monst.prop.atk * 1.5;
                        affect.debuff.push({
                            state: StateCache.beHitBehind,
                            last: 10
                        });
                        affect.setout();
                    });
                    return true;
                })
            }
            monst.on(`timer_${timer + 80}`, e => {
                arrow.destroy();
                return true;
            })
            return true;
        })
        monst.on(`timer_${timer + 60}`, e => {
            monst.viewController.blocks.head.alpha = 1;
            return true;
        })
    })
    .standing(30)
    .useCommonActionData({
        head: {
            len: 15,
            changedFrame: 1,
            value: tween([55, 18, -5], [55, 18, 15], 15)
        }
    });
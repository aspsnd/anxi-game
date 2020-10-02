import { Affect } from "../../../../anxi/affect";
import { StateCache } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Point, Polygon } from "../../../../anxi/shape/shape";
import { tween } from "../../../../util";

export default new SkillProto(15, '大号萝卜', '将大萝卜向前猛砸').active(true)
    .standing(55)
    .execute(function () {
        let vita = this.vita;
        let face = vita.face;
        let timer = vita.timer;
        let shootedVitas = [];
        vita.stateController.removeState(StateCache.go, StateCache.run);
        for (let i = 26; i <= 40; i++) {
            vita.once(`timer_${timer + i}`, e => {
                if (!this.executing) return;
                let x = vita.x;
                let y = vita.centerY;
                let shape = new Polygon(
                    new Point(x, y + 60),
                    new Point(x, y - 150),
                    new Point(x + 175 * face, y - 90),
                    new Point(x + 200 * face, y + 30),
                )
                let shoots = vita.world.selectableVitas().filter(v => v.group != vita.group)
                    .filter(v => !shootedVitas.includes(v.id))
                    .filter(v => shape.hit(v.getHitGraph()));
                shoots.forEach(enemy => {
                    shootedVitas.push(enemy.id);
                    let affect = new Affect(this, vita, enemy);
                    affect.harm.common = vita.prop.atk * 1.5;
                    affect.debuff.push({
                        state: StateCache.beHitBehind,
                        last: 15
                    });
                    affect.setout();
                });
            })
        }
    })
    .useCommonActionData({
        weapon: {
            len: 60,
            changedFrame: 1,
            value: tween([28, 62, -12, 1, 1], 20, [28, 62, -90, 2, 2], 5, [28, 62, -90, 2.5, 2.5], 15, [28, 62, 12, 3, 3], 3, [28, 62, 12, 3, 3], 5, [28, 62, 12, 2, 2], 12, [28, 62, -12, 1, 1])
        }
    });
import { Sprite } from "pixi.js";
import { Affect } from "../../../../anxi/affect";
import { ShadowController } from "../../../../anxi/controller/skill/shadow";
import { StateCache, StateItem } from "../../../../anxi/controller/state";
import { SkillProto } from "../../../../anxi/proto/skill";
import { Point, Polygon } from "../../../../anxi/shape/shape";
import { by } from "../../../../util";
/**
 * 技能4 向前位移【途中无敌】 原地留下一只残影
 */
export default new SkillProto(3, '悲影落', '向前位移【途中无敌】 原地留下一只残影')
    .active(true)
    .lost(40)
    .standing(15)
    .execute(function () {
        let role = this.vita;
        let nowTime = role.timer;
        let face = role.face;
        let speed = face * role.prop.speed * 8;
        let distance = face * role.prop.speed * 8 * 15;
        role.stateController.removeState(StateCache.run, StateCache.go);
        role.getController('shadowController', ShadowController).create(role.x - 10 * face, role.centerY);
        role.stateController.insertState(StateCache.IME, new StateItem(15));
        role.stateController.insertState(StateCache.URA, new StateItem(15));
        role.viewController.view.alpha = 0;
        let headshadow = new Sprite(by('./res/util/role/0/shadow/headshoot.png'));
        role.world.vitaContainer.addChild(headshadow);
        headshadow.anchor.set(0.5, 0.5);
        let x = role.x;
        let y = role.centerY;
        headshadow.position.set(x, y);
        headshadow.scale.set(face, 1);
        role.on(`timer_${nowTime + 16}`, e => {
            role.viewController.view.alpha = 1;
            headshadow.destroy();
            return true;
        });
        for (let i = 1; i <= 15; i++) {
            role.on(`timer_${nowTime + i}`, e => {
                let endx = x + speed * i;
                headshadow.position.set(endx, role.centerY);
                role.x = endx;
                return true;
            })
        };
        role.on(`timer_${nowTime + 8}`, e => {
            let hitarea = new Polygon(
                new Point(x - 35 * face, y + 50),
                new Point(x - 35 * face, y),
                new Point(x - 35 * face, y - 50),
                new Point(x + distance + 50, y - 50),
                new Point(x + distance + 50, y),
                new Point(x + distance + 50, y + 50));
            let shoots = role.world.selectableVitas().filter(vita => Boolean(vita)).filter(vita => vita.group != role.group)
                .filter(vita => hitarea.hit(vita.getHitGraph()));
            shoots.forEach(vita => {
                let affect = new Affect(this, role, vita);
                affect.harm.absolute = 100 + role.level * 8;
                affect.harm.common = role.prop.atk * 0.3;
                affect.setout();
            });
            return true;
        })
    });
import { Graphics, Sprite } from "pixi.js";
import { Flyer } from "../../../anxi/atom/flyer";
import { SkillProto } from "../../../anxi/proto/skill";
import { RealWorld } from "../../../po/world";
import { directBy, gameApp, GameWidth } from "../../../util";

export default new SkillProto(8, '绯红之王', '开启无双时，会使自身时间迅速跳跃4——9秒。')
    .active(false)
    .initListen('getura', (vita, skill) => e => skill.execute())
    .execute(function () {
        let { vita } = this;
        let time = 60 * (Math.min(3 + vita.level / 3, 9) | 0);
        vita.world.running = false;
        let i = 0;
        let pointer = new Sprite(directBy('talent/8/1.png'));
        pointer.anchor.set(0.5, 2 / 3);
        new Flyer(new Sprite(directBy('talent/8/0.png')), s => {
            s.anchor.set(0.5, 0.5);
            s.position.set(GameWidth >> 1, 150);
            s.addChild(pointer);
            vita.world.vitaContainer.addChild(s);
        }).bindTo(vita).useLiveTime(time).onTime(timer => {
            pointer.angle += 360 / time;
        });
        RealWorld.instance.on('timing', e => {
            for (let j = 0; j < 10; j++) {
                if (++i > time) {
                    vita.world.running = true;
                    return true;
                };
                vita.onTimer();
            }
        });
    })

import { Sprite } from "pixi.js";
import { World } from "../../../anxi/atom/world";
import { AttackProto, behindDebuff } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { by, tween } from "../../../util";

var arrowUrl = './res/util/monst/3/10.png';
export default new AttackProto({
    index: 5,
    time: 30,
    freeze: 45,
    checkTimes: Array.from(new Array(20), (v, k) => k + 16),
    debuff: behindDebuff(15),
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x - 35, y + 8),
            new Point(x - 35, y - 8),
            new Point(x + 35, y - 8),
            new Point(x + 35, y + 8)
        );
    },
    acitonData: {
        weapon: {
            len: 35,
            changedFrame: 1,
            value: [
                ...tween([0, 35, 30], [0, 35, 0], 15),
                ...tween([0, 35, 0], [0, 35, 0], 10),
                ...tween([0, 35, 0], [0, 35, 30], 5)
            ]
        }
    },
    executeProto() {
        let vita = this.belonger;
        let face = vita.face;
        let timer = vita.timer;
        vita.once(`timer_${timer + 15}`, e => {
            if (this.finish) return true;
            this.absoluteCheck = true;
            let s = new Sprite(by(arrowUrl));
            this.check(s);
            s.anchor.set(0.5, 0.5);
            s.scale.set(face, 1);
            s.position.set(vita.x + 20 * face, vita.centerY );
            World.instance.vitaContainer.addChild(s);
            for (let i = 0; i < 20; i++) {
                vita.once(`timer_${timer + 16 + i}`, e => {
                    s.x += face * 20;
                });
            }
            vita.once(`timer_${timer + 35}`, e => {
                s.destroy();
            })
        })
    }
})
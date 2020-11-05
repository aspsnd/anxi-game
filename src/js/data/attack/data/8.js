import { Sprite } from "pixi.js";
import { AttackProto, behindDebuff } from "../../../anxi/proto/attack";
import { Line, Point } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index: 8,
    time: 30,
    freeze: 35,
    notrans: true,
    checkTimes: Array.from(new Array(20), (v, k) => k + 16),
    debuff: behindDebuff(15),
    getHitGraph(pos, face) {
        let [x, y] = pos;
        return new Line(new Point(x, y), new Point(x - 60 * face, y));
    },
    executeProto() {
        let vita = this.belonger;
        let face = vita.face;
        let timer = vita.timer;
        vita.once(`timer_${timer + 15}`, e => {
            if (this.interrupted) return;
            this.absoluteCheck = true;
            let s = new Sprite(vita.attackController.bulletTexture);
            this.check(s);
            s.anchor.set(1, 0.5);
            s.scale.set(face, 1);
            s.position.set(vita.x + 20 * face, vita.centerY);
            vita.world.vitaContainer.addChild(s);
            let end = false;
            for (let i = 0; i < 20; i++) {
                vita.once(`timer_${timer + 16 + i}`, e => {
                    if (end) return;
                    if (this.finished) {
                        end = true;
                        vita.once(`timer_${vita.timer + 5}`, e => {
                            s._destroyed || s.destroy();
                        })
                        return;
                    }
                    s.x += face * 20;
                });
            }
            vita.once(`timer_${timer + 35}`, e => {
                s._destroyed || s.destroy();
            })
        })
    },
    acitonData: {
        weapon: {
            len: 30,
            changedFrame: 1,
            value: [
                ...tween([14, 33, 60], [14, 33, 0], 15),
                ...tween([14, 33, 0], [14, 33, 0], 10),
                ...tween([14, 33, 0], [14, 33, 60], 5)
            ]
        },
        hand_r: {
            len: 30,
            changedFrame: 1,
            value: [
                ...tween([14, 37, 60], [14, 37, 0], 15),
                ...tween([14, 37, 0], [14, 37, 0], 10),
                ...tween([14, 37, 0], [14, 37, 60], 5)
            ]
        },
    }
})
import { AttackProto, behindDebuff } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index: 9,
    time: 30,
    freeze: 45,
    checkTimes: Array.from(new Array(5), (v, k) => k * 3 + 13),
    debuff: behindDebuff(15),
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x + 20 * face, y + 150),
            new Point(x + 20 * face, y + 30),
            new Point(x + 90 * face, y + 30),
            new Point(x + 90 * face, y + 150)
        );
    },
    acitonData: {
        weapon: {
            len: 30,
            changedFrame: 1,
            value: tween([28, 62, -12], 12, [28, 62, -90], 15, [28, 62, 12], 3, [28, 62, -12])
        },
    }
})
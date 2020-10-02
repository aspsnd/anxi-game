import { AttackProto, behindDebuff } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index: 6,
    time: 30,
    freeze: 45,
    checkTimes: [10, 15, 20, 25],
    debuff: behindDebuff(15),
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x, vita.centerY + 40),
            new Point(x, vita.centerY - 30),
            new Point(x + 75 * face, vita.centerY - 30),
            new Point(x + 75 * face, vita.centerY + 40)
        );
    },
    acitonData: {
        weapon: {
            len: 30,
            changedFrame: 1,
            value: [
                ...tween([20, 27, 80], [15, 27, 30], 10),
                ...tween([15, 27, 30], [20, 27, 80], 20)
            ]
        },
        hand_r: {
            changedFrame: 1,
            len: 30,
            value: [
                ...tween([16, 37, -10], [16, 37, -60], 10),
                ...tween([16, 37, -60], [16, 37, -10], 20)
            ]
        }
    }
})
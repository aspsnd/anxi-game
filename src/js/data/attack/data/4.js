import { AttackProto, behindDebuff, defaultDebuff } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index: 4,
    time: 30,
    freeze: 45,
    checkTimes: [10, 15, 20],
    debuff: behindDebuff(15),
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x + 0 * face, vita.centerY - 40),
            new Point(x + 0 * face, vita.centerY + 10),
            new Point(x + 65 * face, vita.centerY + 10),
            new Point(x + 65 * face, vita.centerY - 40)
        );
    },
    acitonData: {
        body: {
            len: 30,
            changedFrame: 1,
            value: [
                ...tween([20, 48, 0], [20, 48, 90], 25),
                ...tween([20, 48, 90], [20, 48, 0], 5)
            ]
        }
    }
})
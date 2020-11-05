import { StateCache } from "../../../anxi/controller/state";
import { AttackProto } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index: 0,
    time: 20,
    freeze: 25,
    checkTimes: [10],
    debuff: [
        {
            state: StateCache.beHitBehind,
            last: 10
        }
    ],
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x + 20 * face, vita.centerY - 25),
            new Point(x + 20 * face, vita.centerY + 20),
            new Point(x + 75 * face, vita.centerY + 20),
            new Point(x + 75 * face, vita.centerY - 25)
        );
    },
    acitonData: {
        weapon: {
            len: 20,
            changedFrame: 1,
            value: [
                ...tween([34, 40, 185], [36, 51, 280], 12),
                ...tween([36, 51, 280], [34, 40, 185], 8)
            ]
        },
        hand_r: {
            len: 20,
            changedFrame: 1,
            value: [
                ...tween([14, 37, 15], [14, 37, 45], 12),
                ...tween([14, 37, 45], [14, 37, 15], 8)
            ]
        }
    }
});
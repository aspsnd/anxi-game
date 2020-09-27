import { StateCache } from "../../../anxi/controller/state";
import { AttackProto } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index: 0,
    time: 15,
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
            new Point(x + 20 * face, vita.centerY + 5),
            new Point(x + 20 * face, vita.centerY + 50),
            new Point(x + 75 * face, vita.centerY + 50),
            new Point(x + 75 * face, vita.centerY + 5)
        );
    },
    acitonData: {
        weapon: {
            len: 15,
            changedFrame: 1,
            value: [
                ...tween([34, 45, 185], [36, 56, 280], 12),
                ...tween([36, 56, 280], [34, 45, 185], 3)
            ]
        },
        hand_r: {
            len: 15,
            changedFrame: 1,
            value: [
                ...tween([14, 42, 15], [14, 42, 45], 12),
                ...tween([14, 42, 45], [14, 42, 15], 3)
            ]
        }
    }
});
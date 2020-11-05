import { StateCache } from "../../../anxi/controller/state";
import { AttackProto } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new AttackProto({
    index:1,
    time: 15,
    freeze: 20,
    checkTimes: [10],
    debuff: [
        {
            state: StateCache.beHitBehind,
            last: 10
        }
    ],
    getHitGraph(pos, face, vita) {
        let [x] = pos;
        return new Polygon(
            new Point(x + 60 * face, vita.centerY + 50),
            new Point(x + 60 * face, vita.centerY),
            new Point(x - 2 * face, vita.centerY),
            new Point(x - 2 * face, vita.centerY + 50)
        );
    },
    acitonData: {
        weapon: {
            len: 15,
            changedFrame: 1,
            value: [
                ...tween([18, 5, 185], [18, 5, 280], 12),
                ...tween([18, 5, 280], [18, 5, 185], 3)
            ]
        }
    }
})
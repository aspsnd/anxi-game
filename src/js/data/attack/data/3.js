import { StateCache } from "../../../anxi/controller/state";
import { AttackProto } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";

export default new AttackProto({
    index: 3,
    time: 30,
    freeze: 25,
    checkTimes: [10, 15, 20],
    debuff: [
        {
            state: StateCache.beHitBehind,
            last: 10
        }
    ],
    getHitGraph(pos, face, vita) {
        let [x] = pos;
        return new Polygon(
            new Point(x + 65 * face, vita.centerY + 5),
            new Point(x + 65 * face, vita.centerY - 20),
            new Point(x, vita.centerY - 20),
            new Point(x, vita.centerY + 5)
        );
    },
    acitonData: {
        body: {
            len: 8,
            changedFrame: 4,
            value: [
                [20, 17],
                [21, 17, 3],
                [23, 17, 6],
                [25, 17, 9],
                [26, 17, 12],
                [24, 17, 8],
                [22, 17, 4],
                [20, 17],
            ]
        },
        weapon: {
            len: 16,
            changedFrame: 2,
            value: [
                [11, 22, 0],
                [13, 22, 3],
                [15, 22, 6],
                [16, 22, 9],
                [17, 22, 12],
                [18, 22, 15],
                [19, 22, 18],
                [20, 22, 21],
                [21, 22, 24],
                [23, 22, 27],
                [23, 22, 25],
                [21, 22, 22],
                [18, 22, 18],
                [17, 22, 12],
                [14, 22, 6],
                [11, 22, 0],
            ]
        }
    }
})
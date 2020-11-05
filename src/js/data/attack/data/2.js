import { AttackProto, defaultDebuff } from "../../../anxi/proto/attack";
import { Point, Polygon } from "../../../anxi/shape/shape";

export default new AttackProto({
    index: 2,
    time: 15,
    freeze: 20,
    checkTimes: [10],
    debuff: defaultDebuff,
    getHitGraph(pos, face, vita) {
        let [x, y] = pos;
        return new Polygon(
            new Point(x - 10 * face, vita.centerY - 5),
            new Point(x - 10 * face, vita.centerY + 25),
            new Point(x + 65 * face, vita.centerY + 25),
            new Point(x + 65 * face, vita.centerY - 5)
        );
    },
    acitonData: {
        weapon: {
            len: 8,
            changedFrame: 2,
            value: [
                [34, 40, 185],
                [30, 55, 280],
                [10, 60, 280],
                [14, 60, 280],
                [18, 60, 273],
                [24, 60, 273],
                [30, 57, 273],
                [34, 40, 185],
            ]
        },
        hand_r: {
            len: 8,
            changedFrame: 2,
            value: [
                [14, 37, 15],
                [14, 37, 55],
                [14, 37, 95],
                [14, 37, 85],
                [14, 37, 75],
                [14, 37, 65],
                [14, 37, 55],
                [14, 37, 15],
            ]
        }
    }
})
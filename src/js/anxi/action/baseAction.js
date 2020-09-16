import { StateCache } from "../controller/state";
import { ActionData } from "./action";

export const BaseActionData = new ActionData({
    [StateCache.common]: {
        body: {
            changedFrame: 16,
            len: 2,
            value: [
                [0, 56],
                [0, 56]
            ]
        },
        head: {
            changedFrame: 16,
            len: 2,
            value: [
                [-2, 16],
                [-2, 17]
            ]
        },
        hand_l: {
            changedFrame: 16,
            len: 2,
            value: [
                [19, 58, 105],
                [19, 58, 104]
            ]
        },
        hand_r: {
            changedFrame: 16,
            len: 2,
            value: [
                [16, 55, 45],
                [16, 55, 46]
            ]
        },
        leg_l: {
            changedFrame: 16,
            len: 1,
            value: [
                [11, 93, 30]
            ]
        },
        leg_r: {
            changedFrame: 16,
            len: 1,
            value: [
                [17, 93, -30]
            ]
        },
        weapon: {
            changedFrame: 16,
            len: 2,
            value: [
                [34, 90, 210],
                [34, 90, 212]
            ]
        },
        wing: {
            changedFrame: 16,
            len: 2,
            value: [
                [0, 65],
                [0, 64]
            ]
        }
    },
    [StateCache.go]: {
        leg_l: {
            changedFrame: 4,
            len: 6,
            value: [
                [12, 93, 20],
                [13, 93, 10],
                [14, 93, 0],
                [15, 93, -10],
                [16, 93, -20],
                [17, 93, -30]
            ]
        },
        leg_r: {
            changedFrame: 4,
            len: 6,
            value: [
                [16, 93, -20],
                [15, 93, -10],
                [14, 93, 0],
                [13, 93, 10],
                [12, 93, 20],
                [11, 93, 30]
            ]
        }
    },
    [StateCache.run]: {
        leg_l: {
            changedFrame: 3,
            len: 6,
            value: [
                [12, 93, 20],
                [13, 93, 10],
                [14, 93, 0],
                [15, 93, -10],
                [16, 93, -20],
                [17, 93, -30]
            ]
        },
        leg_r: {
            changedFrame: 3,
            len: 6,
            value: [
                [16, 93, -20],
                [15, 93, -10],
                [14, 93, 0],
                [13, 93, 10],
                [12, 93, 20],
                [11, 93, 30]
            ]
        }
    },
    [StateCache.rest]: {
        wing: {
            /**
                 * @param {PerState} ps 
                 */
            changedFrame(ps) {
                let timer = ps.timer;
                if (timer < 10) {
                    return timer;
                } else if (timer < 100) {
                    return 10;
                } else {
                    return 110 - timer;
                }
            },
            len: 11,
            value: tween([0, 64, 0], [-8, 64, -8], 11)
        }
    }
})
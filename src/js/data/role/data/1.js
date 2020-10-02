import { StateCache } from "../../../anxi/controller/state";
import { RoleProto } from "../../../anxi/proto/role";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new RoleProto({
    baseProp: {
        hp: 80,
        mp: 120,
        atk: 12,
        def: 0,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 2,
    },
    name: '星界游侠',
    level: 1,
    attacks: [8],
    height: 80,
    bulletUrl: './res/util/role/1/9.png',
}).useIndex(1).useRest().useFexpGetter(level => Math.round(50 * (1.25 ** level)))
    .useFultureSkills([
        {
            index: 10,
            cost: {
                money: 100
            }
        },
        {
            index: 11,
            cost: {
                money: 200
            }
        },
        {
            index: 12,
            cost: {
                money: 500
            }
        },
        // {
        //     index: 13,
        //     cost: {
        //         money: 1000
        //     }
        // },
        // {
        //     index: 14,
        //     cost: {
        //         money: 2000
        //     }
        // }
    ])
    .useFultureTalents([])
    .useNextLevel((role, nextLevel) => ({
        hp: 40,
        mp: 60,
        atk: 6,
        def: 1.2
    }))
    .useView(1)
    .useHitGraph((pos, face, vita) => {
        return new Polygon(
            new Point(vita.x - 20, vita.centerY + 40),
            new Point(vita.x - 20, vita.centerY - 40),
            new Point(vita.x + 20, vita.centerY - 40),
            new Point(vita.x + 20, vita.centerY + 40),
        )
    })
    .useAnchors({
        body: [0.5, 0.5],
        head: [0.45, 0.74],
        weapon: [-1, 1 / 2],
        leg_l: [0.5, 0],
        leg_r: [0.5, 0],
        hand_l: [1 / 6, 0.5],
        hand_r: [1 / 6, 0.5],
        wing: [0, 0]
    })
    .useActionData({
        [StateCache.common]: {
            body: {
                changedFrame: 16,
                len: 2,
                value: [
                    [13, 51],
                    [13, 51]
                ]
            },
            head: {
                changedFrame: 16,
                len: 2,
                value: [
                    [16, 20],
                    [16, 21]
                ]
            },
            hand_l: {
                changedFrame: 16,
                len: 1,
                value: [
                    [14, 35, 105],
                    [14, 35, 104]
                ]
            },
            hand_r: {
                changedFrame: 16,
                len: 2,
                value: [
                    [14, 37, 60],
                    [14, 37, 61]
                ]
            },
            leg_l: {
                changedFrame: 16,
                len: 1,
                value: [
                    [12, 68, 30]
                ]
            },
            leg_r: {
                changedFrame: 16,
                len: 1,
                value: [
                    [17, 68, -30]
                ]
            },
            weapon: {
                changedFrame: 16,
                len: 2,
                value: [
                    [14, 33, 60],
                    [14, 33, 61]
                ]
            },
            wing: {
                changedFrame: 16,
                len: 2,
                value: [
                    [0, 39],
                    [0, 40]
                ]
            }
        },
        [StateCache.go]: {
            leg_l: {
                changedFrame: 1,
                len: 24,
                value: tween([13, 68, 20], [18, 68, -30], 24)
            },
            leg_r: {
                changedFrame: 1,
                len: 24,
                value: tween([19, 68, -20], [12, 68, 30], 24)
            }
        },
        [StateCache.run]: {
            leg_l: {
                changedFrame: 1,
                len: 15,
                value: tween([13, 68, 20], [18, 68, -30], 15)
            },
            leg_r: {
                changedFrame: 1,
                len: 15,
                value: tween([19, 68, -20], [12, 68, 30], 15)
            }
        },
        [StateCache.rest]: {
            leg_l: {
                changedFrame(ps) {
                    let timer = ps.timer;
                    if (timer < 10) {
                        return timer < 5 ? 0 : 1;
                    } else if (timer < 100) {
                        return 2;
                    } else {
                        return timer > 105 ? 0 : 1;
                    }
                },
                len: 3,
                value: [
                    [9, 68, 20],
                    [6, 68, 10],
                    [3, 68, 0]
                ]
            },
            body: {
                changedFrame(ps) {
                    let timer = ps.timer;
                    if (timer < 10) {
                        return timer < 5 ? 0 : 1;
                    } else if (timer < 100) {
                        return 2;
                    } else {
                        return timer > 105 ? 0 : 1;
                    }
                },
                len: 3,
                value: [
                    [10, 76],
                    [7, 76],
                    [4, 76]
                ]
            },
            leg_r: {
                changedFrame(ps) {
                    let timer = ps.timer;
                    if (timer < 10) {
                        return timer < 5 ? 0 : 1;
                    } else if (timer < 100) {
                        return 2;
                    } else {
                        return timer > 105 ? 0 : 1;
                    }
                },
                len: 3,
                value: [
                    [14, 68, -40],
                    [11, 68, -50],
                    [9, 68, -60]
                ]
            },
            hand_l: {
                changedFrame(ps) {
                    let timer = ps.timer;
                    if (timer < 10) {
                        return timer < 5 ? 0 : 1;
                    } else if (timer < 100) {
                        return 2;
                    } else {
                        return timer > 105 ? 0 : 1;
                    }
                },
                len: 3,
                value: [
                    [11, 35, 105],
                    [8, 35, 105],
                    [5, 35, 105]
                ]
            },
            hand_r: {
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
                value: tween([14, 37, 60], [4, 37, -10], 11)
            },
            weapon: {
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
                value: tween([14, 33, 60], [34, 13, -15], 11)
            },
            head: {
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
                value: tween([13, 20, 0], [8, 21, -45], 11)
            }
        },
        [StateCache.beHitBehind]: {
            hand_r: {
                changedFrame: 3,
                len: 1,
                value: [
                    [14, 37, 80]
                ]
            },
            weapon: {
                len: 1,
                value: [
                    [14, 33, 80]
                ]
            },
            head: {
                len: 1,
                value: [
                    [16, 20, -10]
                ]
            },
            leg_r: {
                len: 1,
                value: [
                    [17, 68, -15]
                ]
            },
            wing: {
                len: 1,
                value: [
                    [0, 40, -8]
                ]
            }
        }
    })
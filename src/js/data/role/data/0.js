import { ActionData } from "../../../anxi/action/action";
import { StateCache } from "../../../anxi/controller/state";
import { RoleProto } from "../../../anxi/proto/role";
import { Point, Polygon } from "../../../anxi/shape/shape";
import { tween } from "../../../util";
export default new RoleProto({
    baseProp: {
        hp: 100,
        mp: 100,
        atk: 10,
        def: 0,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 2
    },
    name: '孤影剑客',
    level: 1,
    attacks: [0],
    height: 80
}).useIndex(0).useRest().useFexpGetter(level => Math.round(50 * (1.25 ** level)))
    .useFultureSkills([
        {
            index: 0,
            cost: {
                money: 100
            }
        },
        {
            index: 1,
            cost: {
                money: 200
            }
        },
        {
            index: 2,
            cost: {
                money: 500
            }
        },
        {
            index: 3,
            cost: {
                money: 1000
            }
        },
        {
            index: 4,
            cost: {
                money: 2000
            }
        }
    ])
    .useFultureTalents([])
    .useNextLevel((role, nextLevel) => ({
        hp: 50,
        mp: 50,
        atk: 5,
        def: 1.5
    }))
    .useView(0)
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
        weapon: [2 / 3, 1 / 6],
        leg_l: [0.5, 0],
        leg_r: [0.5, 0],
        hand_l: [1 / 6, 0.5],
        hand_r: [1 / 6, 0.5],
        wing: [0, 0]
    })
    .useActionData(new ActionData({
        [StateCache.common]: {
            body: {
                changedFrame: 16,
                len: 2,
                value: [
                    [13, 56],
                    [13, 56]
                ]
            },
            head: {
                changedFrame: 16,
                len: 2,
                value: [
                    [16, 25],
                    [16, 26]
                ]
            },
            hand_l: {
                changedFrame: 16,
                len: 1,
                value: [
                    [14, 40, 105],
                    [14, 40, 104]
                ]
            },
            hand_r: {
                changedFrame: 16,
                len: 2,
                value: [
                    [14, 42, 15],
                    [14, 42, 16]
                ]
            },
            leg_l: {
                changedFrame: 16,
                len: 1,
                value: [
                    [12, 73, 30]
                ]
            },
            leg_r: {
                changedFrame: 16,
                len: 1,
                value: [
                    [17, 73, -30]
                ]
            },
            weapon: {
                changedFrame: 16,
                len: 2,
                value: [
                    [34, 45, 185],
                    [34, 45, 186]
                ]
            },
            wing: {
                changedFrame: 16,
                len: 2,
                value: [
                    [0, 44],
                    [0, 45]
                ]
            }
        },
        [StateCache.go]: {
            leg_l: {
                changedFrame: 1,
                len: 24,
                value: tween([13, 73, 20], [18, 73, -30], 24)
            },
            leg_r: {
                changedFrame: 1,
                len: 24,
                value: tween([19, 73, -20], [12, 73, 30], 24)
            }
        },
        [StateCache.run]: {
            leg_l: {
                changedFrame: 1,
                len: 15,
                value: tween([13, 73, 20], [18, 73, -30], 15)
            },
            leg_r: {
                changedFrame: 1,
                len: 15,
                value: tween([19, 73, -20], [12, 73, 30], 15)
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
                    [9, 73, 20],
                    [6, 73, 10],
                    [3, 73, 0]
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
                    [10, 56],
                    [7, 56],
                    [4, 56]
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
                    [14, 73, -40],
                    [11, 73, -50],
                    [9, 73, -60]
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
                    [11, 40, 105],
                    [8, 40, 105],
                    [5, 40, 105]
                ]
            },
            hand_r: {
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
                    [10, 42, 19],
                    [7, 42, 20],
                    [4, 42, 21]
                ]
            },
            weapon: {
                /**
                 * @param {PerState} ps 
                 */
                changedFrame(ps) {
                    let timer = ps.timer;
                    if (timer < 10) {
                        return timer - 1;
                    } else if (timer < 100) {
                        return ((timer - 10) % 30) + 9;
                    } else {
                        return 0;
                    }
                },
                len: 39,
                value: [
                    ...tween([33, 45, 185 + 12 * 1], [24, 50, 185 + 12 * 9], 10),
                    ...tween([24, 50, 185 + 12 * 10], [24, 50, 185 + 12 * 39], 30)
                ]
            },
            head: {
                /**
                 * @param {PerState} ps 
                 */
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
                    [13, 25],
                    [10, 26],
                    [8, 26]
                ]
            }
        },
        [StateCache.beHitBehind]: {
            hand_r: {
                changedFrame: 3,
                len: 1,
                value: [
                    [14, 42, 65]
                ]
            },
            weapon: {
                len: 1,
                value: [
                    [25, 65, -60]
                ]
            },
            head: {
                len: 1,
                value: [
                    [16, 25, -10]
                ]
            },
            leg_r: {
                len: 1,
                value: [
                    [17, 73, -15]
                ]
            }
        }
    }))
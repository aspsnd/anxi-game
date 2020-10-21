import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";

export default new MonstProto({
    name: '铁头怪',
    index: 1,
    height: 30,
    baseProp: {
        hp: 30,
        atk: 5,
        def: 0,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    level: 1,
    ai: {
        intelli: 1
    },
    reward: {
        money: 3,
        exp: 1
    },
    drops: {
        rate:0.2,
        equip: [
            [0, 5],
            [1, 5],
            [2, 8],
            [3, 8]
        ],
        material: [],
        extra: []
    },
    attacks: [3]
}).useHitGraph((pos, face, vita) => new Circle(pos[0], vita.centerY, 20))
    .useView(1).useAnchors({
        body: [0.62, 0.61],
        weapon: [-0.1, 1.05]
    }).useActionData({
        [StateCache.common]: {
            body: {
                changedFrame: 16,
                len: 1,
                value: [
                    [20, 17]
                ]
            },
            weapon: {
                changedFrame: 16,
                len: 2,
                value: [
                    [11, 22, 0],
                    [11, 22, 1]
                ]
            },
        },
        [StateCache.beHitBehind]: {
            weapon: {
                len: 1,
                value: [
                    [11, 22, -10]
                ]
            },
            body: {
                len: 1,
                value: [
                    [20, 17, -5]
                ]
            },
        },
        [StateCache.dead]: {
            weapon: {
                changedFrame(ps) {
                    let timer = ps.timer;
                    return timer > 20 ? 20 : timer;
                },
                len: 21,
                value: [
                    [18, 0, 185],
                    [18, 2, 190],
                    [18, 3, 195],
                    [18, 4, 200],
                    [18, 5, 205],
                    [18, 6, 210],
                    [18, 7, 215],
                    [18, 8, 220],
                    [18, 9, 225],
                    [18, 10, 230],
                    [18, 11, 235],
                    [18, 12, 240],
                    [18, 12, 245],
                    [18, 12, 250],
                    [18, 12, 255],
                    [18, 12, 260],
                    [18, 12, 265],
                    [18, 12, 265],
                    [18, 17, 265],
                    [18, 22, 265],
                    [18, 22, 265],
                ]
            },
            body: {
                changedFrame(ps) {
                    let timer = ps.timer;
                    if (timer < 5) return 0;
                    if (timer < 10) return 1;
                    if (timer < 15) return 2;
                    return 3;
                },
                len: 4,
                value: [
                    [20, 17, -5],
                    [19, 21, -10],
                    [18, 25, -15],
                    [17, 26, -20]
                ]
            }
        }
    })
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";

export default new MonstProto({
    name: '斧头兵',
    index: 0,
    height: 40,
    baseProp: {
        hp: 50,
        mp: 50,
        atk: 8,
        def: 0,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    level: 1,
    ai: {
        intelli: 3
    },
    reward: {
        money: 4,
        exp: 2
    },
    drops: {
        equip: [
            [0, 0.08],
            [1, 0.08],
            [2, 0.08],
            [3, 0.08]
        ],
        material: [],
        extra: []
    },
    attacks: [1]
}).useHitGraph((pos, face, vita) => {
    return new Circle(pos[0], vita.centerY - 15, 20);
}).useView(0).useAnchors({
    body: [0.5, 0.5],
    weapon: [0.58, 0.163]
}).useActionData({
    [StateCache.common]: {
        body: {
            changedFrame: 16,
            len: 1,
            value: [
                [20, 35]
            ]
        },
        weapon: {
            changedFrame: 16,
            len: 2,
            value: [
                [18, 28, 185],
                [18, 28, 186]
            ]
        },
    },
    [StateCache.beHitBehind]: {
        weapon: {
            len: 1,
            value: [
                [10, 25, 165]
            ]
        },
        body: {
            len: 1,
            value: [
                [20, 35, -5]
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
                [18, 28, 185],
                [18, 30, 190],
                [18, 31, 195],
                [18, 32, 200],
                [18, 33, 205],
                [18, 34, 210],
                [18, 35, 215],
                [18, 36, 220],
                [18, 37, 225],
                [18, 38, 230],
                [18, 39, 235],
                [18, 40, 240],
                [18, 40, 245],
                [18, 40, 250],
                [18, 40, 255],
                [18, 40, 260],
                [18, 40, 265],
                [18, 40, 265],
                [18, 45, 265],
                [18, 50, 265],
                [18, 50, 265],
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
                [20, 35, -5],
                [19, 39, -10],
                [18, 43, -15],
                [17, 44, -20]
            ]
        }
    }
})
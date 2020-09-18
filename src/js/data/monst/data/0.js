import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";

export default new MonstProto({
    name: '斧头兵',
    index: 0,
    height: 85,
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
}).useView(0).useAnchors({
    body: [0.5, 0.5],
    weapon: [0.58, 0.163]
}).useActionData({
    [StateCache.common]: {
        body: {
            changedFrame: 16,
            len: 1,
            value: [
                [20, 75]
            ]
        },
        weapon: {
            changedFrame: 16,
            len: 2,
            value: [
                [18, 68, 185],
                [18, 68, 186]
            ]
        },
    },
    [StateCache.beHitBehind]: {
        weapon: {
            len: 1,
            value: [
                [10, 65, 165]
            ]
        },
        body: {
            len: 1,
            value: [
                [20, 75, -5]
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
                [18, 68, 185],
                [18, 70, 190],
                [18, 71, 195],
                [18, 72, 200],
                [18, 73, 205],
                [18, 74, 210],
                [18, 75, 215],
                [18, 76, 220],
                [18, 77, 225],
                [18, 78, 230],
                [18, 79, 235],
                [18, 80, 240],
                [18, 80, 245],
                [18, 80, 250],
                [18, 80, 255],
                [18, 80, 260],
                [18, 80, 265],
                [18, 80, 265],
                [18, 85, 265],
                [18, 90, 265],
                [18, 90, 265],
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
                [20, 75, -5],
                [19, 79, -10],
                [18, 83, -15],
                [17, 84, -20]
            ]
        }
    }
})
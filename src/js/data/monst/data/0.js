import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";

export default new MonstProto({
    name: '斧头兵',
    index: 0,
    height: 30,
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
        money: 5,
        exp: 5
    },
    drops: {
        rate:0.2,
        equip: [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1]
        ],
        material: [],
        extra: []
    },
    attacks: [1]
}).useHitGraph((pos, face, vita) => {
    return new Circle(pos[0], vita.centerY, 20);
}).useView(0).useAnchors({
    body: [0.5, 0.5],
    weapon: [0.58, 0.163]
}).useActionData({
    [StateCache.common]: {
        body: {
            changedFrame: 16,
            len: 1,
            value: [
                [20, 12]
            ]
        },
        weapon: {
            changedFrame: 16,
            len: 2,
            value: [
                [18, 5, 185],
                [18, 5, 186]
            ]
        },
    },
    [StateCache.beHitBehind]: {
        weapon: {
            len: 1,
            value: [
                [10, 2, 165]
            ]
        },
        body: {
            len: 1,
            value: [
                [20, 12, -5]
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
                [18, 5, 185],
                [18, 7, 190],
                [18, 8, 195],
                [18, 9, 200],
                [18, 10, 205],
                [18, 11, 210],
                [18, 12, 215],
                [18, 13, 220],
                [18, 14, 225],
                [18, 15, 230],
                [18, 16, 235],
                [18, 17, 240],
                [18, 17, 245],
                [18, 17, 250],
                [18, 17, 255],
                [18, 17, 260],
                [18, 17, 265],
                [18, 17, 265],
                [18, 22, 265],
                [18, 27, 265],
                [18, 27, 265],
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
                [20, 12, -5],
                [19, 16, -10],
                [18, 20, -15],
                [17, 21, -20]
            ]
        }
    }
})
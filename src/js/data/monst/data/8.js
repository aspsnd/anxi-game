import { Matrix } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { tween } from "../../../util";

export default new MonstProto({
    index: 8,
    name: '红色石像',
    baseProp: {
        hp: 1200,
        atk: 45,
        def: 10,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    attacks: [9],
    height: 80,
    ai: {
        intelli: 5,
        attackDistance: 75
    },
    reward: {
        money: 50,
        exp: 50
    },
    drops: {
        equip: [
            // [7, 0.2]
        ],
        material: [
            // [0, 0.5]
        ]
    },
    getHitGraph(pos, face, vita) {
        return new Circle(pos[0], vita.centerY, 15);
    },
}).useView(8).useAnchors({
    head: [0.76, 0.5],
    body: [0.7, 0.5],
    weapon: [0.2, 0.5]
}).useActionData({
    [StateCache.common]: {
        head: {
            len: 1,
            value: [
                [25, 10]
            ]
        },
        body: {
            len: 1,
            value: [
                [22, 57]
            ]
        },
        hand_l: {
            len: 1,
            value: [
                [18, 57]
            ]
        },
        hand_r: {
            len: 1,
            value: [
                [18, 52, 10]
            ]
        },
        weapon: {
            len: 1,
            value: [
                [150, -30]
            ]
        },
        leg_l: {
            len: 1,
            value: [
                [18, 70, 15]
            ]
        },
        leg_r: {
            len: 1,
            value: [
                [25, 70, -15]
            ]
        },
        weapon: {
            len: 60,
            changedFrame: 1,
            value: tween([28, 54, -12], 30, [28, 54, -8], 30, [28, 54, -12])
        }
    },
    [StateCache.go]: {
        leg_l: {
            changedFrame: 1,
            len: 20,
            value: tween([18, 70, 15], [25, 70, -15], 20)
        },
        leg_r: {
            changedFrame: 1,
            len: 20,
            value: tween([25, 70, -15], [18, 70, 15], 20)
        }
    },
    [StateCache.run]: {
        leg_l: {
            changedFrame: 1,
            len: 13,
            value: tween([18, 70, 15], [25, 70, -15], 13)
        },
        leg_r: {
            changedFrame: 1,
            len: 13,
            value: tween([25, 70, -15], [18, 70, 15], 13)
        }
    },
    [StateCache.beHitBehind]: {
        wing: {
            len: 1,
            value: [
                [0, 22, -5]
            ]
        }
    },
    [StateCache.dead]: {
        head: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([68, 20], [68, 82], 21)
        },
        body: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([16, 44], [16, 58], 21),
        },
        wing: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween(new Matrix().translate(0, 22).toArray(), new Matrix().scale(1.1, 0.4).translate(0, 82).toArray(), 21)
        }
    }
})

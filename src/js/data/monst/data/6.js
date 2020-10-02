import { Matrix } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new MonstProto({
    index: 6,
    name: '悦兔',
    baseProp: {
        hp: 1200,
        atk: 45,
        def: 10,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.5,
    },
    skills: [15, 17, 16],
    attacks: [9],
    level: 12,
    height: 87,
    ai: {
        intelli: 5,
        skillFreeze: 600,
        attackDistance: 75,
        skill: [
            {
                index: 0,
                rate: 1 / 2,
                attackDistance: 200,
                skillFreeze: 180
            }
        ]
    },
    reward: {
        money: 50,
        exp: 50
    },
    drops: {
        equip: [
            [7, 0.2]
        ],
        material: [
            [0, 0.5]
        ]
    },
}).useView(6).useAnchors({
    head: [0.76, 0.5],
    body: [0.7, 0.5],
    hand_l: [0.2, 0.2],
    hand_r: [0.2, 0.2],
    leg_l: [0.3, 0.1],
    leg_r: [0.3, 0.1],
    weapon: [0.2, 0.5]
}).useHitGraph((pos, face, vita) => new Circle(pos[0], vita.centerY, 18)).useActionData({
    [StateCache.common]: {
        head: {
            len: 1,
            value: [
                [25, 18]
            ]
        },
        body: {
            len: 1,
            value: [
                [22, 65]
            ]
        },
        hand_l: {
            len: 1,
            value: [
                [18, 55]
            ]
        },
        hand_r: {
            len: 1,
            value: [
                [18, 60, 10]
            ]
        },
        weapon: {
            len: 1,
            value: [
                [150, -20]
            ]
        },
        leg_l: {
            len: 1,
            value: [
                [18, 78, 15]
            ]
        },
        leg_r: {
            len: 1,
            value: [
                [25, 78, -15]
            ]
        },
        weapon: {
            len: 60,
            changedFrame: 1,
            value: tween([28, 62, -12], 30, [28, 62, -8], 30, [28, 62, -12])
        }
    },
    [StateCache.go]: {
        leg_l: {
            changedFrame: 1,
            len: 20,
            value: tween([18, 78, 15], [25, 78, -15], 20)
        },
        leg_r: {
            changedFrame: 1,
            len: 20,
            value: tween([25, 78, -15], [18, 78, 15], 20)
        }
    },
    [StateCache.run]: {
        leg_l: {
            changedFrame: 1,
            len: 13,
            value: tween([18, 78, 15], [25, 78, -15], 13)
        },
        leg_r: {
            changedFrame: 1,
            len: 13,
            value: tween([25, 78, -15], [18, 78, 15], 13)
        }
    },
    [StateCache.beHitBehind]: {
        wing: {
            len: 1,
            value: [
                [0, 30, -5]
            ]
        }
    },
    [StateCache.dead]: {
        head: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([68, 28], [68, 90], 21)
        },
        body: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([16, 52], [16, 66], 21),
        },
        wing: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween(new Matrix().translate(0, 30).toArray(), new Matrix().scale(1.1, 0.4).translate(0, 90).toArray(), 21)
        }
    }
})
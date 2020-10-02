import { Matrix } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new MonstProto({
    index: 3,
    name: '噩梦眺望者',
    baseProp: {
        hp: 400,
        atk: 40,
        def: 5,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    skills: [6],
    height: 80,
    ai: {
        intelli: 3,
        attackDistance: 400,
        skillFreeze: 180,
        skill: [
            {
                index: 0,
                rate: 1 / 2,
                attackDistance: 600,
                skillFreeze: 400
            }
        ]
    },
    level: 6,
    reward: {
        money: 20,
        exp: 15
    },
    drops: {
        equip: [
            [5, 0.2],
            [8, 0.2],
        ],
    },
    attacks:[5]
}).useHitGraph((pos, face, vita) => new Circle(pos[0], vita.centerY, 20)).useView(3).useAnchors({
    head: [0.5, 0.5],
    weapon: [-1, 0.5],
    body: [0.5, 1 / 3],
    hand_l: [0.49, 0.59],
    leg_l: [0.5, 0.5],
    leg_r: [0.5, 0.5],
}).useActionData({
    [StateCache.common]: {
        weapon: {
            changedFrame: 1,
            len: 60,
            value: [
                ...tween([0, 35, 30], [0, 35, 35], 30),
                ...tween([0, 35, 35], [0, 35, 30], 30)
            ]
        },
        hand_l: {
            changedFrame: 16,
            len: 1,
            value: [
                [14, 10]
            ]
        },
        head: {
            changedFrame(ps, timer, vita) {
                return timer % 120 + (vita.face == -1 ? 120 : 0);
            },
            len: 240,
            value: [
                ...Array.from(new Array(120), (v, k) => [14, 10, k * 3]),
                ...Array.from(new Array(120), (v, k) => [-14, 10, 3 * k, true])
            ]
        },
        body: {
            len: 1,
            value: [
                [16, 42]
            ]
        },
        leg_l: {
            len: 1,
            value: [
                [0, 75]
            ]
        },
        leg_r: {
            len: 1,
            value: [
                [33, 75]
            ]
        }
    },
    [StateCache.beHitBehind]: {
        head: {
            changedFrame(ps, timer, vita) {
                return timer % 120 + (vita.face == -1 ? 120 : 0);
            },
            len: 240,
            value: [
                ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(0.8, 0.8).translate(14, 40)),
                ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(-0.8, 0.8).translate(14, 40)),
            ]
        },
    },
    [StateCache.go]: {
        leg_l: {
            changedFrame: 1,
            len: 20,
            value: tween([0, 75, 0], [0, 75, 72], 20)
        },
        leg_r: {
            changedFrame: 1,
            len: 20,
            value: tween([33, 75, 0], [33, 75, 72], 20)
        },
    },
    [StateCache.run]: {
        leg_l: {
            changedFrame: 1,
            len: 15,
            value: tween([0, 75, 0], [0, 75, 72], 15)
        },
        leg_r: {
            changedFrame: 1,
            len: 15,
            value: tween([33, 75, 0], [33, 75, 72], 15)
        },
    },
    [StateCache.dead]: {
        head: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([14, 40], [14, 100], 21)
        },
        weapon: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([0, 60, 30], [0, 60, 90], 21)
        },
        body: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([16, 72], [16, 86], 21),
        }
    }
})
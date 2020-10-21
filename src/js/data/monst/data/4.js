import { Matrix } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new MonstProto({
    index: 4,
    name: '噩梦守卫者',
    baseProp: {
        hp:500,
        atk: 40,
        def: 10,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    skills: [7],
    height: 80,
    level: 7,
    ai: {
        intelli: 3,
        skillFreeze: 180,
        attackDistance: 75,
        skill: [
            {
                index: 0,
                rate: 1 / 2,
                attackDistance: 600,
                skillFreeze: 360
            }
        ]
    },
    reward: {
        money: 20,
        exp: 15
    },
    drops: {
        rate:0.4,
        equip: [
            [6, 1],
            [8, 1],
        ]
    },
    attacks: [6]
}).useHitGraph((pos, face, vita) => new Circle(pos[0], vita.centerY, 20))
    .useView(4).useAnchors({
        head: [0.5, 0.5],
        weapon: [-1, 0.7],
        body: [0.5, 0.38],
        hand_l: [0.49, 0.5],
        hand_r: [0.5, 0],
        leg_l: [0.5, 0],
        leg_r: [0.5, 0],
    }).useActionData({
        [StateCache.common]: {
            weapon: {
                changedFrame: 1,
                len: 60,
                value: [
                    ...tween([20, 27, 80], [20, 27, 90], 30),
                    ...tween([20, 27, 90], [20, 27, 80], 30)
                ]
            },
            hand_l: {
                changedFrame: 16,
                len: 1,
                value: [
                    [14, 15]
                ]
            },
            hand_r: {
                changedFrame: 1,
                len: 60,
                value: [
                    ...tween([16, 37, -10], [16, 37, 0], 30),
                    ...tween([16, 37, 0], [16, 37, -10], 30)
                ]
            },
            head: {
                changedFrame(ps, timer, vita) {
                    return timer % 120 + (vita.face == -1 ? 120 : 0);
                },
                len: 240,
                value: [
                    ...Array.from(new Array(120), (v, k) => [18, 15, k * 3]),
                    ...Array.from(new Array(120), (v, k) => [-18, 15, 3 * k, true])
                ]
            },
            body: {
                len: 1,
                value: [
                    [16, 48]
                ]
            },
            leg_l: {
                changedFrame: 16,
                len: 1,
                value: [
                    [12, 68, 15]
                ]
            },
            leg_r: {
                changedFrame: 16,
                len: 1,
                value: [
                    [20, 68, -15]
                ]
            },
        },
        [StateCache.beHitBehind]: {
            head: {
                changedFrame(ps, timer, vita) {
                    return timer % 120 + (vita.face == -1 ? 120 : 0);
                },
                len: 240,
                value: [
                    ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(0.8, 0.8).translate(18, 15)),
                    ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(-0.8, 0.8).translate(18, 15)),
                ]
            },
        },
        [StateCache.go]: {
            leg_l: {
                changedFrame: 1,
                len: 24,
                value: tween([12, 68, 15], [20, 68, -15], 24)
            },
            leg_r: {
                changedFrame: 1,
                len: 24,
                value: tween([20, 68, -15], [12, 68, 15], 24)
            }
        },
        [StateCache.run]: {
            leg_l: {
                changedFrame: 1,
                len: 15,
                value: tween([12, 68, 15], [20, 68, -15], 15)
            },
            leg_r: {
                changedFrame: 1,
                len: 15,
                value: tween([20, 68, -15], [12, 68, 15], 15)
            }
        },
        [StateCache.dead]: {
            head: {
                changedFrame(ps) {
                    return Math.min(ps.timer, 20);
                },
                len: 21,
                value: tween([14, 15], [14, 75], 21)
            },
            weapon: {
                changedFrame(ps) {
                    return Math.min(ps.timer, 20);
                },
                len: 21,
                value: tween([0, 35, 30], [0, 35, 90], 21)
            },
            body: {
                changedFrame(ps) {
                    return Math.min(ps.timer, 20);
                },
                len: 21,
                value: tween([16, 47], [16, 61], 21),
            }
        }
    })
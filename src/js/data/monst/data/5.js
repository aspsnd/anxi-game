import { Matrix, State } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new MonstProto({
    index: 5,
    name: '噩梦编织者',
    baseProp: {
        hp: 1500,
        atk: 40,
        def: 15,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    height: 80,
    ai: {
        intelli: 5,
        skillFreeze: 180,
        skill: [
            {
                index: 0,
                rate: 1 / 2,
                attackDistance: 600,
                skillFreeze: 360
            }
        ]
    },
    skills: [8],
    attacks: [7],
    level: 10,
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
}).useView(5).useAnchors({
    head: [0.5, 0.5],
    body: [0.27, 0.5],
    wing: [1, 0.5]
}).useHitGraph((pos, face, vita) => new Circle(pos[0] + 50 * face, pos[1] + 20, 15))
    .useActionData({
        [StateCache.common]: {
            head: {
                changedFrame(ps, timer, vita) {
                    return timer % 300;
                },
                len: 300,
                value: tween([68, 18], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68 + 20 * (Math.random() - 0.5), 18 + 20 * (Math.random() - 0.5)], 30,
                    [68, 48]),
            },
            body: {
                len: 1,
                value: [
                    [16, 42]
                ]
            },
            wing: {
                len: 1,
                value: [
                    [0, 20]
                ]
            }
        },
        [StateCache.beHitBehind]: {
            wing: {
                len: 1,
                value: [
                    [0, 20, -5]
                ]
            }
        },
        [StateCache.dead]: {
            head: {
                changedFrame(ps) {
                    return Math.min(ps.timer, 20);
                },
                len: 21,
                value: tween([68, 18], [68, 80], 21)
            },
            body: {
                changedFrame(ps) {
                    return Math.min(ps.timer, 20);
                },
                len: 21,
                value: tween([16, 42], [16, 56], 21),
            },
            wing: {
                changedFrame(ps) {
                    return Math.min(ps.timer, 20);
                },
                len: 21,
                value: tween(new Matrix().translate(0, 20).toArray(), new Matrix().scale(1.1, 0.4).translate(0, 110).toArray(), 21)
            }
        }
    })
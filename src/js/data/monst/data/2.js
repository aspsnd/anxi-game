import { Matrix } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";
import { defaultHammerUrl } from "../../../sound/util";
import { tween } from "../../../util";

export default new MonstProto({
    index: 2,
    name: '噩梦之眼',
    baseProp: {
        hp: 150,
        atk: 15,
        def: 0,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed: 1.2,
    },
    level: 3,
    ai: {
        intelli: 6,
        skillFreeze: 180,
        attackDistance: 60,
        skill: [
            {
                index: 0,
                rate: 1 / 5,
                attackDistance: 260,
                skillFreeze: 240
            }
        ]
    },
    attacks: [4],
    reward: {
        money: 10,
        exp: 8
    },
    drops: {
        rate: 0.4,
        equip: [
            [4, 2],
            [5, 2],
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
        ],
    },
    skills: [5],
    height: 80,
}).useHitGraph((pos, face, vita) => new Circle(pos[0], vita.centerY, 20)).useView(2).useAnchors({
    head: [1, 0],
    weapon: [0.5, 0.5],
    body: [0.5, 0.6]
}).useActionData({
    [StateCache.common]: {
        head: {
            changedFrame: 16,
            len: 1,
            value: [
                [55, 18, -5]
            ]
        },
        weapon: {
            changedFrame(ps, timer, vita) {
                return timer % 120 + (vita.face == -1 ? 120 : 0);
            },
            len: 240,
            value: [
                ...Array.from(new Array(120), (v, k) => [19, 43, k * 3]),
                ...Array.from(new Array(120), (v, k) => [-19, 43, 3 * k, true])
            ]
        },
        body: {
            changedFrame: 16,
            len: 2,
            value: [
                [20, 48, 0],
                [20, 48, 1]
            ]
        },
    },
    [StateCache.beHitBehind]: {
        body: {
            len: 1,
            value: [
                [20, 48, -5]
            ]
        },
        weapon: {
            changedFrame(ps, timer, vita) {
                return timer % 120 + (vita.face == -1 ? 120 : 0);
            },
            len: 240,
            value: [
                ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(0.85, 1.05).translate(19, 43)),
                ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).translate(-19, 43).scale(-0.85, 1.05)),
            ]
        },
        head: {
            len: 1,
            value: [
                [55, 18, 0]
            ]
        }
    },
    [StateCache.dead]: {
        weapon: {
            changedFrame(ps) {
                return Math.min(parseInt(ps.timer / 5), 4);
            },
            len: 5,
            value: [
                [19, 70],
                new Matrix().scale(1.05, 0.9).translate(19, 48),
                new Matrix().scale(1.1, 0.8).translate(19, 53),
                new Matrix().scale(1.15, 0.7).translate(19, 58),
                new Matrix().scale(1.2, 0.9).translate(19, 63),
            ]
        },
        head: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            value: Array.from(new Array(21), (v, k) => [55, 18 + k * 2.5, -5 + k * 1.2]),
        },
        body: {
            changedFrame(ps) {
                return Math.min(ps.timer, 20);
            },
            len: 21,
            value: tween([20, 48, 0], [20, 68, -90], 21),
        }
    }
})
import { Matrix } from "pixi.js";
import { StateCache } from "../../../anxi/controller/state";
import { MonstProto } from "../../../anxi/proto/monst";
import { Circle } from "../../../anxi/shape/shape";
import { tween } from "../../../util";

export default new MonstProto({
    index: 7,
    name: '黄皮皮',
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
    attacks: [5],
    height: 80,
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
    ai: {
        intelli: 3,
        attackDistance: 400
    },
    level: 10,
    getHitGraph(pos, face, vita) {
        return new Circle(pos[0], vita.centerY, 20);
    },
}).useView(7).useAnchors({
    head: [0.7, 0.7],
    weapon: [-0.5, 0.5],
    body: [0.75, 0.5]
}).useActionData({
    [StateCache.common]: {
        weapon: {
            changedFrame: 1,
            len: 60,
            value: [
                ...tween([10, 45, 30], [10, 45, 35], 30),
                ...tween([10, 45, 35], [10, 45, 30], 30)
            ]
        },
        head: {
            changedFrame: 16,
            len: 2,
            value: [
                [16, 21, 0],
                [16, 20, 0],
            ]
        },
        body: {
            len: 1,
            value: [
                [16, 60]
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
                ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(0.8, 0.8).translate(14, 15)),
                ...Array.from(new Array(120), (v, k) => new Matrix().rotate(k * Math.PI / 60).scale(-0.8, 0.8).translate(14, 15)),
            ]
        },
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
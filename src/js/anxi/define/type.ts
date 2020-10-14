import { Vita } from "../atom/vita";
import { SingleState } from "../controller/state";

type ChangedFrameFunction = (ps: SingleState, timer: number, vita: Vita) => number
export type CertainActionData = {
    len: number,
    changedFrame: number | ChangedFrameFunction,
    value: [[]]
}
export type AllActionData = {
    head: CertainActionData,
    weapon: CertainActionData,
    body: CertainActionData,
    leg_r: CertainActionData,
    leg_l: CertainActionData,
    hand_r: CertainActionData,
    hand_l: CertainActionData,
    wing: CertainActionData
};
export type CardData = {
    name: String,
    index: number,
    card: String[],
    position: [number, number],
    crossOpen: [number, number],
    back: String,
    ground: number,
    walls: [
        [number, number, number]
    ]
    monsts: [
        [
            [number, number, number, number]
        ]
    ],
    boss: [
        [number, number, number, number]
    ]
}
export type HAI = {
    intelli: number,
    attackDistance:number,
    skill: {
        index: number,
        rate: number,
        attackDistance: number,
        skillFreeze: number
    }[],
    skillFreeze: number
}
export type ComtName = 'head' | 'body' | 'hand_l' | 'hand_r' | 'leg_l' | 'leg_r' | 'weapon' | 'wing'
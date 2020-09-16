import { Vita } from "../../po/vita";

type ChangedFrameFunction = (ps: import("../../po/state").PerState, timer: number, vita: Vita) => number
type CertainActionData = {
    len: number,
    changedFrame: number | ChangedFrameFunction,
    value: [[]]
}
export type ActionData = {
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
    skill: {
        index: number,
        rate: number,
        attackDistance: number,
        skillFreeze: number
    }[],
    skillFreeze: number
}
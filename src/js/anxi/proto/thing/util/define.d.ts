export type ThingData = {
    index: number,
    kind: number,
    prop: ThingProp
}
export type ThingProp = {
    atk: number,
    def: number,
    hp: number,
    mp: number,
    crt: number,
    dod: number,
    hpr: number,
    mpr: number,
    weapon: number,
    body: number,
    dcrt: number,
    wing: number
}
export type ThingPropDefine = {
    atk: number[],
    def: number[],
    hp: number[],
    mp: number[],
    crt: number[],
    dod: number[],
    hpr: number[],
    mpr: number[],
    weapon: number[],
    body: number[],
    dcrt: number[],
    wing: number[]
}
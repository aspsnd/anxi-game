import { AtomProto } from "./atom";

export class VitaProto extends AtomProto {
    name = 'undefined'
    level = 1
    group = -1
    baseProp = {
        hp: 100,
        mp: 100,
        atk: 5,
        def: 0,
        crt: 0,
        dod: 0,
        hpr: 0,
        mpr: 0,
        speed:1
    }
    skills = []
    wingSkill = undefined
    talents = []
    height = 100
    /**
     * @param {AtomProto} proto 
     */
    constructor(proto) {
        super(proto);
    }
}
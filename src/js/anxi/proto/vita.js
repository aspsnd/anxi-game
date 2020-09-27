import { ActionData } from "../action/action";
import { Vita } from "../atom/vita";
import { AnxiError } from "../error/base";
import { Shape } from "../shape/shape";
import { AtomProto } from "./atom";

export class VitaProto extends AtomProto {
    index
    attacks = []
    useIndex(index) {
        this.index = index;
        return this;
    }
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
        speed: 1
    }
    skills = []
    talents = []
    height = 100
    /**
     * @param {AtomProto} proto 
     */
    constructor(proto) {
        super(proto);
        Object.assign(this, proto);
    }
    useSkills(...skillIds) {
        this.skills = skillIds;
        return this;
    }
    useTalent(...tanlentIds) {
        this.talents = tanlentIds;
        return this;
    }
    defaultView
    useView(index) {
        throw new AnxiError('should not go there!');
    }
    defaultViewAnchor = {
        body: [0.5, 0.5],
        head: [0.5, 0.5],
        weapon: [0.5, 0.5],
        leg_l: [0.5, 0],
        leg_r: [0.5, 0],
        hand_l: [0.5, 0.5],
        hand_r: [0.5, 0.5],
        wing: [0, 0]
    }
    useAnchors(anchor) {
        this.defaultViewAnchor = anchor;
        return this;
    }
    getHitGraph = (pos, face, vita) => { throw new AnxiError('unimplement method!') }
    /**
     * @param {(pos:[number,number],face:number,vita:Vita)=>Shape} getter 
     */
    useHitGraph(getter) {
        this.getHitGraph = getter;
        return this;
    }
    actionData = undefined
    /**
     * @param {ActionData} actionData 
     */
    useActionData(actionData) {
        this.actionData = actionData;
        return this;
    }
}
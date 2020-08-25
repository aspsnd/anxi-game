import { Atom } from "../atom";

export const typicalProp = ['hp', 'mp', 'atk', 'def', 'crt', 'dod', 'hpr', 'mpr', 'speed'];
/**
 * 典型单位
 */
export class Vita extends Atom {
    static ID = 0
    id = Vita.ID++
    level = 0
    name = 'undefined'
    group = -1
    selectable = false
    face = 1
    baseProp = {

    }
    extraProp = {

    }
    prop = {

    }
    varProp = {
        nhp: 0,
        hmp: 0
    }
    compute() {

    }
    caculate(prop, bv) {

    }
    registerProp(propName) {

    }
    skills = []
    wingSkill = undefined
    talents = []
    height = 100
    jumpTimes = 0
    maxJumpTimes = 1
    /**
     * 当前附着物
     * @type {Wall}
     */
    stickingWall = null
    inair() {
        return this.stickingWall == null;
    }
    needCompute = false
    constructor(vita_proto) {
        super(vita_proto);

    }
    onTimer() {
        super.onTimer();
    }
    _tempX = 0
    _tempY = 0
    get x() {
        return this._tempX;
    }
    get y() {
        return this._tempY;
    }
    set x() {
        
    }
    set y() {

    }
    get centerY() {
        return this._tempY - this.height >> 1;
    }
    set centerY() {

    }
}
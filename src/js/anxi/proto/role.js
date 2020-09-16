import { Role } from "../../po/atom/role";
import { getDefaultView } from "../../util";
import { AnxiError } from "../error/base";
import { VitaProto } from "./vita";

export class RoleProto extends VitaProto {
    index
    useIndex(index) {
        this.index = index;
        return this;
    }
    /**
     * @param {VitaProto} proto 
     */
    constructor(proto) {
        super(proto);
    }
    useUraIndex(index) {
        this.uraIndex = index;
        return this;
    }
    uraIndex = 0
    getFexp = () => { throw new AnxiError('unimplement!') }
    /**
     * @param {(level:number)=>number} fexpGetter 
     */
    useFexpGetter(fexpGetter) {
        this.getFexp = fexpGetter;
        return this;
    }
    /**
     * @type {[{index:number,cost:{money:number}}]}
     */
    fultureSkills = []
    /**
     * @param {[{index:number,cost:{money:number}}]} fultureSkills 
     */
    useFultureSkills(fultureSkills) {
        this.fultureSkills = fultureSkills;
        return this;
    }
    /**
     * @type {[{index:number,cost:{money:number}}]}
     */
    fultureTalents = []
    /**
     * @param {[{index:number,cost:{money:number}}]} fultureSkills 
     */
    useFultureTalents(fultureTalents) {
        this.fultureTalents = fultureTalents;
        return this;
    }
    nextLevel = (role, nextLevel) => { throw new AnxiError('unimplement!') }
    /**
     * @param {(role:Role,nextLevel:number)=>{hp:number,mp:number,atk:number,def:number}} nextLevel 
     */
    useNextLevel(nextLevel) {
        this.nextLevel = nextLevel;
        return this;
    }
    needRest = false
    restTime = 0
    restInterval = 999999
    useRest(restTime = 110, restInterval = 60 * 5) {
        this.needRest = true;
        this.restTime = restTime;
        this.restInterval = restInterval;
        return this;
    }
    useView(index) {
        this.defaultView = getDefaultView(index);
        return this;
    }
}
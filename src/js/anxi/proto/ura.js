import { URAController } from "../controller/ura";

export class URAProto{
    index
    constructor(index) {
        this.index = index;
    }
    /**
     * @type {(this:URAController)=>void}
     */
    getHandler = () => { }
    /**
     * @param {(this:URAController)=>void} getHandler 
     */
    onGet(getHandler) {
        this.getHandler = getHandler;
        return this;
    }
    /**
     * @type {(this:URAController)=>void}
     */
    lostHandler = () => { }
    /**
     * @param {(this:URAController)=>void} lostHandler 
     */
    onLost(lostHandler) {
        this.lostHandler = lostHandler;
        return this;
    }
    /**
     * @type {(this:URAController,prop:string,bv:number)=>number}
     */
    caculater = (prop, bv) => 0
    /**
     * @param {(this:URAController,prop:string,bv:number)=>number} caculater 
     */
    useCaculater(caculater) {
        this.caculater = caculater;
        return this;
    }
}
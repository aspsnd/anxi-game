import { ItemEventDispatcher } from "./event";
/**
 * 永恒单位，不触发生命周期
 */
export class Conster extends ItemEventDispatcher{
    constructor(){
        super();
    }
}
import { Atom } from "./atom";

/**
 * 控制器的抽象
 */
export class Controller {
    /**
     * @type {Atom}
     */
    belonger 
    /**
     * @param {Atom} atom 
     */
    constructor(atom){
        this.belonger = atom;
    }
}
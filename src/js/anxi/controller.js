import { Atom } from "./atom";
import { Vita } from "./atom/vita";

/**
 * 控制器的抽象
 */
export class Controller {
    /**
     * @type {Vita}
     */
    belonger
    /**
     * @param {Atom} atom 
     */
    constructor(atom) {
        this.belonger = atom;
    }
    init() {

    }
    refresh() {

    }
    onTimer() {

    }
}
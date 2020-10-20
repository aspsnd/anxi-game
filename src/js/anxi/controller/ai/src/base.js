import { Vita } from "../../../atom/vita";
import { Instruct } from "../instruct";
export class BehaviorTree {
    /**
     * @return {Instruct}
     * @param {Vita} vita
     */
    getNextInstruct(vita) { }
    /**
     * @param {(vita:Vita)=>Instruct} nextFunc 
     */
    constructor(nextFunc) {
        this.getNextInstruct = nextFunc;
    }
}
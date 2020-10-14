import { ItemEvent } from "../../event";

export class Instruct {
    /**
     * @param {ItemEvent} event 
     */
    constructor(event) {
        this.event = event;
    }
    waitTime = 0;
    wait(time){
        this.waitTime = time;
        return this;
    }
    used = false;
}
import { Application } from "pixi.js";
import { Atom } from "../atom";
import { Vita } from "./vita";

export class ForeverWorld extends Atom {
    /**
     * @param {Application} app 
     */
    constructor(app) {
        super();
        app.ticker.add(this.onTimer.bind(this));
    }
}
export class World extends Atom {
    constructor(){
        super();
    }
    /**
     * @type {Vita[]}
     */
    vitas = []
    
}
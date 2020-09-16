import { Role } from "../../po/role";
import { DisplayObject } from "pixi.js";

export class BaseGui {

    /**
     * @type {DisplayObject}
     */
    baseContainer
    constructor() {}
    show(){
        this.baseContainer.visible = true;
    }
    hide(){
        this.baseContainer.visible = false;
    }
    refresh(){
        
    }
}
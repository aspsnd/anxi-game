import { Container, Sprite, Matrix } from "pixi.js";
import { Vita } from "../../po/vita";
import { gameApp } from "../../util";
import { baseRoleAction } from "../../data/role/action";

export var VitaComt = ['weapon', 'head', 'body', 'hand_l', 'hand_r', 'leg_l', 'leg_r', 'wing'];
export class SmallVita {

    view = new Container()

    blocks = {

    }

    /**
     * @param {Vita} vita 
     */
    constructor(vita) {
        this.vita = vita;
        this.view.x = 65;
        // this.view.y = 20;
        let tick = this.onFrame.bind(this);
        gameApp.ticker.add(tick);
        this.tick = tick;

        for (let comt of VitaComt) {
            this.view.addChild(this.blocks[comt] = new Sprite());
        }
    }
    lastFrame = {

    }
    frame = 0;
    showing = false;
    onFrame() {
        if (!this.showing) return;
        this.frame++;
        for (let comt of VitaComt) {
            let action = this.vita.manager.action['common'][comt];
            let frame = this.getFrame(action);
            if (frame == this.lastFrame[comt]) continue;
            this.lastFrame[comt] = frame;
            /**
             * @type {PIXI.Sprite}
             */
            let sprite = this.blocks[comt];
            let matrix = convert(action.value[frame]).translate(-18, 0);
            sprite.transform.setFromMatrix(matrix);
        }
    }
    getFrame(action) {
        let { changedFrame, len } = action;
        if (typeof changedFrame == 'number') {
            if (!len) {
                return 0;
            } else {
                return Math.floor(this.frame / changedFrame) % len;
            }
        } else {
            return 0;
        }
    }
    refresh(role) {
        this.vita = role;
        for (let comt of VitaComt) {
            let model = this.vita.viewController.blocks[comt];
            this.blocks[comt].texture = model.texture;
            this.blocks[comt].anchor = model.anchor;
        }
    }
    show() {
        this.showing = true;
    }
    hide() {
        this.showing = false;
    }
    destory() {
        gameApp.ticker.remove(this.tick);
    }
}
/**
 * @return {PIXI.Matrix}
 * @param {Array<Number> | Array[]} arr 
 */
function convert(arr) {
    if (!arr) return new Matrix();
    if (arr instanceof Matrix) return arr.clone();
    if (arr.length == 2) {
        if (arr[0] instanceof Array) {
            return convert(arr[0]).append(convert(arr[1]));
        }
        return new Matrix(1, 0, 0, 1, ...arr);
    }
    if (arr.length == 6) return new Matrix(...arr);
    if (arr.length == 3) return new Matrix().rotate(arr[2] * Math.PI / 180).translate(arr[0], arr[1]);
    if (arr.length == 4) return new Matrix().rotate(arr[2] * Math.PI / 180).translate(arr[0], arr[1]).scale(arr[3] ? -1 : 1, 1);
    console.warn('convert transform error, use default');
    return [1, 0, 0, 1, 0, 0];
}
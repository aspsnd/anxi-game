import { Controller } from "../controller";
import { Container, Sprite } from "pixi.js";
import { Vita } from "../atom/vita";
import { by } from "../../util";

export class ViewController extends Controller {
    static convert(arr) {
        if (!arr) return new Matrix();
        if (arr instanceof Matrix) return arr.clone();
        if (arr.length == 2) {
            if (arr[0] instanceof Array) {
                return convert(arr[0]).append(convert(arr[1]));
            }
            return new Matrix(1, 0, 0, 1, ...arr);
        }
        if (arr.length == 6) return new Matrix(...arr);
        if (arr.length == 9) return new Matrix(arr[0], arr[1], arr[3], arr[4], arr[2], arr[5]);
        if (arr.length == 3) return new Matrix().rotate(arr[2] * Math.PI / 180).translate(arr[0], arr[1]);
        if (arr.length == 4) return new Matrix().rotate(arr[2] * Math.PI / 180).translate(arr[0], arr[1]).scale(arr[3] ? -1 : 1, 1);
        if (arr.length == 5) return new Matrix().scale(arr[3], arr[4]).rotate(arr[2] * Math.PI / 180).translate(arr[0], arr[1]);
        console.warn('convert transform error, use default');
        return [1, 0, 0, 1, 0, 0];
    }
    /**
     * @param {Vita} vita 
     */
    constructor(vita) {
        super(...arguments);
        this.vita = vita;
        this.init();
    }
    init() {
        this.initImage();
        this.initReact();
    }
    initImage() {
        let { vita } = this;
        let { proto } = vita;
        let { defaultView, defaultViewAnchor } = proto;
        this.blocks.body = new Sprite(by(defaultView.body));
        this.blocks.body.anchor.set(...(defaultViewAnchor.body || [0, 0]));
        this.blocks.head = new Sprite(by(defaultView.head));
        this.blocks.head.anchor.set(...(defaultViewAnchor.head || [0, 0]));
        this.blocks.leg_l = new Sprite(by(defaultView.leg_l));
        this.blocks.leg_l.anchor.set(...(defaultViewAnchor.leg_l || [0, 0]));
        this.blocks.leg_r = new Sprite(by(defaultView.leg_r));
        this.blocks.leg_r.anchor.set(...(defaultViewAnchor.leg_r || [0, 0]));
        this.blocks.hand_l = new Sprite(by(defaultView.hand_l));
        this.blocks.hand_l.anchor.set(...(defaultViewAnchor.hand_l || [0, 0]));
        this.blocks.hand_r = new Sprite(by(defaultView.hand_r));
        this.blocks.hand_r.anchor.set(...(defaultViewAnchor.hand_r || [0, 0]));
        this.blocks.weapon = new Sprite(by(defaultView.weapon));
        this.blocks.weapon.anchor.set(...(defaultViewAnchor.weapon || [0, 0]));
        this.blocks.wing = new Sprite(by(defaultView.wing));
        this.blocks.wing.anchor.set(...(defaultViewAnchor.wing || [0, 0]));
        this.view.addChild(
            this.blocks.leg_l,
            this.blocks.leg_r,
            this.blocks.hand_l,
            this.blocks.body,
            this.blocks.hand_r,
            this.blocks.head,
            this.blocks.weapon,
            this.blocks.wing
        );
    }
    initReact() {
        //
    }
    view = new Container()
    /**
     * @type {{
        * body: PIXI.Sprite,
        head: PIXI.Sprite,
        hand_l: PIXI.Sprite,
        hand_r: PIXI.Sprite,
        leg_l: PIXI.Sprite,
        leg_r: PIXI.Sprite,
        weapon: PIXI.Sprite,
        wing: PIXI.Sprite,
        * }}
    */
    blocks = {
        body: undefined,
        head: undefined,
        hand_l: undefined,
        hand_r: undefined,
        leg_l: undefined,
        leg_r: undefined,
        weapon: undefined,
        wing: undefined,
    }
    onTimer() {
        let ss = this.belonger.stateController.displayState;

    }
    lastFrame = {
        body: [],
        head: [],
        hand_l: [],
        hand_r: [],
        leg_l: [],
        leg_r: [],
        weapon: [],
        wing: []
    }
    /**
     * 临时action存储，可由其它组件注入，
     */
    actionIndex = 0;
    action = {

    }
    insertAction(action) {
        this.actionIndex++;
        this.action = action;
        return this.actionIndex;
    }
    removeAction(actionIndex) {
        if (actionIndex == this.actionIndex) {
            this.action = {};
            this.lastFrame = {
                body: [],
                head: [],
                hand_l: [],
                hand_r: [],
                leg_l: [],
                leg_r: [],
                weapon: [],
                wing: []
            }
        }
    }
    getActionData(state, comt) {
        let vita = this.vita;
        return this.action?.[comt] ??
            vita.proto.action[state]?.[comt] ??
            baseRoleAction[state]?.[comt] ??
            vita.proto.manager.action['common']?.[comt] ??
            baseRoleAction['common'][comt];
    }
    getFrame(action, state) {
        let { changedFrame, len } = action;
        if (typeof changedFrame == 'number') {
            if (!len) {
                return 0;
            } else {
                return Math.floor(state.timer / changedFrame) % len;
            }
        } else if (changedFrame instanceof Function) {
            return changedFrame(state, this.vita.timer, this.vita);
        } else {
            return 0;
        }
    }
}
export const convert = ViewController.convert;
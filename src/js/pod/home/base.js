import { Graphics, Sprite } from "pixi.js";
import { gameTink, by, GameWidth, GameHeight } from "../../util";

export class ToolGUI {
    textureUrl = './res/util/gui/bg.png';
    container = new Sprite()
    constructor() {
        this.container.visible = false;
    }
    init() {
        this._initCloseButton();
        this._initBg();
    }
    _initBg(){
        this.container.texture = by(this.textureUrl);
    }
    closeBtn
    _initCloseButton() {
        this.closeBtn = gameTink.button([
            by('./res/util/gui/close1.png'),
            by('./res/util/gui/close2.png'),
            by('./res/util/gui/close2.png'),
        ]);
        this.closeBtn.tap = _ => {
            this.hide();
        }
        this.closeBtn.anchor.set(0.5, 0.5);
        this.closeBtn.position.set(GameWidth - 30, 30);
        this.container.addChild(this.closeBtn);
    }
    appendTo(container) {
        container.addChild(this.container);
        return this;
    }
    show() {
        this.refresh();
        this.container.visible = true;
    }
    hide() {
        this.container.visible = false;
    }
    refresh() {

    }
    bind(sprite) {
        sprite.tap = _ => {
            this.show();
        }
        return this;
    }
}
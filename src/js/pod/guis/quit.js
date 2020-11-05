import { Graphics, Text, TextStyle, Filter } from "pixi.js";
import { World } from "../../anxi/atom/world";
import { GlobalEventCaster } from "../../anxi/instruct/global";
import { openPtoCtrlRun } from "../../boot";
import { QuickOpen } from "../../po/gui/open";
import { gameSound, gameTink } from "../../util";
import { BaseGui } from "./gui";
/**
 * 返回地图界面
 */
export class OpenQuit extends BaseGui {
    constructor() {
        super();
        let quitContainer = new Graphics();
        this.baseContainer = quitContainer;
        quitContainer.visible = false;
        quitContainer.x = 320;
        quitContainer.y = 200;
        quitContainer.beginFill(0x000000);
        quitContainer.drawRect(0, 0, 320, 175);
        quitContainer.endFill();
        /**
         * @test
         */
        if (openPtoCtrlRun) {
            GlobalEventCaster.on('dkey_p', e => {
                if (!this.world) return;
                if (!World.instance.running) {
                    World.instance.start();
                } else {
                    World.instance.stop();
                }

            })
        }
        let bgVBtn = this.bgVBtn = new QuitBtn(`背景音量`, 20, 25);
        quitContainer.addChild(bgVBtn);
        bgVBtn.tap = _ => {
            let v = gameSound.cardBg.volume;
            v += 0.1;
            v = Math.round(10 * v);
            if (v > 10) v = 0;
            gameSound.cardBg.volume = v * 0.1;
            bgVBtn.refresh();
        }
        bgVBtn.refresh = _ => {
            bgVBtn.text = `背景音量 - ${Math.round(gameSound?.cardBg?.volume * 10 ?? 10)}`;
        }
        let quitBtn = new QuitBtn('返回地图', 20, 100);
        quitContainer.addChild(quitBtn);
        quitBtn.tap = () => {
            this.world.stop();
            /**
             * @todo
             */
            this.world.end(true);
            QuickOpen.refresh();
        }
    }
    /**
     * @type {World}
     */
    world
    /**
     * @param {World} world 
     */
    bind(world) {
        this.world = world;
        world.toolContainer.addChild(this.baseContainer);
    }
    refresh() {
        this.bgVBtn.refresh();
    }
}
export class QuitBtn extends Graphics {
    set text(value) {
        this.basetext.text = value;
    }
    get text() {
        return this.basetext.text;
    }
    constructor(_text, x = 0, y = 0) {
        super();
        this.position.set(x, y);
        this.width = 280;
        this.height = 50;
        this.lineStyle(1, 0x00ffff);
        this.drawRect(0, 0, 280, 50);
        let text = this.basetext = new Text(_text, new TextStyle({
            fill: [0xff00ff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffff00],
            fontSize: 24
        }));
        text.anchor.set(0.5, 0.5);
        text.position.set(140, 25);
        this.addChild(text);
        gameTink.makeInteractive(this);
    }
    refresh() {

    }
}
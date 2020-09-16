import { Graphics, Text, TextStyle, Filter } from "pixi.js";
import { Fight } from "../../po/fight";
import { Game } from "../../po/game";
import { gameTink } from "../../util";
import { BaseGui } from "./gui";
import { QuickOpen } from "../../po/open";
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
        quitContainer.width = 340;
        quitContainer.y = 200;
        quitContainer.height = 100;
        quitContainer.beginFill(0x000000);
        quitContainer.drawRect(0, 0, 320, 100);
        quitContainer.endFill();
        Fight.elseContainer.addChild(quitContainer);
        /**
         * @test
         */
        document.addEventListener('keydown', e => {
            if (!Game.inCard) return;
            if (e.key == 'p') {
                if (!Fight.instance.running) {
                    Fight.instance.start();
                } else {
                    Fight.instance.stop();
                }
            }
        })
        let btn = new Graphics();
        btn.x = 20;
        btn.width = 280;
        btn.height = 50;
        btn.y = 25;
        btn.lineStyle(1, 0x00ffff);
        btn.drawRect(0, 0, 280, 50);
        quitContainer.addChild(btn);

        let text = new Text('返回地图', new TextStyle({
            fill: [0xff00ff, 0xffffff, 0xffffff, 0xffffff, 0xffffff, 0xffff00],
            fontSize: 24
        }));
        text.anchor.set(0.5, 0.5);
        text.position.set(140, 25);
        btn.addChild(text);

        gameTink.makeInteractive(btn);
        btn.tap = () => {
            Fight.instance.stop();
            Fight.instance.end(true);
            QuickOpen.refresh();
        }
    }
}
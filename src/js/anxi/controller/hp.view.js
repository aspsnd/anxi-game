import { Container, Graphics, Text } from "pixi.js";
import { Monst } from "../../po/atom/monst";
import { World } from "../atom/world";
import { Controller } from "../controller";
import { ViewController } from "./view";
import { NameStyle } from "./view.util";

export class HPBarController extends Controller {
    /**
     * @param {Monst} monst 
     */
    constructor(monst, color = 0xff0000) {
        super(monst);
        let hpbar = new Container();
        hpbar.x = -25;
        hpbar.y = -20;
        let border = new Graphics();
        border.lineStyle(1, 0x0, 0.25);
        border.drawRect(0, 0, 50, 4);
        hpbar.addChild(border);
        let bar = new Graphics();
        bar.beginFill(color, 1);
        bar.drawRect(1, 1, 48, 2);
        bar.endFill();
        hpbar.addChild(bar);
        hpbar.bar = bar;
        hpbar.visible = false;
        this.hpbar = hpbar;
        monst.viewController.view.addChild(hpbar);
        monst.on('beAffect', e => {
            if (e.value.finalHarm > 0) {
                this.show(120);
            }
        });
        monst.on('timing', this.onTimer.bind(this), true);
    }
    showTime = 0
    showing = false
    onTimer() {
        if (this.showTime == 0) {
            this.showing = false;
            this.hpbar.visible = false;
        }
        let per = this.belonger.varProp.hp / this.belonger.prop.hp;
        this.hpbar.bar.width = per * 48;
        if (this.showing) {
            this.showTime--;
        }
    }
    show(time) {
        if (this.showTime) {
            this.showTime = Math.max(time, this.showTime);
        } else {
            this.showTime = time;
            this.showing = true;
            this.hpbar.visible = true;
        }
    }
}
export class BigHPBarController extends Controller {
    /**
     * @param {Monst} monst 
     */
    constructor(monst, color = 0xff0000, index = 0) {
        super(monst);
        let name = new Text(monst.name, NameStyle);
        name.position.set(345, 80 + 30 * index);
        name.anchor.set(1, 0.5);
        World.instance.toDestory.push(name);
        World.instance.guiContainer.addChild(name);

        let hpbar = new Container();
        hpbar.x = 345;
        hpbar.y = 71 + 30 * index;
        let border = new Graphics();
        border.lineStyle(2, 0x0, 1);
        border.beginFill(0xeeeeee);
        border.drawRect(0, 0, 354, 14);
        border.endFill();
        hpbar.addChild(border);
        let bar = new Graphics();
        bar.beginFill(color, 1);
        bar.drawRect(2, 2, 350, 10);
        bar.endFill();
        hpbar.addChild(bar);
        hpbar.bar = bar;
        this.hpBar = hpbar;
        World.instance.toDestory.push(hpbar);
        World.instance.guiContainer.addChild(hpbar);
        monst.on('timing', this.onTimer.bind(this), true);
    }
    onTimer() {
        let per = this.belonger.varProp.hp / this.belonger.prop.hp;
        this.hpBar.bar.width = per * 350;
    }
}
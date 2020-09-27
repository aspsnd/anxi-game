import { World } from "../../anxi/atom/world";
import { BagController } from "../../pod/guis/bag";
import { OpenQuit } from "../../pod/guis/quit";
import { SkillPanel } from "../../pod/guis/skill";
// import { RealWorld } from "../world";

/**
 * 初始化cv快捷键等 ！这是此游戏中唯一的打开方式
 */
export class QuickOpen {

    /**
     * @type {QuickOpen}
     */
    static instance
    /**
     * @param {World} world 
     */
    static bind(world) {
        this.world = world;
        for(let key in this.instance.kvs){
            let tool = this.instance.kvs[key];
            tool.bind(world);
        }
    }
    static emit(key) {
        if (!this.world || this.world.dead) return;
        if (!this.instance) return;
        let instance = this.instance;
        if (!instance.keys.includes(key)) return;
        if (!instance.nowOpen) {
            instance.nowOpen = true;
            instance.nowOpenKey = key;
            instance.kvs[key].refresh();
            instance.kvs[key].show();
            this.world.stop();
        } else {
            if (key == instance.nowOpenKey) {
                instance.kvs[key].hide();
                instance.nowOpen = false;
                this.world.start();
            }
        }
    }
    nowOpen = false
    constructor(roles, keys = ['c', 'z', 'v']) {
        this.keys = keys;
        this.nowOpenKey = keys[0];
        let openQuit = new OpenQuit();
        let skillPanel = new SkillPanel(roles);
        let bagController = new BagController(roles);
        this.kvs = {
            [keys[0]]: bagController,
            [keys[1]]: openQuit,
            [keys[2]]: skillPanel,
        }
        QuickOpen.instance = this;
    }
    static refresh() {
        this.instance.refresh();
    }
    refresh() {
        this.nowOpen = false;
        for (let key of this.keys) {
            this.kvs[key].hide();
        }
    }
}
document.addEventListener('keydown', e => {
    QuickOpen.emit(e.key);
})

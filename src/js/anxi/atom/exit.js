import { Container, Graphics, Sprite } from "pixi.js";
import { Monst } from "../../po/atom/monst";
import { by, gameDust } from "../../util";
import { Atom } from "../atom";

export class Exit extends Atom {
    /**
     * @param {Monst} monst 
     */
    constructor(monst) {
        super();
        this.opener = monst;
        this.view = new Container();
        this.view.position.set(monst.x, monst.centerY);
        this.x = monst.x;
        this.y = monst.centerY;
        monst.world.wallContainer.addChild(this.view);
        let roles = monst.world.roles.filter(role => !role.dead);
        this.roles = roles;
        roles.forEach(role => {
            role.on('finishcard', e => {
                if (this.catchedRoleIds.includes(role.id)) {
                    role.world.cross();
                    role.world.end(true);
                }
            })
        })
        this.init();
    }
    init() {
        let sprite = new Sprite(by('./res/util/gui/outbg.png'));
        sprite.anchor.set(0.5, 0.5);
        sprite.alpha = 0;
        this.bg = sprite;
        this.view.addChild(sprite);
    }
    onTimer() {
        super.onTimer();
        this.catchRole();
        if (this.timer < 20) {
            this.bg.alpha += 0.05;
        }
        this.view.angle += 2.5;
        this.world.dust.create(0, 0, a => {
            let s = new Sprite(by(this.catchedRoleIds.length == 0 ? './res/util/gui/out.png' : './res/util/gui/out2.png'));
            s.rotation = a;
            return s;
        }, this.view, Math.min(10, this.timer >> 2), 0, true, undefined, undefined, 24, 44, 1, 1.2);
    }
    catchedRoleIds = []
    catchRole() {
        this.catchedRoleIds = [];
        for (let role of this.roles) {
            if (Math.abs(role.x - this.x) < 50 && Math.abs(role.centerY - this.y) < 50) {
                this.catchedRoleIds.push(role.id);
            }
        }
    }
}
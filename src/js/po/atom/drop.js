import { Sprite } from "pixi.js";
import { Atom } from "../../anxi/atom";
import { Flyer } from "../../anxi/atom/flyer";
import { Vita } from "../../anxi/atom/vita";
import { AnxiError } from "../../anxi/error/base";
import { ItemEvent } from "../../anxi/event";
import { ThingProto } from "../../anxi/proto/thing/base";
import { getDropUrl } from "../../data/thing/all";
import { by, randomNode } from "../../util";

export class Drop extends Atom {
    height = 2
    stickingWall
    /**
     * @param {ThingProto} object 
     */
    constructor(object) {
        super();
        let sprite = new Sprite(by(getDropUrl(object)));
        let max = Math.max(sprite.width, sprite.height);
        let scale = max > 50 ? 40 / max : 0.8;
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(scale, scale);
        this.root = sprite;
        this.object = object;
        this.on('movey', e => {
            let moveUtil = e.value;
            let { old, value } = moveUtil;
            this.stickingWall = null;
            if (value > old) {
                //下落 看看是否有墙体收留
                this.world.walls.some(wall => {
                    if (wall.willStickByY(old + this.height, value + this.height, this.x)) {
                        this.stickingWall = wall;
                        moveUtil.value = wall.y - this.height;
                        return true;
                    }
                    return false;
                })
            } else {
                //上升 判断是否撞墙
                this.world.walls.some(wall => {
                    if (wall.canup) return false;
                    if (wall.willHitByY(this.x, value)) {
                        moveUtil.value = wall.y + wall.height;
                        return true;
                    }
                    return false;
                })
            }
        }, true);
    }
    beCatched = false
    /**
     * @param {Vita} vita 
     */
    from(vita) {
        this.landIn(vita.world, 1);
        this._tempX = vita.x;
        this._tempY = vita.y;
        vita.world.vitaContainer.addChild(this.root);
    }
    onTimer() {
        super.onTimer();
        if (this.beCatched) return;
        if (!this.stickingWall) {
            this.y++;
        }
        this.reloadPosition();
        this.getBelonger();
    }
    reloadPosition() {
        this.root.position.set(this._tempX, this._tempY);
    }
    _tempX = 0
    _tempY = 0
    get x() {
        return this._tempX;
    }
    get y() {
        return this._tempY;
    }
    set x(value) {
        if (Number.isNaN(value)) throw new AnxiError('argsError');
        if (value == this._tempX) return;
        let oldX = this._tempX;
        let moveUtil = {
            old: oldX,
            value: value
        };
        this.on(new ItemEvent('movex', moveUtil));
        this._tempX = moveUtil.value;
    }
    set y(value) {
        if (Number.isNaN(value)) throw new AnxiError('argsError');
        if (value == this._tempY) return;
        let oldY = this._tempY;
        let moveUtil = {
            old: oldY,
            value: value
        };
        this.on(new ItemEvent('movey', moveUtil));
        this._tempY = moveUtil.value;
    }
    destory() {
        super.die();
        let flyer = new Flyer(this.root).useLiveTime(60).useConstAngle(0).useConstSpeed([0, -1]).onTime(_ => {
            this.root.alpha -= 0.016;
        });
        flyer.landIn(this.world, 1);
    }
    getBelonger() {
        let roles = this.world.roles.filter(role => !role.dead).filter(role => {
            let dy = role.centerY - this.y;
            if (dy > 50 || dy < -50) return false;
            let dx = role.x - this.x;
            if (Math.abs(dx) > 25) return false;
            return true;
        })
        if (roles.length == 0) return;
        this.beCatched = true;
        let getter = randomNode(roles);
        getter.getThing(this.object);
        this.destory();
    }

}
import { TilingSprite } from "pixi.js";
import { by, GameHeight, GameWidth } from "../../util";
import { Conster } from "../const";
import { WallProto } from "../proto/wall";

/**
 * 墙体模拟器，地面，跳板...
 */
export class Wall extends Conster {
    /**
     * @param {WallProto} proto 
     */
    constructor(proto) {
        super();
        this.proto = proto;
        this.width = proto.imgWidth;
        this.height = proto.height;
        this.imgHeight = proto.imgHeight;
        this.canup = proto.up;
        this.candown = proto.down;
        this.glue = proto._glue;
        this.sprite = proto._repeat ? new TilingSprite(by(proto.url), proto.imgWidth, proto.imgHeight) : new Sprite(by(proto.url));
        this.sprite.width = proto.imgWidth;
        this.sprite.height = proto.imgHeight;
        this.offsetY = this.imgHeight - this.height;
    }
    get x() {
        return this.sprite.x;
    }
    set x(x) {
        this.sprite.x = x;
        return x;
    }
    get y() {
        return this.sprite.y + this.offsetY;
    }
    set y(y) {
        this.sprite.y = y - this.offsetY;
        return y;
    }

    /**
     * vita是否应当从drop状态变为附着于该墙体
     * 只有y改变才有可能从下落变为附着
     */
    willStickByY(oldValue, newValue, x) {
        let tx = this.x;
        let ty = this.y;
        return oldValue <= ty && newValue > ty && x > tx && x < tx + this.width;
    }


    willOutByX(nx) {
        let x = this.x;
        return (nx <= x) || (nx >= x + this.width);
    }

    /**
     * 是否撞击下表面
     * 判断头顶
     * @param {number} nx 
     * @param {number} ny 头顶y坐标
     */
    willHitByY(nx, ny) {
        let x = this.x;
        let y = this.y;
        return (nx > x && nx < x + this.width) && (ny > y && ny < y + this.height);
    }
    /**
     * 是否撞击左右表面
     * 
     * @param {number} nx 
     * @param {number} ny 脚底坐标
     * @param {number} height 真实高度
     */
    willHitByX(nx, ny, height) {
        let x = this.x;
        let y = this.y;
        return (nx > x && nx < x + this.width) && (ny + height < y - this.height && ny > y);
    }

}
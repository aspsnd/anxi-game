import { Sprite } from "pixi.js";
import { Role } from "../../../po/atom/role";
import { by, gameDust, GameHeight } from "../../../util";
import { Affect } from "../../affect";
import { World } from "../../atom/world";
import { Controller } from "../../controller";
import { ItemEvent } from "../../event";
import { Circle } from "../../shape/shape";
/**
 * 残影控制器
 */
export class ShadowController extends Controller {
    static bodyUrl = './res/util/role/0/shadow/1.png'
    static weaponUrl = './res/util/role/0/shadow/2.png'
    /**
     * 残影维持时间
     */
    continueTime = 180
    /**
     * 残影是否爆炸
     */
    endBoom = false
    getBoomHarm() {
        return 0;
    }
    /**
     * @param {Role} role 
     */
    constructor(role) {
        super(role);
        this.role = role;
        this.tick = this.role.on('timing', this.onTime.bind(this), true);
        if (this.role.shadowEndBoom) this.endBoom = true;
        if (this.role.shadowContinueTime) this.continueTime = this.role.shadowContinueTime;
    }
    onTime(e) {
        let role_x = this.role.x;
        let role_y = this.role.centerY;
        let timer = this.role.timer;
        this.shadows.forEach(_s => {
            let shadow = _s.shadow;
            shadow.x += shadow.vx ?? 0;
            shadow.y += shadow.vy ?? 0;
        });
        this.shadows = this.shadows.filter(_s => {
            if (timer - _s.createTime >= this.continueTime) {
                if (this.endBoom) {
                    this.boom(_s.shadow.x, _s.shadow.y);
                }
                _s.shadow.destroy();
                return false;
            } else {
                return true;
            }
        });
        let hits = [];
        this.weapons = this.weapons.filter(_w => {
            let role = this.role;
            let sprite = _w.weapon;
            let rate = 0.5 - _w.lastTime * 1 / ShadowController.ReturnTime * 0.5;
            if (_w.lastTime < 20) {
                sprite.alpha = _w.lastTime * 0.05;
            }
            sprite.x += (role_x - sprite.x) * rate;
            sprite.y += (role_y - sprite.y) * rate;
            sprite.rotation = sprite.y < role_y ? -Math.atan((sprite.x - role_x) / (sprite.y - role_y)) : Math.PI - Math.atan((sprite.x - role_x) / (sprite.y - role_y));
            let circle = new Circle(sprite.x, sprite.y, 70);
            let shootedVitas = role.world.selectableVitas().filter(vita => Boolean(vita)).filter(vita => vita.group != role.group)
                .filter(vita => !_w.shootedVitas.includes(vita.id))
                .filter(vita => circle.hit(vita.getHitGraph()));
            hits.push(...shootedVitas);
            shootedVitas.forEach(vita => {
                _w.shootedVitas.push(vita.id);
                let affect = new Affect(_w.proto, role, vita);
                affect.setout();
            })
            if (_w.lastTime-- > 0) {
                return true;
            } else {
                sprite.destroy();
                return false;
            }
        });
        if (hits.length > 0) {
            this.belonger.on(new ItemEvent('hitenemys', hits, this.belonger.skillController.skills.find(skill => skill.index == 4)));
        }
    }
    static ReturnTime = 45
    /**
     * @type [{
     *  createTime:number,
     *  shadow:Sprite
     * }]
     */
    shadows = []
    /**
     * @type [{
     *  lastTime:number,
     *  weapon:Sprite,
     *  proto:{},
     *  shootedVitas:[number]
     * }]
     */
    weapons = []
    create(x, y) {
        let shadow = new Sprite(by(ShadowController.bodyUrl));
        World.instance.vitaContainer.addChild(shadow);
        shadow.anchor.set(0.5, 0.5);
        shadow.position.set(x, y);
        shadow.alpha = 0.5;
        shadow.scale.set(this.role.face, 1);
        this.shadows.push({
            createTime: this.role.timer,
            shadow: shadow
        });
        return shadow;
    }
    /**
     * 将所有的残影转化为剑气，收回，造成伤害
     * @param {{
     *  harm:{
     *  common:number,
     *  absolute:number
     *  },
     *  debuff:[]
     * }} proto
     */
    worsen(proto) {
        let x = this.role.x;
        let y = this.role.centerY;
        this.shadows.forEach(s => {
            let sprite = s.shadow;
            sprite.texture = by(ShadowController.weaponUrl);
            sprite.alpha = 1;
            sprite.rotation = Math.atan(-(sprite.x - x) / (sprite.y - y));
            let weapon = {
                lastTime: ShadowController.ReturnTime,
                weapon: sprite,
                proto: proto,
                shootedVitas: []
            };
            this.weapons.push(weapon);
        });
        this.shadows = [];
    }
    destory() {
        this.role.removeCommonHandler(this.tick, 'timing');
    }
    /**
     * 在指定位置创建爆炸
     * @param  {...number} pos 
     */
    boom(...pos) {
        gameDust.create(
            pos[0], pos[1],
            () => new Sprite(by(ShadowController.bodyUrl)),
            World.instance.vitaContainer,
            35,
            0,
            true,
            undefined, undefined,
            10, 35,
            2, 5,
            0, 10,
            0.05, 0.15,
            0, 0.05
        );
        let circle = new Circle(pos[0], pos[1], 70);
        let role = this.role;
        let shoots = World.instance.selectableVitas().filter(vita => vita.group != role.group)
            .filter(vita => circle.hit(vita.getHitGraph()));
        if (shoots.length > 0) {
            this.belonger.on(new ItemEvent('hitenemys', shoots, this.belonger.skillController.skills.find(skill => skill.index == 2)));
        }
        shoots.forEach(vita => {
            /**
             * 这是单位之间一对一的效果 可以包括伤害和debuff
             */
            let affect = new Affect(this, role, vita);
            affect.harm.common = 50 + role.level * 8 + role.prop.atk * 0.8;
            affect.setout();
        });
    }
    refresh() {
        this.shadows = [];
    }
}
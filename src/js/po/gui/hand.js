import { Circle, Container, Graphics, Sprite, Text } from "pixi.js";
import { ItemEvent } from "../../anxi/event";
import { GlobalEventCaster } from "../../anxi/instruct/global";
import { isMobile } from "../../boot";
import { a2r, by, directBy, GameHeight, GameWidth, getSkillIcon } from "../../util";
import { Role } from "../atom/role";
import { QuickOpen } from "./open";

export class HandShake extends Container {
    directContainer = new Sprite(directBy('gui/hand/directc.png'))
    directCircle = new Sprite(directBy('gui/hand/direct.png'))
    actionContainer = new Container()
    attackCircle = new Sprite(directBy('gui/hand/attack.png'))
    jumpCircle = new Sprite(directBy('gui/hand/jump.png'))
    skillCircles = Array.from(new Array(5), _ => new Sprite(directBy('icon/skill/default.png')))
    wingCircle = new Sprite(directBy('gui/hand/wing.png'))
    uraCircle = new Sprite(directBy('gui/hand/ura.png'))
    bagCircle = new Sprite(directBy('gui/hand/bag.png'))
    quitCircle = new Sprite(directBy('gui/hand/quit.png'))
    skillCircle = new Sprite(directBy('gui/hand/skill.png'))
    /**
     * @type {Role}
     */
    role = undefined
    constructor() {
        super();
        this.directContainer.anchor.set(0.5, 0.5);
        this.directCircle.anchor.set(0.5, 0.5);
        this.directContainer.position.set(150, GameHeight - 150);
        this.addChild(this.directContainer);
        this.directContainer.addChild(this.directCircle);
        this.directCircle.interactive = true;
        let directtouching = false;
        let changed = [0, 0];
        this.directCircle.hitArea = new Circle(0, 0, 40);
        this.directCircle.on('touchstart', e => {
            directtouching = true;
            this.directCircle.identifier = e.data.originalEvent.touches[0].identifier;
            this.directCircle.beginPoint = [e.data.global.x, e.data.global.y];
        });
        this.directCircle.on('touchmove', e => {
            if (!directtouching) return;
            let nowPoint = [e.data.global.x, e.data.global.y];
            changed = [nowPoint[0] - this.directCircle.beginPoint[0], nowPoint[1] - this.directCircle.beginPoint[1]];
            let distance2 = changed[0] ** 2 + changed[1] ** 2;
            if (distance2 > 2500) {
                let rate = (distance2 / 2500) ** -0.5;
                changed[0] *= rate;
                changed[1] *= rate;
            }
            this.directCircle.position.set(...changed);
            // 0 -- 10 11 -- 30 31 -- 50
            let abs = Math.abs(changed[0]);
            if (abs <= 10) {
                GlobalEventCaster.on(new ItemEvent('wantmobilestand'));
            } else if (abs <= 30) {
                GlobalEventCaster.on(new ItemEvent('wantmobilego', changed[0] > 0 ? 1 : -1));
            } else {
                GlobalEventCaster.on(new ItemEvent('wantmobilerun', changed[0] > 0 ? 1 : -1));
            }
        });
        appCanvas.addEventListener('touchend', e => {
            if (e.changedTouches[0].identifier !== this.directCircle.identifier) return;
            directtouching = false;
            changed = [0, 0];
            GlobalEventCaster.on(new ItemEvent('wantmobilestand'));
            this.directCircle.position.set(0, 0);
        });
        this.attackCircle.position.set(GameWidth - 160, GameHeight - 120);
        this.attackCircle.anchor.set(0.5, 0.5);
        this.attackCircle.interactive = true;
        this.addChild(this.attackCircle);
        this.attackCircle.hitArea = new Circle(0, 0, 50);
        this.attackCircle.on('tap', e => {
            GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('wantattack')));
        });
        this.jumpCircle.position.set(GameWidth - 95, GameHeight - 55);
        this.jumpCircle.anchor.set(0.5, 0.5);
        this.jumpCircle.interactive = true;
        this.addChild(this.jumpCircle);
        this.jumpCircle.hitArea = new Circle(0, 0, 30);
        this.jumpCircle.on('tap', e => {
            changed[1] > 30 ? GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('wantdown')))
                : GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('wantjump')));
        });
        this.uraCircle.position.set(GameWidth - 65, GameHeight - 250);
        this.uraCircle.anchor.set(0.5, 0.5);
        this.uraCircle.hitArea = new Circle(0, 0, 25);
        this.addChild(this.uraCircle);
        this.uraCircle.interactive = true;
        this.uraCircle.on('tap', _ => {
            GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('wantura')));
        });
        this.wingCircle.position.set(GameWidth - 65, GameHeight - 150);
        this.wingCircle.anchor.set(0.5, 0.5);
        this.wingCircle.hitArea = new Circle(0, 0, 25);
        this.addChild(this.wingCircle);
        this.wingCircle.interactive = true;
        let winging = false;
        let wingIdentifiler = -1;
        this.wingCircle.on('touchstart', e => {
            winging = true;
            wingIdentifiler = e.data.originalEvent.touches[0].identifier;
            GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('wantskill', 0)));
        });
        appCanvas.addEventListener('touchend', e => {
            if (!winging) return;
            if (e.changedTouches[0].identifier !== wingIdentifiler) return;
            GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('cancelskill', 0)));
            winging = false;
        });
        this.skillCircles.forEach((sprite, index) => {
            let angle = index * 35 + 145;
            sprite.position.set(GameWidth - 160 + 100 * Math.cos(a2r(angle)), GameHeight - 120 + 100 * Math.sin(a2r(angle)));
            sprite.anchor.set(0.5, 0.5);
            this.addChild(sprite);
            let mask = new Graphics().beginFill(0xffffff).drawCircle(0, 0, 20).endFill();
            mask.position.set(sprite.x, sprite.y);
            sprite.mask = mask;
            this.addChild(mask);
            sprite.interactive = true;
            sprite.hitArea = new Circle(0, 0, 20);
            let identifier = -1;
            let skilling = false;
            sprite.on('touchstart', e => {
                skilling = true;
                identifier = e.data.originalEvent.touches[0].identifier;
                GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('wantskill', index + 1)));
            });
            appCanvas.addEventListener('touchend', e => {
                if (!skilling) return;
                if (e.changedTouches[0].identifier !== identifier) return;
                GlobalEventCaster.on(new ItemEvent('copymobile', _ => new ItemEvent('cancelskill', index + 1)));
                skilling = false;
            });
            let g = new Graphics().lineStyle(3, 0x0099ff, 0.85).drawCircle(0, 0, 20);
            sprite.addChild(g);
        });
        this.bagCircle.position.set(GameWidth - 240, 40);
        this.bagCircle.anchor.set(0.5, 0.5);
        this.bagCircle.interactive = true;
        this.bagCircle.hitArea = new Circle(0, 0, 25);
        this.bagCircle.on('tap', e => {
            QuickOpen.emit(QuickOpen.instance.keys[0]);
        });
        this.addChild(this.bagCircle);
        this.skillCircle.position.set(GameWidth - 160, 40);
        this.skillCircle.anchor.set(0.5, 0.5);
        this.skillCircle.interactive = true;
        this.skillCircle.hitArea = new Circle(0, 0, 25);
        this.skillCircle.on('tap', e => {
            QuickOpen.emit(QuickOpen.instance.keys[2]);
        });
        this.addChild(this.skillCircle);
        this.quitCircle.position.set(GameWidth - 80, 40);
        this.quitCircle.anchor.set(0.5, 0.5);
        this.quitCircle.interactive = true;
        this.quitCircle.hitArea = new Circle(0, 0, 25);
        this.quitCircle.on('tap', e => {
            QuickOpen.emit(QuickOpen.instance.keys[1]);
        });
        this.addChild(this.quitCircle);
    }
    /**
     * @param {Role} role 
     */
    initRole(role) {
        if (!role instanceof Role) return;
        this.role = role;
        this.refreshRoleSkillIcons(role);
        role.on('skillchange', e => {
            this.refreshRoleSkillIcons(role);
        }, true);
    }
    /**
     * @param {Role} role 
     */
    refreshRoleSkillIcons(role) {
        this.skillCircles.forEach((sprite, index) => {
            sprite.texture = by(getSkillIcon(role.skills[index] ?? -1));
        })
    }
}
export const HandShakeContainer = _ => isMobile ? new HandShake() : new Container();
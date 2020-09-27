import { Graphics, Sprite } from "pixi.js";
import { a2r } from "../../util";
import { Affect } from "../affect";
import { Atom } from "../atom";
import { ItemEvent } from "../event";
import { Circle, Shape } from "../shape/shape";
import { Vita } from "./vita";
import { World } from "./world";
/**
 * 无属性单位 有生命周期
 */
export class Flyer extends Atom {
    static ID = 0
    id = -1
    timer = 0
    /**
     * @type {Sprite | Graphics}
     */
    root
    /**
     * @type {Sprite}
     */
    checker
    static areaGetter = (x, y) => new Circle(x, y, 5)
    /**
     * @type {(this:Flyer,x:number,y:number)=>Shape}
     */
    areaGetter = Flyer.areaGetter
    /**
     * 传入根元素
     * @param {Sprite} sprite 
     * @param {(this:Flyer, sprite:Sprite | Graphics)=>void} initer
     */
    constructor(sprite, initer = () => { }) {
        super();
        this.id = Flyer.ID++;
        this.root = sprite;
        this.checker = sprite;
        initer.call(this, sprite);
    }

    /**
     * @param {Sprite} sprite 
     */
    useChecker(sprite) {
        this.checker = sprite;
        return this;
    }
    /**
     * 
     * @param {(this:Flyer,x:number,y:number)=>Shape} areaGetter 
     */
    useHitAreaGetter(areaGetter) {
        this.areaGetter = areaGetter;
        return this;
    }
    speed = 0
    angle = 0
    /**
     * @type {[number]}
     */
    shootedVitas = []
    onTimer() {
        super.onTimer();
        if (this._disposed) {
            return;
        }
        if (this.dead) {
            if (this.deadTime + this.moil <= this.timer) {
                this.dispose();
            }
            return;
        }
        if (!(this.livetime === true || this.timer < this.livetime)) {
            this.die();
            return;
        }
        this.timeHandler.forEach(handler => handler.call(this, this.timer));
        let speed = this.speed = this.speedGetter?.(this.timer) ?? this.constSpeed;
        let angle = this.angle = this.angleGetter?.(this.timer) ?? this.constAngle;
        this.root.angle = angle;
        if (Array.isArray(speed)) {
            this.root.x += speed[0];
            this.root.y += speed[1];
        } else {
            const radian = a2r(angle);
            let vx = speed * Math.cos(radian);
            let vy = speed * Math.sin(radian);
            this.root.x += vx;
            this.root.y += vy;
        }
        if (!this.ifcheck()) return;
        let area = this.areaGetter(this.checker.x, this.checker.y);
        let hits = this.checkFilter(this.belonger.world.selectableVitas().filter(v => !this.shootedVitas.includes(v.id))).filter(v => area.hit(v.getHitGraph()));
        let belonger = this.belonger;
        if (hits.length == 0) return;
        if (this.dieAfterHit) {
            this.speedGetter = undefined;
            this.constSpeed = 0;
            this.angleGetter = undefined;
            this.constAngle = 0;
        }
        this.on(new ItemEvent('hittarget', hits, belonger));
        hits.forEach(enemy => {
            this.shootedVitas.push(enemy.id);
            if (!this.affectGetter) return;
            let affect = this.affectGetter(belonger, enemy);
            belonger.on(new ItemEvent('setAffect', affect, enemy));
            affect.finalDefuff = affect.debuff;
            enemy.on(new ItemEvent('getAffect', affect, belonger));
            if (affect.beDod) {
                this.on(new ItemEvent('bedod'), affect, enemy);
            } else {
                enemy.on(new ItemEvent('beAffect', affect, belonger));
            }
            belonger.on(new ItemEvent('resAffect', affect, enemy));
        });
        this.dieAfterHit && this.die();
    }
    timeHandler = []
    /**
     * @param {(this:Flyer,timer:number)=>{}} handler 
     */
    onTime(handler) {
        this.timeHandler.push(handler);
        return this;
    }
    constSpeed = 0
    /**
     * @param {number | [number,number]} speed 
     */
    useConstSpeed(speed) {
        this.constSpeed = speed;
        return this;
    }
    speedGetter = undefined
    /**
     * @param {(timer:number) => number} speedGetter 
     */
    useSpeedGetter(speedGetter) {
        this.speedGetter = speedGetter;
        return this;
    }
    constAngle = 0
    /**
     * @param {number} angle 
     */
    useConstAngle(angle) {
        this.constAngle = angle;
        return this;
    }
    angleGetter = undefined
    /**
     * @param {(timer:number) => number} getter 
     */
    useAngleGetter(getter) {
        this.angleGetter = getter;
        return this;
    }
    ifcheck = _ => false
    /**
     * @param {[number]} arr 
     */
    checkFromArray(arr) {
        this.ifcheck = _ => arr.includes(this.timer);
        return this;
    }
    /**
     * @param {Boolean} bool 
     */
    checkFromBool(bool) {
        this.ifcheck = _ => bool;
        return this;
    }
    /**
     * @param {(timer:number)=>boolean} handler 
     */
    checkFromHandler(handler) {
        this.ifcheck = handler;
        return this;
    }

    /**
     * @type {(from:Vita,to:Vita)=>Affect}
     */
    affectGetter = undefined;
    /**
     * @param {(vita:Vita)=>Affect} getter 
     */
    useAffectGetter(getter) {
        this.affectGetter = getter;
        return this;
    }
    die() {
        this.deadTime = this.timer;
        this.dead = true;
        this.on('dead');
        return this;
    }
    deadTime = -1
    dead = false
    dieAfterHit = false
    ifDieAfterHit(bool) {
        this.dieAfterHit = bool;
        return this;
    }
    /**
     * 苟活时间
     */
    moil = 1
    fadeAfterDie(time) {
        this.moil = time;
        return this;
    }

    /**
     * @type {Vita}
     */
    belonger
    /**
     * @param {Vita} vita 
     */
    from(vita) {
        this.belonger = vita;
        this.landIn(vita.world, vita.timespeed);
        this.world = vita.world;
        vita.world.elseAtoms[this.id] = this;
        vita.world.vitaContainer.addChild(this.root);
        return this;
    }
    /**
     * @param {Atom} atom 
     */
    bindTo(atom) {
        this.atom = atom;
        this.belonger = atom?.belonger;
        this.link(atom.world);
        atom.on('timing', e => {
            this.onTimer();
            return this._disposed;
        });
        let el = atom.once('dead', e => {
            this.die();
        })
        this.once('clear', e => {
            atom.removeHandler(el);
        })
        return this;
    }
    /**
     * @param {Flyer} flyer 
     */
    addTo(flyer) {
        flyer.root.addChild(this.root);
        return this;
    }
    /**
     * 
     * @type {(this:Flyer,vitas:Vita[])=>Vita[]} 
     */
    checkFilter = arr => arr;
    /**
     * @param {(this:Flyer,vitas:Vita[])=>Vita[
     * ]} filter 
     */
    useFilter(filter) {
        this.checkFilter = filter;
        return this;
    }
    _disposed = false;
    dispose() {
        if (this._disposed) return;
        this._disposed = true;
        this.on('clear');
        this.root._destroyed || this.root.destroy();
        this.world.elseAtoms[this.id] = undefined;
        this.belonger = null;
        this.refreshAbsolute();
        this.root = null;
        this.world = null;
    }
    livetime = true
    /**
     * @param {number | Boolean} time 
     */
    useLiveTime(time) {
        this.livetime = time;
        return this;
    }

}
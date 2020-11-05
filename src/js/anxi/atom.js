import { ItemEventDispatcher, ItemEvent } from "./event";
import { AlreadyDoneError } from "./error/base";
import { AtomProto } from "./proto/atom";
import { World } from "./atom/world";
/**
 * 包含生命周期的单位
 */
export class Atom extends ItemEventDispatcher {
    timespeed = 1
    btimespeed = 1
    timeChangeRates = []
    timeRate = 1
    timer = 0

    _running = true
    get running() {
        return this._running;
    }
    set running(bool) {
        if (this._running ^ bool) {
            this._running = bool;
            this.on(new ItemEvent('runchange',bool));
            if (bool) {
                this.on(new ItemEvent('start'));
            } else {
                this.on(new ItemEvent('stop'));
            }
        }
    }
    start() {
        this.running = true;
    }
    stop() {
        this.running = false;
    }
    caculateTimespeed() {
        let addedRate = 1;
        this.timeChangeRates.forEach(r => addedRate *= r);
        if (addedRate != this.timeRate) {
            let rvalue = this.timeRate;
            this.timeRate = addedRate;
            this.on(new ItemEvent('timeratechange', [rvalue, addedRate], this));
        }
    }
    /**
     * @param {AtomProto} proto 
     */
    constructor(proto = { timespeed: 1 }) {
        super();
        this.proto = proto;
        this.btimespeed = proto.timespeed;
        this.on('timeratechange', e => {
            this.timespeed = this.btimespeed * this.timeRate;
        }, true);
        this.caculateTimespeed();
    }
    lastTimerFrame = 0
    frame = 0
    onFrame(frame = ++this.frame) {
        while (frame - this.lastTimerFrame >= this.timespeed) {
            this.lastTimerFrame += this.timespeed;
            this.onTimer();
        }
    }
    onTimer() {
        if (!this.running) return;
        this.timer++;
        this.on(`timer_${this.timer}`);
        this.on(`timing`);
        this.on('timer_end');
    }
    dead = false
    realDead = false
    /**
     * 进入死亡过渡态
     */
    die() {
        if (this.dead) return;
        this.dead = true;
        this.on(new ItemEvent('die'));
        this.wakeTime == 0 ? this.reallyDie() : this.once(`timer_${this.timer + this.wakeTime}`, e => {
            this.reallyDie();
        })
    }
    /**
     * @type {World}
     */
    world
    /**
     * 加入世界，拥有自己时间
     * @param {Atom} world 
     */
    landIn(world, timespeed = 1) {
        this.world = world;
        this.btimespeed = timespeed;
        return world.on('timing', e => {
            if (!world.running) return;
            this.onFrame();
            return this.realDead;
        });
    }
    /**
     * 跟随父级，共享时间
     * @param {Atom} atom 
     */
    follow(atom) {
        atom.on('timing', e => {
            this.onTimer();
            return this.realDead;
        })
        return this;
    }
    onlyDie() {
        if (this.dead) throw new AlreadyDoneError('this atom already is dead!');
        this.die();
    }
    /**
     * 真正的抹除
     */
    reallyDie() {
        this.realDead = true;
        this.on(new ItemEvent('reallydie'));
    }
    wakeTime = 0
}
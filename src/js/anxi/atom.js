import { ItemEventDispatcher, ItemEvent } from "./event";
import { AlreadyDoneError } from "./error/base";
import { AtomProto } from "./proto/atom";
/**
 * 包含生命周期的单位
 */
export class Atom extends ItemEventDispatcher {
    timespeed = 1
    btimespeed = 1
    timeChangeRates = []
    timeRate = 1
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
    constructor(proto) {
        super();
        this.proto = proto;
        this.btimespeed = proto.timespeed;
        this.on('timeratechange', e => {
            this.timespeed = this.btimespeed * this.timeRate;
        }, true);
        this.caculateTimespeed();
    }
    lastTimerFrame = 0
    onFrame(frame) {
        while (frame - this.lastTimerFrame >= this.timespeed) {
            this.lastTimerFrame += this.timespeed;
            this.onTimer();
        }
    }
    onTimer() {
        this.timer++;
        this.on(`timer_${this.timer}`);
        this.on(`timing`);
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
     * 加入世界，拥有自己时间
     * @param {Atom} world 
     */
    landIn(world, timespeed = 1) {
        this.btimespeed = timespeed;
        world.on('timing', e => {
            this.onFrame();
            return this.realDead;
        });
    }
    /**
     * 跟随父级，共享时间
     * @param {Atom} atom 
     */
    follow(atom){
        atom.on('timing',e=>{
            this.onTimer();
            return this.realDead;
        })
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
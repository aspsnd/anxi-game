import { Controller } from "../controller";
import { AnxiError } from "../error/base";
import { ItemEvent } from "../event";

export class StateController extends Controller {
    static autoChangeIndex = -99999;
    static baseState = ['common', 'rest', 'go', 'run', 'jump', 'jumpSec', 'hard', 'URA', 'IME', 'drop', 'hover', 'banhover'
        , 'attack', 'poison', 'beHitBehind', 'dizzy', 'hurt', 'dead', 'slow', 'silence', 'fast']
    static cache = {
        common: -100,
        rest: -99,
        go: 100,
        run: 101,
        jump: 200,
        jumpSec: 201,
        hard: -200,   //  僵直状态
        URA: -300,  //无双 免控
        IME: -400,  //无敌
        drop: 300,
        hover: 499,
        banhover: 500,//禁飞
        attack: 400,
        poison: -402,  //中毒
        beHitBehind: 501,//被击退
        dizzy: 600,  //眩晕
        hurt: -401,//重伤
        dead: 10000,
        slow: this.autoChangeIndex++,
        fast: this.autoChangeIndex++,
        silence: this.autoChangeIndex++,
        border: this.autoChangeIndex++
    }
    static complexState = [
        this.cache.hard, this.cache.URA, this.cache.IME, this.cache.poison, this.cache.dizzy, this.cache.slow, this.cache.beHitBehind,
        this.cache.fast, this.cache.border
    ]
    /**
     * @type {SingleState[]}
     */
    states = {}
    /**
     * @return {SingleState}
     * @param {number} stateIndex 
     */
    getSingleState(stateIndex) {
        return this.states[stateIndex] || this.registerState(stateIndex, StateController.complexState.includes(stateIndex));
    }
    _displayIndex
    /**
     * @type {SingleState}
     */
    get displayState() {
        return this.states[this._displayIndex];
    }
    set displayState(ds) {
        this._displayIndex = ds.index;
    }
    isRegistered(stateIndex) {
        return !!this.states[stateIndex];
    }
    registerState(stateNumber = -(2 << 16), complex = false) {
        if (this.states[stateNumber]) throw new Error('already registered！');
        let ss = this.states[stateNumber] = new SingleState(stateNumber, 0, false, complex);
        this.belonger.on(`loststate_${stateNumber}`, e => {
            ss.lastLost = this.belonger.timer;
            ss.timer = 0;
            if (this.displayState.index == stateNumber) {
                this.displayState = this.getExistSSS().reduce((a, b) => b.index > a.index ? b : a);
            }
        }, true);
        this.belonger.on(`getstate_${stateNumber}`, e => {
            ss.lastGet = this.belonger.timer;
            if (this.displayState.index < stateNumber) {
                this.displayState = ss;
            }
        }, true);
        return ss;
    }
    constructor() {
        super(...arguments);
        this.init();
    }
    /**
     * @return {SingleState[]}
     */
    getExistSSS() {
        let sss = [];
        for (const key in this.states) {
            let ss = this.states[key];
            if (ss.exist()) {
                sss.push(ss);
            }
        }
        return sss;
    }
    init() {
        for (const key of StateController.baseState) {
            let value = StateCache[key];
            this.registerState(value, StateController.complexState.includes(value));
        }
        this.displayState = this.states[StateCache.common];
        this.states[StateCache.common].infinite = true;
        this.belonger.on('timing', this.onTimer.bind(this), true);
    }
    includes(...stateIndexs) {
        return stateIndexs.some(stateIndex => {
            let ss = this.getSingleState(stateIndex);
            return ss.infinite || ss.last > 0;
        })
    }
    has(stateIndex) {
        let ss = this.getSingleState(stateIndex);
        return ss.infinite || ss.last > 0;
    }
    /**
     * simple
     */
    removeState(...stateIndex) {
        for (let index of stateIndex) {
            if (!this.has(index)) continue;
            let ss = this.getSingleState(index);
            if (ss.complex) {
                ss.removeAll();
            } else {
                ss.last = 0;
                ss.infinite = false;
            }
            this.belonger.on(new ItemEvent(`loststate_${index}`));
        }
    }
    /**
     * simple
     */
    setStateTime(stateIndex, last) {
        let ss = this.getSingleState(stateIndex);
        if (ss.complex) throw new AnxiError('complex state!');
        if (last == 0) {
            if (ss.exist()) {
                ss.last = 0;
                if (!ss.infinite) {
                    this.belonger.on(new ItemEvent(`loststate_${stateIndex}`));
                }
            }
        } else {
            if (!ss.exist()) {
                ss.last = last;
                this.belonger.on(new ItemEvent(`getstate_${stateIndex}`));
            } else {
                ss.last = last;
            }
        }
    }
    /**
     * simple
     */
    addStateTime(stateIndex, last) {
        if (last == 0) return;
        let ss = this.getSingleState(stateIndex);
        if (ss.complex) throw new AnxiError('complex state!');
        if (!ss.exist()) {
            ss.last = last;
            this.belonger.on(new ItemEvent(`getstate_${stateIndex}`));
        } else {
            ss.last += last;
        }
    }
    /**
     * simple
     */
    maxStateTime(stateIndex, last) {
        if (last == 0) return;
        let ss = this.getSingleState(stateIndex);
        if (ss.complex) throw new AnxiError('complex state!');
        if (!ss.exist()) {
            ss.last = last;
            this.belonger.on(new ItemEvent(`getstate_${stateIndex}`));
        } else {
            ss.last = Math.max(last, ss.last);
        }
    }
    /**
     * simple
     */
    setStateInfinite(stateIndex, infinite) {
        let ss = this.getSingleState(stateIndex);
        if (ss.complex) throw new AnxiError('complex state!');
        if (ss.infinite == infinite) return;
        if (infinite) {
            ss.infinite = infinite;
            if (ss.last == 0) {
                this.belonger.on(new ItemEvent(`getstate_${stateIndex}`));
            }
        } else {
            ss.infinite = infinite;
            if (ss.last == 0) {
                this.belonger.on(new ItemEvent(`loststate_${stateIndex}`));
            }
        }
    }
    /**
     * @return {number}
     * @param {StateItem} stateItem
     * complex
     */
    insertState(stateIndex, stateItem) {
        let ss = this.getSingleState(stateIndex);
        if (!ss.exist()) {
            let rs = ss.insert(stateItem);
            this.belonger.on(new ItemEvent(`getstate_${stateIndex}`));
            return rs;
        }
        return ss.insert(stateItem);
    }
    /**
     * complex
     */
    removeStateItem(stateIndex, itemId) {
        let ss = this.getSingleState(stateIndex);
        if (!ss.exist()) return;
        ss.remove(itemId);
        if (!ss.exist()) {
            this.belonger.on(new ItemEvent(`loststate_${stateIndex}`));
        }
    }
    /**
     * complex
     */
    removeAllStateItem(stateNumber) {
        let ss = this.getSingleState(stateIndex);
        if (!ss.exist()) return;
        ss.removeAll();
        this.belonger.on(new ItemEvent(`loststate_${stateIndex}`));
    }
    onTimer() {
        super.onTimer();
        let entries = Object.entries(this.states);
        let displayIndex = this.displayState.index;
        for (let d of entries) {
            /**
             * @type {SingleState}
             */
            let ss = d[1];
            if (ss.index == displayIndex) {
                ss.behaveTime++;
            } else {
                ss.behaveTime = 0;
            }
            ss.onTimer(_ => {
                this.belonger.on(new ItemEvent(`loststate_${d[0]}`));
            });
            if (ss.exist()) {
                this.belonger.on(new ItemEvent(`stating_${ss.index}`, ss));
            }
        }
    }
    refresh() {
        this.states = {};
        for (const key of StateController.baseState) {
            let value = StateCache[key];
            this.registerState(value, StateController.complexState.includes(value));
        }
        this.states[StateCache.common].infinite = true;
        this.displayState = this.states[StateCache.common];
    }
}
export class SingleState {
    index = 0
    _last = 0
    get last() {
        return this._last;
    }
    set last(value) {
        if (this.complex && this._last - 1 > value) throw new Error('unsuspect operation!');
        this._last = Math.max(value, 0);
    }
    behaveTime = 0
    timer = 0
    lastGet = -1
    lastLost = -1
    infinite = false
    complex = false
    constructor(index, last = 0, infinite = false, complex = false) {
        this.index = index;
        this.complex = complex;
        this._last = last;
        this.infinite = infinite;
    }
    exist() {
        return this.infinite || this.last > 0;
    }
    onTimer(lostHandler) {
        if (!this.exist()) return;
        this.timer++;
        this.last--;
        if (this.complex) {
            for (let index in this.items) {
                let item = this.items[index];
                if (!item) continue;
                if (item.last > 0) item.last--;
                item.timer++;
                if (item.last > 0 || item.infinite || item.destory()) continue;
                this.items[index] = undefined;
            }
        } else {

        }
        if (!this.exist()) lostHandler();
    }
    /**
     * @type {StateItem[]}
     */
    items = []
    /**
     * 新加入状态 如减速 中毒
     * @return {number}
     * @param {StateItem} item 
     */
    itemIndex = 0
    /**
     * @param {StateItem} item 
     */
    insert(item) {
        if (!this.complex) throw new Error('not complex state!');
        this.items[this.itemIndex] = item;
        if (item.last > this.last) {
            this.last = item.last;
        }
        if (item.infinite) {
            this.infinite = true;
        }
        return this.itemIndex++;
    }
    /**
     * 新加入状态 如减速 中毒
     * @return {number}
     * @param {number} itemIndex 
     */
    remove(itemIndex) {
        if (!this.complex) throw new Error('not complex state!');
        let item = this.items[itemIndex];
        if (!item) return;
        if (this.last == item.last) {
            this.last = Math.max(this.items.map(item => item?.last ?? 0));
        }
        if (this.infinite && item.infinite) {
            this.infinite = this.items.some(item => item?.infinite);
        }
        item.destory();
        this.items[itemIndex] = undefined;
    }
    removeAll() {
        if (!this.complex) throw new Error('not complex state!');
        this._last = 0;
        this.infinite = false;
        this.items.forEach(item => item?.destory());
        this.items = [];
    }
}
export class StateItem {
    last = 0
    infinite = false
    timer = 0
    constructor(last = 1, infinite = false, data = {}) {
        if (last == 0 && !infinite) throw new Error('must be useful');
        this.last = last;
        this.infinite = infinite;
        this.data = data;
    }
    disappearHandlers = []
    /**
     * @param  {...(data:{})=>void} handler 
     */
    whenDisappear(...handler) {
        this.disappearHandlers.push(...handler);
        return this;
    }
    destory() {
        this.disappearHandlers.forEach(handler => handler(this.data));
        return false;
    }
}
export const StateCache = StateController.cache;
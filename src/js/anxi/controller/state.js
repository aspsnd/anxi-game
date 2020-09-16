import { Controller } from "../controller";
import { ItemEvent } from "../event";

export class StateController extends Controller {
    static autoChangeIndex = -99999;
    static baseState = ['common', 'rest', 'go', 'run', 'jump', 'jumpSec', 'hard', 'URA', 'IME', 'drop', 'hover', 'banhover'
        , 'attack', 'poison', 'beHitBehind', 'dizzy', 'hurt', 'dead', 'slow', 'silence']
    static cache = {
        common: [-100, false],
        rest: [-99, false],
        go: [100, false],
        run: [101, false],
        jump: [200, false],
        jumpSec: [201, false],
        hard: [-200, true], //  僵直状态
        URA: [-300, true], //无双 免控
        IME: [-400, true], //无敌
        drop: [300, false],
        hover: [499, false],
        banhover: [500, false],//禁飞
        attack: [400, false],
        poison: [-402, true],//中毒
        beHitBehind: [501, false],//被击退
        dizzy: [600, true],//眩晕
        hurt: [-401, false],//重伤
        dead: [10000, false],
        slow: [this.autoChangeIndex++, true],
        silence: [this.autoChangeIndex++, false]
    }
    states = {}
    /**
     * @return {SingleState}
     * @param {number} stateIndex 
     */
    getSingleState(stateIndex) {
        return this.states[stateIndex] || this.registerState(stateIndex, Object.entries(StateAtom).find(v => v[1][0] == stateIndex)[1]);
    }
    /**
     * @type {SingleState}
     */
    displayState
    isRegistered(stateIndex) {
        return !!this.states[stateIndex];
    }
    registerState(stateNumber = -(2 << 16), complex = false) {
        if (this.states[stateNumber]) throw new Error('already registered！');
        return this.states[stateNumber] = new SingleState(stateNumber, 0, false, complex);
    }
    constructor() {
        super(...arguments);
        this.init();
    }
    init() {
        for (const key of StateController.baseState) {
            let value = StateAtom[key];
            this.registerState(value[0], value[1]);
        }
        this.displayState = this.states[StateCache.common];
        this.setStateInfinite(StateCache.common, true);
        this.belonger.on('timing', this.onTimer.bind(this));
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
    removeState(stateIndex) {
        if (!this.has(stateIndex)) return;
        let ss = this.getSingleState(stateIndex);
        ss.last = 0;
        ss.infinite = false;
        this.belonger.on(new ItemEvent(`loststate_${stateIndex}`));
    }
    /**
     * simple
     */
    setStateTime(stateIndex, last) {
        let ss = this.getSingleState(stateIndex);
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
            this.belonger.on(new ItemEvent(`getstate_${stateIndex}`));
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
        for (let d of entries) {
            /**
             * @type {SingleState}
             */
            let ss = d[1];
            ss.onTimer(_ => {
                this.belonger.on(new ItemEvent(`loststate_${d[0]}`));
            });
            if (ss.exist()) {
                this.belonger.on(new ItemEvent(`stating_${ss.index}`, ss));
            }
        }
    }
}
export class SingleState {
    index = 0
    _last = 0
    get last() {
        return this._last;
    }
    set last(value) {
        // if (this.complex) throw new Error('unsuspect operation!');
        this._last = Math.max(value, 0);
    }

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
            this.items = this.items.filter(item => {
                if (item.last > 0) item.last--;
                item.timer++;
                return item.last > 0 || item.infinite;
            })
        } else {
            
        }
        if (!this.exist()) lostHandler();
    }
    /**
     * @type {StateItem[]}
     */
    items = []
    setInfinite(infinite) {
        this.infinite = infinite;
    }
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
            this.last = Math.max(this.items.map(item => item.last));
        }
        if (this.infinite && item.infinite) {
            this.infinite = this.items.some(item => item.infinite);
        }
        delete this.items[itemIndex];
    }
    removeAll() {
        if (!this.complex) throw new Error('not complex state!');
        this.last = 0;
        this.infinite = false;
        this.items = [];
    }
}
export class StateItem {
    last = 0
    infinite = false
    timer = 0
    constructor(last = 1, infinite = false) {
        if (last == 0 && !infinite) throw new Error('must be useful');
        this.last = last;
        this.infinite = infinite;
    }
}
export const StateAtom = StateController.cache;
let _StateCache = {};
for (let key in StateAtom) {
    _StateCache[key] = StateAtom[key][0];
}
export const StateCache = _StateCache;
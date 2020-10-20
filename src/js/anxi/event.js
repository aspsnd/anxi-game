/**
 * 事件委托器
 * 事件在生命周期上有永久和关卡两种
 * 事件在触发条件上分为字符判定和函数判定
 * 事件在执行次数上分为每次触发和单次触发
 */
export class ItemEventDispatcher {
    /**
     * handler的索引
     */
    _index = 0

    commonHandlers = {}
    /**
     * @type [import("./eventName").EventComt]
     */
    complexHandlers = []

    /**
     * @return {import("./eventName").EventComt }
     * @param {import("./eventName").EventName | Function | ItemEvent} e 
     * @param {(this:ItemEventDispatcher,e:ItemEvent)=>void} handler 
     */
    on(e, handler = undefined, always = false) {
        if (handler) {
            if (typeof e != 'function') {
                return this.addCommonHandler(e, handler, always);
            } else {
                return this.addComplexHandler(e, handler, always);
            };
        } else {
            let event = (e instanceof ItemEvent) ? e : new ItemEvent(e);
            this.emit(event);
        }
    }
    /**
     * @return {import("./eventName").EventComt }
     * @param {import("./eventName").EventName | Function} e
     * @param {(this:ItemEventDispatcher,e:ItemEvent)=>void} handler 
     * @param {Boolean} always
     */
    once(e, handler, always = false) {
        if (typeof e != 'function') {
            return this.addCommonHandler(e, e => handler(e) || true, always);
        } else {
            return this.addComplexHandler(e, e => handler(e) || true, always);
        };
    }
    /**
     * @return {import("./eventName").EventComt }
     * @param {import("./eventName").EventName} type
     * @param {(this:ItemEventDispatcher,e:ItemEvent)=>void} handler 
     */
    addCommonHandler(type, handler, always = false) {
        if (!this.commonHandlers[type]) {
            this.commonHandlers[type] = [];
        }
        let comt = {
            index: this._index++,
            always: always,
            type: type,
            handler: handler,
            once: false
        };
        this.commonHandlers[type].push(comt);
        return comt;
    }
    /**
     * @return {import("./eventName").EventComt }
     */
    addComplexHandler(checker, handler, always = false) {
        let comt = {
            index: this._index++,
            always: always,
            handler: handler,
            checker: checker
        };
        this.complexHandlers.push(comt);
        return comt;
    }
    _emitingEvents = []
    /**
     * 触发一个事件
     * @param {ItemEvent} event 
     */
    emit(event) {
        this._emitingEvents.unshift(event);
        if (this.commonHandlers[event.type]) {
            let handlers = this.commonHandlers[event.type];
            // this.commonHandlers[event.type] = [];
            // for (let handler of handlers) {
            //     if (!handler.handler(event)) {
            //         this.commonHandlers[event.type].push(handler);
            //     }
            // }
            let i = 0;
            for (let handler of handlers) {
                if (!handler) continue;
                if (handler.handler(event)) {
                    handlers[i] = undefined;
                }
                i++;
            }
            handlers = handlers.filter(handler => handler);
        };
        let complexCache = this.complexHandlers;
        // this.complexHandlers = [];
        // for (let comt of complexCache) {
        //     if (comt.checker(event) && comt.handler(event)) continue;
        //     this.complexHandlers.push(comt);
        // }
        let j = 0;
        for (let handler of complexCache) {
            if (!handler) continue;
            if (handler.handler(event)) {
                handlers[j] = undefined;
            }
            j++;
        }
        complexCache = complexCache.filter(handler => handler);
        this._emitingEvents.shift();
    }
    /**
     * 清除所有非永久的handler
     */
    refreshHandler() {
        for (let en in this.commonHandlers) {
            this.commonHandlers[en] = this.commonHandlers[en].filter(comt => comt).filter(comt => comt.always);
        }
        this.complexHandlers = this.complexHandlers.filter(comt => comt.always);
    }
    /**
     * 清除所有handler
     */
    refreshAbsolute() {
        this.commonHandlers = {}
        this.complexHandlers = [];
    }
    /**
     * @param {import("./eventName").EventComt} _comt 
     */
    removeHandler(_comt) {
        if (_comt.checker) {
            this.complexHandlers = this.complexHandlers.filter(comt => comt.index != _comt.index);
        } else {
            // this.commonHandlers[_comt.type] = this.commonHandlers[_comt.type].filter(comt => comt.index != _comt.index);
            this.commonHandlers[_comt.type].splice(this.commonHandlers[_comt.type].indexOf(_comt), 1);
        }
    }
    /**
     * 
     * @param {import("./eventName").EventName} type 
     */
    removeCommonHandler(index, type = null) {
        if (type) {
            this.commonHandlers[type] = this.commonHandlers[type].filter(comt => comt.index != index);
        } else {
            for (let en in this.commonHandlers) {
                this.commonHandlers[en] = this.commonHandlers[en].filter(comt => comt.index != index);
            }
        }
    }
    removeComplexHandler(index) {
        this.complexHandlers = this.complexHandlers.filter(comt => comt.index != index);
    }
}
export class ItemEvent {
    /**
     * @type {import("./eventName").EventName}
     */
    type
    value
    from
    /**
     * 
     * @param {import("./eventName").EventName} type 
     */
    constructor(type, value, from) {
        this.type = type;
        this.value = value;
        this.from = from;
    }
}
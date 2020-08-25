export class AtomProto {
    timespeed = 1
    /**
     * @param {AtomProto} proto 
     */
    constructor(proto) {
        Object.assign(this, proto);
    }
}
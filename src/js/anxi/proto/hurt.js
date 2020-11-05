import { defaultAttackMusicUrl } from "../../sound/util";

export class HurtProto {
    /**
     * @param {HurtProto} proto 
     */
    constructor(proto) {
        Object.assign(this, proto);
    }
    crtAble = true
    dodAble = true
    sound
    hitsound
}
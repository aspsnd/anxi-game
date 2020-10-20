import { Role } from "../../../../po/atom/role";
import { MaterialKind } from "../../../define/util";
import { ThingProto } from "../base";

export class MaterialProto extends ThingProto {
    static ID = 0
    kind = MaterialKind
    constructor(id, name) {
        super(name);
        this.id = id;
        this.initDoubleUrl();
    }
    canUse = false
    setCanUse(bool) {
        this.canUse = bool;
        return this;
    }
    /**
     * @type {(role:Role)=>void}
     */
    useHandler = () => { }
    /**
     * 
     * @param {(role:Role)=>void} useHandler 
     */
    useUseHandler(useHandler) {
        this.useHandler = useHandler;
        return this;
    }
    new() {
        let base = super.new();
        base.count = 1;
        return base;
    }
    initDoubleUrl() {
        this.disUrl = `./res/util/material/${this.id}/dis.png`;
        this.dropUrl = `./res/util/material/${this.id}/drop.png`;
        return this;
    }
}
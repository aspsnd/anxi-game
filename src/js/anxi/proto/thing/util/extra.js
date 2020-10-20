import { ExtraKind } from "../../../define/util";
import { ThingProto } from "../base";

export class ExtraProto extends ThingProto {
    static ID = 0
    kind = ExtraKind
    constructor(id, name) {
        super(name);
        this.id = id;
    }

}
import { Vita } from "../../anxi/atom/vita";
import { StateCache } from "../../anxi/controller/state";
import { RoleProto } from "../../anxi/proto/role";
import { RoleProtos } from "../../data/role/all";

export class Role extends Vita {
    exp = 0
    fexp = 1
    money = 0
    /**
     * @type {{
        *      weapon,
        *      body,
        *      dcrt,
        *      wing
        * }}
        */
    equip = {
        weapon: undefined,
        body: undefined,
        dcrt: undefined,
        wing: undefined
    }
    /**
     * @type {{
     *  equip:[],
     *  material:{
     *      proto:number,
     *      count:number
     * }[],
     *  extra:[]
     * }}
     */
    bag = {
        equip: [],
        material: [],
        extra: []
    }
    maxJumpTimes = 2
    constructor(role_proto) {
        let realProto = Object.assign(role_proto, RoleProtos[role_proto.index], role_proto);
        super(realProto);
        this.initRole(role_proto);
    }
    /**
     * @param {RoleProto} role_proto 
     */
    initRole(role_proto) {
        this.index = role_proto.index;
        this.exp = role_proto.exp || this.exp;
        this.fexp = role_proto.getFexp(this.level);
        this.money = role_proto.money || this.money;
        this.bag = role_proto.bag || this.bag;
        this.equip = role_proto.equip || this.equip;
    }
    initEvent(){
        super.initEvent();
        this.on(`stating_${StateCache.common}`, e => {
            if (e.value.behaveTime >= this.proto.restInterval) {
                this.stateController.setStateTime(StateCache.rest, this.proto.restTime);
            }
        }, true);
    }
    toPlainObject() {
        return Object.assign(super.toPlainObject(), {
            index: this.index,
            exp: this.exp,
            fexp: this.fexp,
            money: this.money,
            bag: this.bag,
            equip: this.equip,
        });
    }
    refresh() {

    }
}
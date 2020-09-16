import { Vita } from "../../anxi/atom/vita";
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
    initRole(role_proto) {
        this.index = role_proto.index;
        this.exp = role_proto.exp;
        this.fexp = role_proto.fexp;
        this.money = role_proto.money;
        this.bag = role_proto.bag || this.bag;
        this.equip = role_proto.equip || this.equip;
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
    refresh(){
        
    }
}
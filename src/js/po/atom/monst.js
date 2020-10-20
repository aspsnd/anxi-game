import { Vita } from "../../anxi/atom/vita";
import { Role } from "./role";

export class Monst extends Vita {
    group = -1
    constructor(monst_proto){
        super(monst_proto);
        this.initDeadReward();
    }
    initDeadReward() {
        this.on('dead', e => {
            /**
             * @type Role
             */
            let role = e.from;
            if (role instanceof Role) {
                role && role.getEXP(this.proto.reward.exp, {
                    reason: 'kill',
                    from: this
                });
                role?.moneyController?.addMoney(this.proto.reward.money, this.x, this.centerY);
            }
            // let dropEquip = this.manager.drops.equip.some(drop => {
            //     if (Math.random() < drop[1]) {
            //         let equip = EquipProtos[drop[0]].new();
            //         new Drop(equip, 0).from(this);
            //         return true;
            //     }
            //     return false;
            // });
            // if (dropEquip) return;
            // this.manager.drops.material.find(drop => {
            //     if (Math.random() < drop[1]) {
            //         let thing = MaterialProtos[drop[0]].new();
            //         new Drop(thing, 1).from(this);
            //         return true;
            //     }
            //     return false;
            // });
        })
    }
}
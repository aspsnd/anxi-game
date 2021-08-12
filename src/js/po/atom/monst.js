import { Vita } from "../../anxi/atom/vita";
import { HPBarController } from "../../anxi/controller/hp.view";
import { ItemEvent } from "../../anxi/event";
import { EquipProtos } from "../../data/thing/equip/all";
import { ExtraProtos } from "../../data/thing/extra/all";
import { MaterialProtos } from "../../data/thing/material/all";
import { RealWorld } from "../world";
import { Drop } from "./drop";
import { Role } from "./role";

export class Monst extends Vita {
    group = -1
    constructor(monst_proto, world) {
        super(monst_proto, world);
        this.initDeadReward();
    }
    initDeadReward() {
        this.on('dead', e => {
            this.world.vitas[this.id] = null;
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
            let dropRate = this.proto.drops.rate * this.world.dropRate;
            if (dropRate > RealWorld.instance.random()) {
                let drops = Object.assign({ equip: [], material: [], extra: [] }, this.proto.drops);
                let n = drops.equip.reduce((n, e) => n + e[1], 0) +
                    drops.material.reduce((n, e) => n + e[1], 0) + drops.extra.reduce((n, e) => n + e[1], 0);
                let na = RealWorld.instance.random() * n;
                const dropEquip = drops.equip.some(v => {
                    na -= v[1];
                    if (na <= 0) {
                        let equip = EquipProtos[v[0]].new();
                        new Drop(equip).from(this);
                        return true;
                    }
                    return false;
                });
                if (dropEquip) return;
                const dropMaterial = drops.material.some(v => {
                    na -= v[1];
                    if (na <= 0) {
                        let material = MaterialProtos[v[0]].new();
                        new Drop(material).from(this);
                        return true;
                    }
                    return false;
                });
                if (dropMaterial) return;
                const dropExtra = drops.extra.some(v => {
                    na -= v[1];
                    if (na <= 0) {
                        let extra = ExtraProtos[v[0]].new();
                        new Drop(extra).from(this);
                        return true;
                    }
                    return false;
                });
                if (dropExtra) return;
                //掉落普通物品， 基本材料 或 血瓶 蓝瓶
            }
        });
    }
}
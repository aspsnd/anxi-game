import { SkillProtos } from "../../data/skill/all";
import { EquipProtos } from "../../data/thing/equip/all";
import { Role } from "../../po/atom/role";
import { Skill } from "../../po/skill";
import { by } from "../../util";
import { typicalProp } from "../atom/vita";
import { Controller } from "../controller";
import { ComtTypeName } from "../define/util";
import { AnxiError } from "../error/base";
import { EquipProto } from "../proto/thing/util/equip";

const equipName = ['weapon', 'body', 'dcrt', 'wing'];
export class EquipController extends Controller {
    /**
     * @param {Role} role 
     */
    constructor(role) {
        super(role);
        this.role = role;
        this.init();
    }
    init() {
        this.refresh();
    }
    refresh() {
        /**
         * 托管计算基础属性
         */
        typicalProp.forEach(p => {
            this.role.computeFunctions[p].push(bv => this.caculate(p, bv))
        })
        this.role.needCompute = true;
        this.role.on(`timer_${1}`, e => {
            this.reloadView();
        }, true);
    }
    caculate(prop, basevalue) {
        let evalue = 0;
        evalue += this.role.equip?.weapon?.prop[prop] ?? 0;
        evalue += this.role.equip?.body?.prop[prop] ?? 0;
        evalue += this.role.equip?.dcrt?.prop[prop] ?? 0;
        evalue += this.role.equip?.wing?.prop[prop] ?? 0;
        equipName.forEach(name => {
            if (this.role.equip?.[name]) {
                let proto = EquipProtos[this.role.equip[name].id];
                proto.extraComputeFunc[prop]?.forEach(fn => {
                    evalue += fn(basevalue, this.role);
                })
            }
        })
        return evalue;
    }
    /**
     * 穿上 不更新背包
     * @param {EquipProto} equip 
     */
    fix(equip) {
        if (!equip) throw new AnxiError('未指定装备');
        let proto = EquipProtos[equip.id];
        let name = equipName[proto.type];
        if (this.role.equip[name]) throw new AnxiError('已有装备');
        this.role.equip[name] = equip;
        if (equip.type == 0) {
            this.role.attackController.changeBullet(proto.bulletUrl);
        }
        if (equip.wingSkill >= 0) {
            this.role.wingSkill = equip.wingSkill;
            this.role.skillController.add(new Skill(SkillProtos[equip.wingSkill]).link(this.role), 1);
        }
        equip.extraSkills?.forEach(es => {
            this.role.talents.push(es);
            this.role.skillController.add(new Skill(SkillProtos[es]).link(this.role), 2);
        })
        this.role.needCompute = true;
        this.reloadView();
        return equip;
    }
    /**
     * 脱下 更新背包
     * @return {EquipData}
     * @param {0|1|2|3} type 
     */
    unfix(type) {
        if (type == 0) {
            this.role.attackController.changeBullet(this.role.proto.bulletUrl);
        }
        let name = equipName[type];
        let equip = this.role.equip[name];
        if (!equip) return;
        this.role.equip[name] = undefined;
        this.role.bag.equip.push(equip);
        if (equip.wingSkill >= 0) {
            this.role.wingSkill = 0;
            this.role.skillController.removeByIndex(equip.wingSkill);
        }
        equip.extraSkills?.forEach(es => {
            this.role.talents.splice(this.role.talents.findIndex(t => t.index == es), 1);
            this.role.skillController.removeByIndex(es);
        });
        this.role.needCompute = true;
        this.reloadView();
        return equip;
    }
    reloadView() {
        for (let comt in this.role.viewController.blocks) {
            this.role.viewController.blocks[comt].texture = by(this.role.proto.defaultView[comt]);
            this.role.viewController.blocks[comt].anchor.set(...this.role.proto.defaultViewAnchor[comt]);
        }
        for (let comt of equipName) {
            if (this.role.equip[comt]) {
                let proto = EquipProtos[this.role.equip[comt].id];
                for (let name in proto.viewRule) {
                    let value = proto.viewRule[name];
                    this.role.viewController.blocks[name].texture = by(value.url);
                    this.role.viewController.blocks[name].anchor.set(...(value.anchor ?? this.role.proto.defaultViewAnchor[name]));
                }
            }
        }
        if (this.role.equip.weapon) {
            this.role.attackController.changeBullet(EquipProtos[this.role.equip.weapon.id].bulletUrl);
        }
    }
    /**
      * 更换 不更新背包
      * @param {EquipData} equip 
      */
    change(equip) {
        let type = equip.type;
        this.unfix(type);
        this.fix(equip);
    }
}
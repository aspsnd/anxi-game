import { SkillProtos } from "../../../../data/skill/all";
import { Body, Dcrt, EquipType, Weapon, Wing } from "../../../define/util";
import { ThingProto } from "../base";

export class EquipProto extends ThingProto {
    kind = EquipKind
    static ID = 0
    /**
     * 
     * @param {string} name 
     * @param {EquipProto} options 
     */
    constructor(id, name, options) {
        super(name);
        Object.assign(this, options);
        this.id = id;
    }
    extraComputeFunc = {

    }
    /**
     * 添加特殊的计算属性 如增加 等级 * 5 的攻击力
     * @param {string} prop 
     * @param {Function} fn 
     * @deprecated
     */
    extraCompute(prop, fn) {
        if (this.extraComputeFunc[prop] == undefined) {
            this.extraComputeFunc[prop] = [];
        }
        this.extraComputeFunc[prop].push(fn);
        return this;
    }
    wingskill = null
    getWingSkill(skillIndex, rate = 1) {
        this.wingSkill = [skillIndex, rate];
        return this;
    }
    extraSkills = []
    useExtraSkill(index, rate = 1) {
        this.extraSkills.push([index, rate]);
        return this;
    }
    /**
     * 武器0 防具1 饰品2 翅膀3
     */
    type
    /**
     * 武器0 防具1 饰品2 翅膀3
     * @param {number} type 
     */
    useType(type) {
        this.type = type;
        return this;
    }
    /**
     * @type {import("./define").ThingPropDefine}
     */
    props = {}
    /**
     * @param {import('./define').ThingPropDefine} props
     */
    addProps(props) {
        Object.assign(this.props, props);
        return this;
    }
    addProp(propName, value) {
        this.props[propName] = value;
        return this;
    }
    extraIntro = []
    useExtraIntro(ei) {
        this.extraIntro.push(ei);
        return this;
    }
    initDisUrl(name) {
        this.disUrl = `./res/util/equip/${EquipType[this.type]}/0${name}.png`;
        return this;
    }
    initDropUrl(name) {
        this.dropUrl = `./res/util/equip/${EquipType[this.type]}/${name}.png`;
        return this;
    }
    initDoubleUrl(name) {
        this.disUrl = `./res/util/equip/${EquipType[this.type]}/0${name}.png`;
        this.dropUrl = `./res/util/equip/${EquipType[this.type]}/${name}.png`;
        return this;
    }
    bulletUrl
    useBullet(name) {
        this.bulletUrl = `./res/util/equip/${EquipType[this.type]}/${name}.png`;
        return this;
    }
    viewRule = {}
    /**
     * @param {number} comt 
     * @param {string} name 
     * @param {[number,number]} anchor 
     */
    useView(comt, name, anchor) {
        this.viewRule[ComtTypeName[comt]] = {
            url: `./res/util/equip/${EquipType[this.type]}/${name}.png`,
            anchor: anchor
        }
        return this;
    }
    new() {
        let base = super.new();
        Object.assign(base, {
            extraSkills: [],
            extraIntro: Array.from(this.extraIntro),
            type: this.type
        })
        for (const prop in this.props) {
            let value = this.props[prop];
            let type = typeof value;
            if (type == 'number') {
                base.prop[prop] = value;
            } else if (Array.isArray(value)) {
                if (value[1] <= 1) {
                    base.prop[prop] = Math.round(value[0] + (value[1] - value[0]) * Math.random() * 100) * 0.01;
                } else {
                    base.prop[prop] = Math.round(value[0] + (value[1] - value[0]) * Math.random());
                }
            }
        }
        if (this.wingSkill?.[1] > Math.random()) {
            base.wingSkill = this.wingSkill[0];
            let skillProto = SkillProtos[this.wingSkill[0]];
            base.extraIntro.push(`羽翼技能:${skillProto._name}`);
        }
        this.extraSkills.forEach(s => {
            if (s[1] >= Math.random()) {
                base.extraSkills.push(s[0]);
                let skillProto = SkillProtos[s[0]];
                base.extraIntro.push(`${skillProto._name}:${skillProto._describe}`);
            }
        });
        return base;
    }
    /**
     * @param {EquipProto} options 
     */
    assign(options) {
        return Object.assign(this, options);
    }
    static Weapon(id, name, options) {
        return new EquipProto(...arguments).useType(Weapon);
    }
    static Body(id, name, options) {
        return new EquipProto(...arguments).useType(Body);
    }
    static Dcrt(id, name, options) {
        return new EquipProto(...arguments).useType(Dcrt);
    }
    static Wing(id, name, options) {
        return new EquipProto(...arguments).useType(Wing);
    }
}
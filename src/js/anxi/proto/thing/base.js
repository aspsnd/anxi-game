import { Role } from "../../../po/atom/role";
import { Vita } from "../../atom/vita";
import { DefaultMoney, QualityType, ThingKind } from "../../define/util";

export class ThingProto {
    /**
     * 装备0 材料1 其他2
     */
    kind = ThingKind
    name = '???'
    id
    static _ID = 0
    _id
    constructor(name) {
        this.name = name;
        this._id = ThingProto._ID++;
    }
    intro = '————'
    useIntro(intro) {
        this.intro = intro;
        return this;
    }
    quality = QualityType.white
    UseQuality(quality) {
        this.quality = quality;
        return this;
    }
    get money() {
        return this._money ?? DefaultMoney[this.quality];
    }
    _money = null
    useMoney(money) {
        this._money = money;
        return this;
    }
    disUrl
    initDisUrl(disUrl) {
        this.disUrl = disUrl;
        return this;
    }
    dropUrl
    initDropUrl(dropUrl) {
        this.dropUrl = dropUrl;
        return this;
    }
    new() {
        return {
            id: this.id,
            kind: this.kind,
            prop: {}
        };
    }
    /**
     * @param {Vita} _ 
     */
    isSuitForVita = _ => true
    /**
     * 
     * @param {number[] | number | ((vita:Vita)=>boolean)} suitRule 
     */
    useRole(suitRule) {
        if (Array.isArray(suitRule)) {
            this.isSuitForVita = vita => vita instanceof Role && suitRule.includes(vita.proto.index);
        } else if (typeof suitRule == 'number') {
            this.isSuitForVita = vita => vita instanceof Role && suitRule == vita.proto.index;
        } else {
            this.isSuitForVita = suitRule;
        }
        return this;
    }
    /**
     * @param {ThingProto} options 
     */
    assign(options) {
        return Object.assign(this, options);
    }
}
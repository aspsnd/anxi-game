import { BodyComt, HeadComt, QualityType, WeaponComt, WingComt } from "../../../../anxi/define/util";
import { EquipProto } from "../../../../anxi/proto/thing/util/equip";

export const weapon1_1 = EquipProto.Weapon(0, '普通的一把剑').useRole(0)
    .addProp('atk', [3, 5]).useView(WeaponComt, 1, [2 / 3, 1 / 6]).initDoubleUrl(1)
    .UseQuality(QualityType.white).useIntro('看起来像是在路边捡的');

export const body1_1 = EquipProto.Body(1, '普通的铠甲', {
    props: {
        def: [1, 3]
    },
    intro: '看起来也是捡的',
}).useRole(0).initDoubleUrl(1).useView(BodyComt, 1, [0.5, 0.5]);

export const weapon2_1 = EquipProto.Weapon(2, '普通的弓箭', {
    intro: '一件多么失败的艺术品',
    props: {
        atk: [4, 6]
    }
}).useRole(1).initDoubleUrl(4).useBullet('4/0').useView(WeaponComt, 4, [-0.4, 0.5]);

export const body2_1 = EquipProto.Body(3, '普通的盾甲', {
    intro: '有股垃圾桶的怪味儿~',
    props: {
        def: [1, 2]
    }
}).useRole(1).initDoubleUrl(3).useView(BodyComt, 3, [0.45, 0.55]);

export const weapon1_2 = EquipProto.Weapon(4, '地心锤', {
    props: {
        atk: [12, 20]
    },
    quality: QualityType.green,
    intro: '凝聚地球浩荡之力'
}).useRole(0).initDoubleUrl(2).useView(WeaponComt, 2, [2 / 3, 1 / 6]);

export const weapon2_2 = EquipProto.Weapon(5, '镇灵弓', {
    quality: QualityType.green,
    props: {
        atk: [12, 20]
    },
    intro: '守护一切生灵之物'
}).useRole(1).initDoubleUrl(3).useView(WeaponComt, 3, [-0.3, 0.5]).useBullet('3/0');

export const body1_2 = EquipProto.Body(6, '荡金甲', {
    quality: QualityType.green,
    props: {
        def: [3, 5],
        hp: [70, 100],
        mp: [70, 100]
    },
    intro: '金星压芒角,银汉转波澜'
}).useRole(0).initDoubleUrl(2).useView(BodyComt, '2/2', [0.5, 0.5]).useView(HeadComt, '2/1', [0.54, 0.72]);

export const body2_2 = EquipProto.Body(7, '归魂袍', {
    quality: QualityType.green,
    props: {
        def: [3, 4],
        hp: [50, 80],
        mp: [80, 120]
    },
    intro: '作别奈何桥，又闻何生语'
}).useRole(1).initDoubleUrl(4).useView(BodyComt, '4/2', [0.45, 0.5]).useView(HeadComt, '4/1', [0.45, 0.75]);

export const dcrt1 = EquipProto.Dcrt(8, '蜷星眼', {
    quality: QualityType.green,
    props: {
        atk: [10, 18],
        def: [4, 6],
        crt: 0.03
    },
    intro: '诸星蜷落,噩梦是劫'
}).initDoubleUrl(1);

export const wing1 = EquipProto.Wing(9, '编制噩梦之翼', {
    quality: QualityType.green,
    props: {
        hp: [95, 125],
        mp: [45, 65],
        atk: [10, 15],
        def: [5, 8],
        mpr: 1
    },
    intro: '厄夜侵寒时,忽见鬼厉行'
}).initDoubleUrl(1).useView(WingComt, 1, [1, 0.5]).getWingSkill(9, 1);
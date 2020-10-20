// import { ThingProto } from "./base";
import { Sprite } from "pixi.js";
import { by } from "../../util";

export const ThingKind = -1
export const EquipKind = 0
export const MaterialKind = 1
export const ExtraKind = 2
export const QualityText = ['普通', '优秀', '精良', '史诗', '传说', '远古'];
export const QualityColor = ['#ffffff', '#00ff51', '#0051ff', '#660098', '#ff6600', '#ff00ff'];
export const QualityType = {
    white: 0,
    green: 1,
    blue: 2,
    purple: 3,
    yellow: 4,
    flash: 5
}
export const DefaultMoney = [10, 30, 80, 400, 1800, 99999];
export const EquipTypeIntro = {
    weapon: '武器',
    body: '防具',
    dcrt: '能核',
    wing: '翅膀'
}
export const EquipType = ['weapon', 'body', 'dcrt', 'wing'];
export const ComtTypeName = ['head', 'body', 'hand_l', 'hand_r', 'leg_l', 'leg_r', 'weapon', 'wing'];
export const Weapon = 0;
export const Body = 1;
export const Dcrt = 2;
export const Wing = 3;
export const HeadComt = 0;
export const BodyComt = 1;
export const Hand_lComt = 2;
export const Hand_rCont = 3;
export const Leg_lComt = 4;
export const Leg_rComt = 5;
export const WeaponComt = 6;
export const WingComt = 7;
export const ThingType = ['equip', 'material', 'extra'];
export const PropText = {
    atk: '攻击',
    def: '防御',
    hp: '生命',
    mp: '魔法',
    crt: '暴击',
    dod: '闪避',
    hpr: '回血',
    mpr: '回魔',
    weapon: '武器',
    body: '铠甲',
    dcrt: '能核',
    wing: '羽翼'
}
/**
 * @param {ThingProto} proto 
 */
export function getSprite(proto) {
    return new Sprite(by(proto.disUrl));
}
/**
 * @type {ThingProto[][]}
 */
export const ThingProtoProtos = [];
export function getSpriteFromThing(thing) {
    return new Sprite(by(ThingProtoProtos[thing.kind][thing.id].disUrl));
}
export function getDisUrl(thing) {
    return ThingProtoProtos[thing.kind][thing.id].disUrl;
}
export function getDropUrl(thing) {
    return ThingProtoProtos[thing.kind][thing.id].dropUrl;
}
export function getProto(thing) {
    return ThingProtoProtos[thing.kind][thing.id];
}
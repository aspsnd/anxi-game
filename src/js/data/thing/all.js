import { Sprite } from "pixi.js";
import { ThingProto } from "../../anxi/proto/thing/base";
import { by } from "../../util";
import { EquipProtos } from "./equip/all";
import { ExtraProtos } from "./extra/all";
import { MaterialProtos } from "./material/all";

export const ThingsProtos = [
    EquipProtos,
    MaterialProtos,
    ExtraProtos
]
/**
 * @param {ThingProto} proto 
 */
export function getSprite(proto) {
    return new Sprite(by(proto.disUrl));
}
/**
 * @type {ThingProto[][]}
 */
export function getSpriteFromThing(thing) {
    return new Sprite(by(ThingsProtos[thing.kind][thing.id].disUrl));
}
export function getDisUrl(thing) {
    return ThingsProtos[thing.kind][thing.id].disUrl;
}
export function getDropUrl(thing) {
    return ThingsProtos[thing.kind][thing.id].dropUrl;
}
export function getProto(thing) {
    return ThingsProtos[thing.kind][thing.id];
}
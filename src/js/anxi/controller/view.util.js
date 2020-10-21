import { TextStyle } from "pixi.js";

export const lostHpStyle = new TextStyle({
    stroke: 0xffffff,
    strokeThickness: 2,
    fill: [0xff0000, 0xffae20],
    fontSize: 24,
    fontWeight: 'bold',
    dropShadow: true,
    dropShadowColor: 0x00000,
    dropShadowDistance: 0,
    dropShadowBlur: 5,
})
export const commonEnglishStyle = new TextStyle({
    stroke: 0xffffff,
    strokeThickness: 2,
    fill: [0xff0000, 0xffae20],
    fontSize: 16,
    fontWeight: 'bold',
    dropShadow: true,
    dropShadowColor: 0x00000,
    dropShadowDistance: 0,
    dropShadowBlur: 5,
})
export const NameStyle = new TextStyle({
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: 'bold',
    dropShadow: true,
    dropShadowBlur: 5,
    dropShadowDistance: 0,
    dropShadowAlpha: 1,
    dropShadowColor: 0x000000
});
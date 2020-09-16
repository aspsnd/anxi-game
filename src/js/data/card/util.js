const base = './res/util/map/';
const baseScene = './res/util/scene/';
export function getUrls(index) {
    return [
        `${base}${index + 1}.png`,
        `${base}${index + 1}h.png`,
        `${base}${index + 1}h.png`
    ]
}
export function getBack(index) {
    return `${baseScene}back/${index}.png`;
}
export function getGround(index) {
    return `${baseScene}ground/${index}.png`;
}
import { getUrls, getBack, getGround } from "../util";
export default {
    name: '月球',
    index: 1,
    card: getUrls(1),
    position: [350, 240],
    crossOpen: [],
    back: getBack(2),
    ground: 1,
    step: 0,
    walls: [],
    monsts: [],
    limits: [[0, 960]],
    boss: [
        [6, 120, 600, -1]
    ],
}
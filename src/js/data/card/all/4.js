import { getBack, getUrls } from "../util"

export default {
    name: '火星',
    index: 4,
    card: getUrls(4),
    position: [265, 355],
    crossOpen: [5],
    back: getBack(5),
    ground: 6,
    walls: [],
    boss: [
        [7, 120, 600, -1],
    ],
    monsts: [
        [[5, 1, 20, 860, -1]],
        [[5, 1, 20, 860, -1]],
        [[5, 1, 20, 860, -1]],
        [[5, 1, 20, 860, -1]],
    ]
}
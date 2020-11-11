import { getUrls, getBack } from "../util"

export default {
    name: '木星',
    index: 5,
    card: getUrls(5),
    position: [375, 455],
    crossOpen: [6],
    back: getBack(6),
    ground: 7,
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
import { getUrls, getBack } from "../util"

export default {
    name: '土星',
    index: 6,
    card: getUrls(6),
    position: [650, 325],
    crossOpen: [7, 8],
    back: getBack(7),
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
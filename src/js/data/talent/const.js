import { TalentProtos } from "./all"

export const TalentTree = [
    {
        name: '神躯',
        super: [0, 1],
        common: [
            [10, 11, 12],
            [13, 14, 15]
        ]
    },
    {
        name: '天劫',
        super: [2, 3],
        common: [
            [16, 17, 18],
            [19, 20, 21]
        ]
    },
    {
        name: '暗裔',
        super: [4, 5],
        common: [
            [22, 23, 24],
            [25, 26, 27]
        ]
    },
    {
        name: '扩张',
        super: [6, 7],
        common: [
            [28, 29, 30],
            [32, 33]
        ]
    },
    {
        name: '时间',
        super: [8, 9],
        common: [
            [34, 35],
            [36, 37]
        ]
    }
]
export const SuperTalentIndexs = TalentTree.map(n => n.super).reduce((p, c) => ((void p.push(...c)) || p), []);
export const findBranchIndex = talentIndex => TalentTree.findIndex(tnode => tnode.super.includes(talentIndex) || tnode.common.some(c => c.includes(talentIndex)));
export const FairArray = TalentTree.map(n => [n.super, ...n.common]).reduce((p, v) => (void p.push(...v)) || p, []);
export const findFairArray = talentIndex => FairArray.find(a => a.includes(talentIndex));
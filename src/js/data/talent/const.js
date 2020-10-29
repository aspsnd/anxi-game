import { TalentProtos } from "./all"

export const TalentTree = [
    {
        name: '神躯',
        super: [0, 1],
        common: []
    },
    {
        name: '天劫',
        super: [2, 3],
        common: []
    },
    {
        name: '暗裔',
        super: [4, 5],
        common: []
    },
    {
        name: '扩张',
        super: [6, 7],
        common: []
    },
    {
        name: '时间',
        super: [8, 9],
        common: []
    }
]
export const SuperTalentIndexs = TalentTree.map(n => n.super).reduce((p, c) => ((void p.push(...c)) || p), []);
export const findBranchIndex = talentIndex => TalentTree.findIndex(tnode => tnode.super.includes(talentIndex) || tnode.common.includes(talentIndex));
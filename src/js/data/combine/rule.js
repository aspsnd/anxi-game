import { ThingProto } from "../../anxi/proto/thing/base"
import { body1_2, body2_2, dcrt1, weapon1_2, weapon2_2, wing1 } from "../thing/equip/data/0"
import { wing1base } from "../thing/material/data/0"

/**
 * @type {{
 *     thing:[number,number,number][] | ((things:number[])=>boolean),
 *     product:ThingProto
 * }[]}
 */
export const CombineRules = [
    {
        thing: [
            [weapon1_2._id, dcrt1._id, wing1base._id].sort(),
            [weapon2_2._id, dcrt1._id, wing1base._id].sort(),
            [body1_2._id, dcrt1._id, wing1base._id].sort(),
            [body2_2._id, dcrt1._id, wing1base._id].sort(),
        ],
        product: wing1
    }
]

import { AttackProto } from "../../anxi/proto/attack";

const _AttackProtos = [];
let files = require.context('./data', true, /\.js$/);
files.keys().forEach(key => {
    let data = files(key).default;
    _AttackProtos[data.index] = data;
})
/**
 * @type {AttackProto[]}
 */
export const AttackProtos = _AttackProtos;
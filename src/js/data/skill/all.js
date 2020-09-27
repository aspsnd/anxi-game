import { SkillProto } from "../../anxi/proto/skill";

const _SkillProtos = [];
let files = require.context('./data', false, /\.js$/);
files.keys().forEach(key => {
    let data = files(key).default;
    _SkillProtos[data.index] = data;
})
/**
 * @type {SkillProto[]}
 */
export const SkillProtos = _SkillProtos;
import { SkillProto } from "../../anxi/proto/skill";

const protos = [];
let files = require.context('./data', true, /\.js$/);
files.keys().forEach(key => {
    let data = files(key).default;
    protos[data.index] = data;
})
/**
 * @type {SkillProto[]}
 */
export const TalentProtos = protos;
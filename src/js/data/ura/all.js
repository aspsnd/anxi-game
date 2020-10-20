import { URAProto } from "../../anxi/proto/ura";

const protos = [];
let files = require.context('./data', true, /\.js$/);
files.keys().forEach(key => {
    let data = files(key);
    Object.values(data).forEach(data=>{
        protos[data.index] = data;
    });
})
/**
 * @type {URAProto[]}
 */
export const URAProtos = protos;
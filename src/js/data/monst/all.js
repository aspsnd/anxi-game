const _MonstProtos = [];
let files = require.context('./data', false, /\.js$/);
files.keys().forEach(key => {
    let data = files(key).default;
    _MonstProtos[data.index] = data;
})
export const MonstProtos = _MonstProtos;
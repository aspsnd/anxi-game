const _RoleProtos = [];
let files = require.context('./data', false, /\.js$/);
files.keys().forEach(key => {
    let data = files(key).default;
    _RoleProtos[data.index] = data;
})
export const RoleProtos = _RoleProtos;
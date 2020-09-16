const _WallProtos = [];
let files = require.context('./all', false, /\.js$/);
files.keys().forEach(key => {
    let data = files(key);
    Object.values(data).forEach(data=>{
        _WallProtos[data.index] = data;
    });
})
export const WallProtos = _WallProtos;
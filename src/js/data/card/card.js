const cardDatas = [];
const files = require.context('./all', false, /.js/);
files.keys().forEach(key => {
    let data = files(key).default;
    cardDatas[data.index] = data;
})
export { cardDatas };
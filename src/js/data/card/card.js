/**
 * @type {import("../../anxi/define/type").CardData[]}
 */
let cardDatas = [];
const files = require.context('./all', false, /.js/);
files.keys().forEach(key => {
    let data = files(key).default;
    cardDatas[data.index] = data;
})
// cardDatas = cardDatas.filter((v, i) => i <= 3);
export { cardDatas };
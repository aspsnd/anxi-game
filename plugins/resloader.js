const { getRes } = require("../src/init");

module.exports = function (source) {
    let res = getRes();
    console.log(res, res.length)
    return res;
}
// const { Plugin } = require("webpack");

const initer = require("../src/init");


function ResPlugin() {

}
ResPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit',function(compilation , callback){
        console.log(compiler)
        callback();
    })
}
module.exports = { ResPlugin }
// const { Plugin } = require("webpack");

const { Compiler } = require("webpack");
const initer = require("../src/init");
const fs = require('fs');
const path = require('path');

class ResPlugin {
    constructor(options) {

    }
    len = 0
    /**
     * @param {Compiler} compiler 
     */
    apply(compiler) {
        compiler.hooks.compilation.tap('ResPlugin', (compilation, callback) => {
            let jss = initer.getRes();
            let lens = jss.length;
            if (lens != this.len) {
                this.len = lens;
                fs.writeFileSync(path.resolve(__dirname, '../src/res.js'), jss);
            }
        })
    }
}
module.exports = { ResPlugin }

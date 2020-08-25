// 初始化需要加载的所有资源生成一个js文件，导出数组
var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve(__dirname, './res');
var resjs = './src/res.js';
let res = [];
let ressound = [];
//文件遍历方法
//调用文件遍历方法
fileDisplay(filePath);
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    let files = fs.readdirSync(filePath);
    //遍历读取到的文件列表
    files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        let stats = fs.statSync(filedir)
        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if (isFile && filename.endsWith('.png')) {
            var p = '.' + filedir.split('src')[1].replace(/\\/g, '/');
            res.push(p);
        }
        if (isFile && (filename.endsWith('.mp3') || filename.endsWith('.wav'))) {
            var p = '.' + filedir.split('src')[1].replace(/\\/g, '/');
            ressound.push(p);
        }
        if (isDir) {
            if (filename == 're' || filename.startsWith('_')) {
                console.log('filter : ' + filedir)
            } else {
                fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
        }
    });
}
fs.writeFileSync(resjs, `export const res = ${JSON.stringify(res, null, 4)};
export const ressound = ${JSON.stringify(ressound, null, 4)}`);
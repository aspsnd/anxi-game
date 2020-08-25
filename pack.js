var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var filePath = path.resolve(__dirname, './build/res');
fileDisplay(filePath)
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
        // if (isFile && filename.endsWith('.png')) {
        //     var p = '.' + filedir.substring(29).replace(/\\/g, '/');
        //     res.push(p);
        // }
        // if (isFile && (filename.endsWith('.mp3') || filename.endsWith('.wav'))) {
        //     var p = '.' + filedir.substring(29).replace(/\\/g, '/');
        //     ressound.push(p);
        // }
        if (isDir) {
            if (filename == 're') {
                deleteFolder(filedir);
            } else {
                fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
        }
    });
}

function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
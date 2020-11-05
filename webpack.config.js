const path = require('path');
const html_plugin = require('html-webpack-plugin');
const minicss = require('mini-css-extract-plugin');
const copy_plugin = require('copy-webpack-plugin');
const { ResPlugin } = require('./plugins/resBuild');
module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: path.join(__dirname, 'src', 'index.js'),
  // watch: true,
  output: {
    path: path.join(__dirname, 'build'),
    filename: "js/build.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ]
  },
  resolveLoader: {
    modules: ['node_modules', './plugins/'],
  },
  plugins: [
    new html_plugin({
      template: './src/index.html'
    }),
    new minicss({
      filename: 'css/build.css'
    }),
    new copy_plugin({
      patterns: [
        {
          from: './src/libs',
          to: 'libs',
        }, {
          from: './src/res',
          to: 'res',
          globOptions:{
            ignore:[
              '**/re/**'
            ]
          }
        }, {
          from: './src/css',
          to: 'css'
        }
      ],
    }),
    new ResPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8080,
    open: true,
  },
  // devtool: 'source-map'
};
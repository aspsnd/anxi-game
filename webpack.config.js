const path = require('path');
const html_plugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const webpack = require('webpack');
const minicss = require('mini-css-extract-plugin');
const copy_plugin = require('copy-webpack-plugin');
module.exports = {
  // mode: 'production',
  mode: 'development',
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
      }
    ]
  },
  plugins: [
    // new OpenBrowserPlugin({
    //   url:'http://localhost:8080',
    //   delay:1000 * 12
    // }),
    new html_plugin({
      template: './src/index.html'
    }),
    new minicss({
      filename: 'css/build.css'
    }),
    new copy_plugin([
      {
        from: './src/libs',
        to: 'libs',
        // ignore: ['*.js']
      }, {
        from: './src/res',
        to: 'res',
      }, {
        from: './src/css',
        to: 'css'
      }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 8080,
    open: true,

  },
  devtool:'source-map'
};
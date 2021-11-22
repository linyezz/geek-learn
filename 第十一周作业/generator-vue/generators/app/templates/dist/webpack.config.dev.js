"use strict";

var path = require("path");

var _require = require("vue-loader"),
    VueLoaderPlugin = _require.VueLoaderPlugin;

var CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {},
  module: {
    rules: [{
      test: /\.vue$/,
      use: "vue-loader"
    }, {
      test: /\.css$/,
      use: ["vue-style-loader", "css-loader"]
    }]
  },
  plugins: [new VueLoaderPlugin(), new CopyPlugin({
    patterns: [{
      from: "src/*.html",
      to: "[name].[ext]"
    }]
  })]
};
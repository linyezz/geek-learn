"use strict";

var path = require('path');

module.exports = {
  entry: './main.js',
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [["@babel/plugin-transform-react-jsx", {
            pragma: "creatElement"
          }]]
        }
      }
    }]
  },
  mode: "development"
};
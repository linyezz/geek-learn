const path = require('path');
module.exports = {
  entry: './main.js',
  module:{
    rules:[
      {
        test:/\.js$/,
        use:{
          loader:"babel-loader",
          options:{
            presets:["@babel/preset-env"],
            plugins:[["@babel/plugin-transform-react-jsx",{pragma:"creatElement"}]]
          }
        }
      }
    ]
  },
  devServer:{
    port:8088,
    // contentBase:'www'
    compress:true,
    static:{
      directory:path.join(__dirname,"dist")
    }
  },
  mode:"development"
}
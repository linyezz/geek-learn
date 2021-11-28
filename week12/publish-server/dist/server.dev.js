"use strict";

var http = require("http");

var fs = require("fs");

var https = require("https");

var unzipper = require('unzipper');

var querystring = require("querystring"); //2 auth 路由 接受code 用code + client_id + client_secret换token


function auth(req, res) {
  var query = querystring.parse(req.url.match(/^\/auth\?(\s\S]+)$/)[1]);
  getToken(query.code, function (info) {
    //res.write(JSON.stringify(info));
    res.write("<a href='http://127.0.0.1:8083/?token=".concat(info.access_token, "'>publish</a>"));
    res.end();
  });
}

function getToken(code, callback) {
  var request = https.request({
    hostname: "github.com",
    path: "/login/oauth/access_token?code=".concat(code, "&client_id=Iv1.8bb87c84dce59c66&client_secret=6fa784596b251fd1dd525978c6d0526cc7898567"),
    port: 443,
    method: "POST"
  }, function (response) {
    var body = "";
    response.on('data', function (chuck) {
      body += chuck.toString();
    });
    response.on('end', function (chuck) {
      callback(querystring.parse(body));
    });
  });
  request.end();
} //4 用token获取用户信息，鉴权 接受发布


function publish(req, res) {
  var query = querystring.parse(req.url.match(/^\/publish\?(\s\S]+)$/)[1]);
  getUser(query.token, function (info) {
    if (info.login === "linyezz") {
      req.pipe(unzipper.Extract({
        path: '../server/public/'
      }));
      req.on('end', function () {
        res.end("success");
      });
    }
  });
}

function getUser(token, callback) {
  var request = https.request({
    hostname: "api.github.com",
    path: "/user",
    port: 443,
    method: "GET",
    headers: {
      Authorization: "token ".concat(token),
      "User-Agent": ' toylinye-publish'
    }
  }, function (response) {
    var body = "";
    response.on('data', function (chuck) {
      body += chuck.toString();
    });
    response.on('end', function (chuck) {
      callback(JSON.stringify(body));
    });
  });
  request.end();
}

http.createServer(function (req, res) {
  if (req.url.match(/^\/auth\?/)) {
    return auth(req, res);
  }

  if (req.url.match(/^\/publish\?/)) {
    return publish(req, res);
  }
}).listen(8082); // http.createServer(function(req,res){
//   // let outFile = fs.createWriteStream("../server/public/tmp.zip")
//   // req.pipe(outFile)
//   req.pipe(unzipper.Extract({path:'../server/public'}))
//   // req.on('data',chunk=>{
//   //   outFile.write(chunk)
//   // })
//   // req.on('end',chunk=>{
//   //   outFile.end();
//   //   res.end("success");
//   // })
//   console.log(req);
// }).listen(8082)
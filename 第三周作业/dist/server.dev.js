"use strict";

var http = require('http');

http.createServer(function (request, response) {
  var body = [];
  request.on('error', function (error) {
    console.error(error);
  }).on('data', function (chunk) {
    body.push(chunk.toString()); // body.push(chunk);
  }).on('end', function () {
    // body = Buffer.concat(body).toString();
    body = Buffer.concat([Buffer.from(body.toString())]).toString();
    console.log(body);
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.end("<html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\" />\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <style>\n          #myid {\n            width: 500px;\n            height: 300px;\n            background-color: rgb(255,255,255);\n            display: flex;\n          }\n          .myid1 {\n            width: 200px;\n            height: 100px;\n            background-color: rgb(255,0,0);\n          }\n          .myid2 {\n            flex: 1;\n            background-color: rgb(0,255,0);\n          }\n          body{\n            background-color: rgb(0,0,0);\n          }\n        </style>\n        <title>Document</title>\n      </head>\n      <body>\n        <div id='myid'>\n          <div class=\"myid1\"></div>\n          <div class=\"myid2\"></div>\n        </div>\n      </body>\n      </html>");
  });
}).listen(8088);
console.log('server start on 8088');
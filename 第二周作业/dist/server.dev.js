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
    response.end("<html maaa=a>\n      <head>\n        <style>\n          body div #myid{\n            width: 100px;\n          }\n          body div img{\n            width: 30px;\n            background-color: #ff1111;\n          }\n        </style>\n      </head>\n      <body>\n        <div>\n          <img id=\"myid\"> </img>\n          <img />\n        </div>\n      </body>\n    </html>");
  });
}).listen(8088);
console.log('server start on 8088');
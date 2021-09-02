"use strict";

var http = require('http');

http.createServer(function (request, response) {
  var body = [];
  request.on('error', function (error) {
    console.error(error);
  }).on('data', function (chunk) {
    body.push(chunk.toString());
  }).on('end', function () {
    body = Buffer.concat(body).toString();
    console.log(body);
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.end('Hello Word\n');
  });
}).listen(8088);
console.log('server start on 8088');
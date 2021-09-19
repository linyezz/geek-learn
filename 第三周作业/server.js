const http = require('http')

http.createServer((request,response)=>{
  let body = [];
  request.on('error',(error)=>{
    console.error(error)
  }).on('data',(chunk)=>{
    body.push(chunk.toString());
    // body.push(chunk);
  }).on('end',()=>{
    // body = Buffer.concat(body).toString();
    body = (Buffer.concat([Buffer.from(body.toString())])).toString();
    console.log(body);
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end(
      `<html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          #myid {
            width: 500px;
            height: 300px;
            background-color: rgb(255,255,255);
            display: flex;
          }
          .myid1 {
            width: 200px;
            height: 100px;
            background-color: rgb(255,0,0);
          }
          .myid2 {
            flex: 1;
            background-color: rgb(0,255,0);
          }
          body{
            background-color: rgb(0,0,0);
          }
        </style>
        <title>Document</title>
      </head>
      <body>
        <div id='myid'>
          <div class="myid1"></div>
          <div class="myid2"></div>
        </div>
      </body>
      </html>`
    )
  })
}).listen(8088);

console.log('server start on 8088')

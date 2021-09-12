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
      `<html maaa=a>
      <head>
        <style>
          body div #myid{
            width: 100px;
          }
          body div img{
            width: 30px;
            background-color: #ff1111;
          }
        </style>
      </head>
      <body>
        <div>
          <img id="myid"> </img>
          <img />
        </div>
      </body>
    </html>`
    )
  })
}).listen(8088);

console.log('server start on 8088')

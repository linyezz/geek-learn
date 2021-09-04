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
    response.end(' Hello Word\n')
  })
}).listen(8088);

console.log('server start on 8088')

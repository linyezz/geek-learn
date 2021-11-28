let http = require("http");
let fs = require("fs");
let archiver = require('archiver')
let child_process = require("child_process");
let querystring = require("querystring");

//认证说明https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps
// 打开https://github.com/login/oauth/authorsize
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.8bb87c84dce59c66`);
// 创建server 接受token 点击发布

http.createServer(function (req, res) {
    let query = querystring.parse(req.url.match(/^\/\?(\s\S]+)$/)[1]);
    publish(query.token)
  }).listen(8083);

  function publish(token){
    let request = http.request(
      {
        hostname: "127.0.0.1",
        port: 8082,
        method: "POST",
        path: "/publish?token="+token,
        headers: {
          "Content-Type": "application/octet-stream"
        },
      },
      (response) => {
        console.log(response);
      }
    );
}


// let request = http.request({
//       hostname:'127.0.0.1',
//       port:8082,
//       method:"POST",
//       headers: {
//         'Content-Type': 'application/octet-stream',
//       }
//     },response=>{
//       console.log(response)
//     })
const archive = archiver('zip',{
  zlib:{ level:9}
})
archive.directory('./sample/',false);
// archive.pipe(fs.createWriteStream("tmp.zip"))
archive.pipe(request)
archive.finalize()
// fs.stat("./sample.html",(err,stats)=>{
//   let request = http.request({
//     hostname:'127.0.0.1',
//     port:8082,
//     method:"POST",
//     headers: {
//       'Content-Type': 'application/octet-stream',
//       "Content-Length":stats.size
//     }
//   },response=>{
//     console.log(response)
//   })
//   let file = fs.createReadStream("./sample.html");
//   file.pipe(request)
//   // file.on('data',chunk => {
//   //   request.write(chunk);
//   // })
  
//   file.on('end',chunk=>{
//     request.end(chunk)
  
//   })
// })


// request.end()
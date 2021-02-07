// const db = require('../db')
const Router = require('koa-router')
const common = require('../utils/common')
const files = new Router()
const fs = require('fs');
const path = require('path');

files.post('/upload', (ctx, next) => {
    const files = ctx.request.files;
    const keys = Object.keys(files);
    keys.forEach(item => {
        const file = files[item];
        // 读取文件流
        const fileReader = fs.createReadStream(file.path);
        const filePath = path.join(__dirname, '../files/');
        // 组装成绝对路径
        const fileResource = filePath + `${file.name}`;
        // 使用 createWriteStream 写入数据，然后使用管道流pipe拼接
        console.log(filePath, fileResource)
        const writeStream = fs.createWriteStream(fileResource);
        // 判断  文件夹是否存在，如果不在的话就创建一个
        if (!fs.existsSync(filePath)) {
            fs.mkdir(filePath, (err) => {
                if (err) {
                    throw new Error(err);
                } else {
                    fileReader.pipe(writeStream);
                    ctx.body = common.apiTemplate({}, '上传1成功');
                }
            });
        } else {

            fileReader.pipe(writeStream);
            ctx.body = common.apiTemplate({}, '上传2成功');
        }
    })
})

files.get('/download', (ctx, next) => {
    const filePath = path.join(__dirname, '../files/file.doc');

    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set('Content-Disposition', 'attachment; filename=' + 'aa.doc');
  
    ctx.body  = fs.createReadStream(filePath)


})


/* 
async downloaddb(ctx) {
  // 获取下载文件的名称
    let filename = ctx.request.query.file;
    // 获取下载文件路径
    var filePath = getBackupsPath(filename);
    var stats = fs.statSync(filePath);
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.set('Content-Disposition', 'attachment; filename=' + filename);
    ctx.set('Content-Length', stats.size);
    return ctx.body = fs.createReadStream(filePath);
  }


*/


module.exports = files


/*
自己坑自己 写错url了



const uploadUrl = "http://localhost:3001/static/upload";
// 上传文件
router.post('/upload', (ctx) => {

  const file = ctx.request.files.file;
  // 读取文件流
  const fileReader = fs.createReadStream(file.path);

  const filePath = path.join(__dirname, '/static/upload/');
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;


  // 使用 createWriteStream 写入数据，然后使用管道流pipe拼接

 const writeStream = fs.createWriteStream(fileResource);
 // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
 if (!fs.existsSync(filePath)) {
   fs.mkdir(filePath, (err) => {
     if (err) {
       throw new Error(err);
     } else {
       fileReader.pipe(writeStream);
       ctx.body = {
         url: uploadUrl + `/${file.name}`,
         code: 0,
         message: '上传成功'
       };
     }
   });
 } else {
   fileReader.pipe(writeStream);
   ctx.body = {
     url: uploadUrl + `/${file.name}`,
     code: 0,
     message: '上传成功'
   };
 }
});


*/


/*
写入文件也可以这样
// fileReader.on("data",function(data){
//     writeStream.write(data)
// })
// writeStream.on('open',function(){
//     console.log("准备写入文件流")
// })
// fileReader.on( "end", function () {
//     writeStream.end( "bai", function () {
//         console.log( "文件全部写入完毕" );
//         console.log( "共写入%d字节数据", out.bytesWritten );
//     } )
// } )

*/


















/*
const Koa = require('koa');
const app = new Koa();
// request.method可以获取请求方法。get，post或者其他类型(request对象被封在ctx内，所以也可以ctx.method获取)
app.use(async(ctx)=>{
 if (ctx.url === '/' &&ctx.method === 'POST'){
        let postdata = await parsePostData(ctx)
        ctx.body = postdata
    }else {
        // 其他请求显示404
        ctx.body = '<h1>404!</h1>'
    }
})

// 将post请求参数拼接成一个字符串
function parsePostData(ctx){
    return new Promise((resolve,reject)=>{
        try{
            let postdata = ''
            // 请求流传送时触发
            ctx.req.on('data',(data)=>{
                postdata+=data
            })
            // 请求结束时触发
            ctx.req.addListener('end',()=>{
                let postData = parseQueryStr(postdata)
                return resolve(postData)
            })
        }catch(error){
            reject(error)
        }
    })
}

// 字符串封装成JSON对象
function parseQueryStr(queryStr){
    let queryData = {}
    let queryList = queryStr.split('&')
    console.log(queryList)
    for ( let [index,item] of queryList.entries()){
        let itemlist = item.split('=')
        console.log(itemlist)
        // 向queryData对象内添加键值对
        // decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
        queryData[itemlist[0]] = decodeURIComponent(itemlist[1])
    }
    return queryData
}

app.listen(3000,()=>{
    console.log('server starting at localhost:3000')
})



*/
const fs = require('fs')
const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
app.use(cors());
var Router = require('koa-router');
var router = new Router();
// const bodyParser = require('koa-bodyparser')
// app.use(bodyParser());
const koaBody = require('koa-body');
app.use(koaBody(
  {
    multipart: true, // 支持文件上传
    // formidable: {
    //   maxFieldsSize: 2 * 1024 * 1024, // 最大文件为2兆
    //   multipart: true // 是否支持 multipart-formdate 的表单
    // }
  }
))


// 一般路由会有一个公共前缀
router.prefix('/api')

let apis = fs.readdirSync(__dirname + '/apis')
console.log(apis)

apis.forEach((element) => {
 let module = require(__dirname + '/apis/' + element)
 router.use('/' + element.replace('.js', ''), module.routes())
})


app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000);
console.log("listen:3000")
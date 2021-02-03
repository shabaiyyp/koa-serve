// const db = require('../db')
const Router = require('koa-router')
const common = require('../utils/common')
const test = new Router()

test.post('/getparams',  (ctx, next) => {
    const params = ctx.request.body;
    console.log(params);
    ctx.body = common.apiTemplate(params,'success');

})

module.exports = test
const db = require('../db')
const Router = require('koa-router')
const common = require('../utils/common')
const login = new Router()

login.post('/', async (ctx, next) => {
	const params = ctx.request.body;
	const getUserSql = `select * from user where username='${params.username}'`
	await db(getUserSql).then(res => {
		const userObj = res[0];
		if (userObj.password === params.password) {
			ctx.body = common.apiTemplate(userObj,'登录成功')
		} else {
			ctx.body = common.apiTemplateError("用户名或密码错误")
		}
	})

})

module.exports = login
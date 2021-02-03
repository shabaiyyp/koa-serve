const db = require('../db')
const Router = require('koa-router')
const common = require('../utils/common')
const user = new Router()

user.get('/list', async (ctx, next) => {
	const getListSql = `select * from user`;
	await db(getListSql).then((res) => {
		const total = res.length;
		const data = {
			list: res,
			total
		}
		ctx.body = common.apiTemplate(data);
	})

})
user.post('/add', async (ctx, next) => {
	const { name, username, password, sex, tag } = ctx.request.body;
	let addSql;
	if (password) {
		addSql = `insert into user (name,username,sex,tag,password) values ('${name || username}','${username}','${sex}','${tag}','${password}')`;
	} else {
		addSql = `insert into user (name,username,sex,tag) values ('${name || username}','${username}','${sex}','${tag}')`
	}
	await db(addSql).then(res => {
		console.log(res)
		ctx.body = common.apiTemplate({ res }, '添加成功')
	}).catch(error => {
		common.apiTemplateError(error)
	})

})

user.post('/update', async (ctx, next) => {
	const params = ctx.request.body;
	const keys = ['name', 'username', 'password', 'sex', 'tag'];
	let editSql;
	editSql = `update user set ${keys.map(item => `${item}='${params[item]}'`)} where id = ${params.id}`
	console.log(editSql)

	await db(editSql).then(res => {
		console.log(res)
		ctx.body = common.apiTemplate({ res }, '编辑成功')
	})

})

user.delete('/delete', async (ctx, next) => {
	const params = ctx.request.body;
	const delSql = `delete from user where id = ${params.id}`
	await db(delSql).then(res => {
		console.log(res)
		ctx.body = common.apiTemplate({ res }, '删除成功')
	})
})

user.delete('/del/:id', async (ctx, next) => {
	// console.log(ctx.request.params,ctx.params)  //undefined ,{id}
	const delSql = `delete from user where id = ${ctx.params.id}`
	await db(delSql).then(res => {
		console.log(res)
		ctx.body = common.apiTemplate({ res }, '删除成功')
	})

})



module.exports = user
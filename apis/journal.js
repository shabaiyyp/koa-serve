const db = require('../db')
const Router = require('koa-router')
const common = require('../utils/common')
const journal = new Router()

journal.post('/list', async (ctx, next) => {
	const params = ctx.request.body;
	const time = params.time || '';
	const countSql = `SELECT COUNT(*) FROM age_gender_test WHERE time LIKE '%${time}%';`;
	const listSql = `SELECT * from age_gender_test WHERE time LIKE '%${time}%' ORDER BY time DESC
	  LIMIT ${params.size}  offset ${params.size * (params.page - 1)};`;

	  console.log(countSql,listSql)
	const getCount = db(countSql).then(res => {
		return res[0]['COUNT(*)']
	})
	const getList = db(listSql)
	await Promise.all([getCount, getList]).then(vals => {
		ctx.body = common.apiTemplate({ count: vals[0], list: vals[1] }, '参观人员列表')

	})

})

module.exports = journal
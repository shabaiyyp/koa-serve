1. 新建文件夹 ，创建package.json文件   也可以 npm init  一路回车，填写基本信息后，执行下面命令，加载koa

 npm i koa


2. 创建 app.js 文件    黏贴  执行 访问 查看   可以看koa的官网案例

 const koa = require('koa')
 const app = new koa()

 app.use(async (ctx, next) => {
   ctx.body = 'hi, koa'
   await next()
 })

 app.listen(3000)
 console.log('listen:3000')

3.  更好的开发不同的路由（接口） 执行：

注：因为本步骤在实际操作中可能会多次更改代码，导致频繁重启项目，可以先去看下 步骤6

npm i koa-router
 添加以下代码， 然后   访问接口   可携带传参进行查看   

const Router = require('koa-router');
const router = new Router();
 
router.get('/aaa', (ctx, next) => {
  console.log(ctx)
  ctx.response.body = 'hi, aaa'
});
router.post('/bbb', (ctx, next) => {
  console.log(ctx)
  ctx.response.body = 'hi, bbb'
});

app
  .use(router.routes())
  .use(router.allowedMethods());
 能看到get请求能比较简单的获取到参数，post就要麻烦些，所以下一步：

4. 执行以下命令，更方便的获取post 传递的参数   

npm i  koa-bodyparser
（ 貌似koa-bodyparser 比koa-body要好一些 忘记什么原因了，感兴趣的可以去查查）

  做如下更改，再次访问接口，查看

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

router.get('/aaa', (ctx, next) => {
  console.log(ctx,ctx.query)
  ctx.body = ctx.query
});

router.post('/bbb', (ctx, next) => {
  console.log(ctx, ctx.request)
  ctx.body = JSON.stringify(ctx.request.body)
});
当路由比较多的时候，可以分模块开发管理,下一步：



5. 将路由分模块开发  创建apis文件夹  每个模块用单独用一个js文件 具体可看代码  需用fs  （ 其中每个路由模块的文件记得暴露出来）

const fs = require('fs')

const router = new Router();
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
 路由模块文件   user.js

const Router = require('koa-router')
const user = new Router()

user.get('/aaa', (ctx, next) => {
  console.log(ctx,ctx.query)
  ctx.body = ctx.query
});
user.post('/bbb', (ctx, next) => {
  console.log(ctx, ctx.request)
  ctx.body = JSON.stringify(ctx.request.body)
});

module.exports = user;
在接口前加上api/user，即 /api/user/aaa（或  /api/user/bbb） 访问查看



6. 由于开发过程中，每改一次代码就要重启一次，比较麻烦  我们采用 pm2 ;

pm2 主要用来做后台守护程序运行的，也可以监控项目文件更改，重启项目;

这边就全局安装了，执行（也可以看官网）：

npm install -g pm2
 1)如果不想监控的  就可以 直接在项目根路径  pm2 start app.js  启动项目即可(更改文件不会自动重启项目)

 2）生成配置文件（具体配置可以看pm2官网）

//执行生成配置文件
pm2 ecosystem 
//执行启动项目，会自动监控文件更改来重启项目
pm2 start ecosystem.config.js


如果想要看开发中的日志输出，那就去定义好 的日志文件里看  pm2 log  也可以看到

module.exports = {
  apps: [{
    name: 'guestbook',
    script: './app.js',
    watch: true,
    max_memory_restart: '1G',
    cwd: "./", // 当前工作路径 
    ignore_watch: [
      // 从监控目录中排除 
      "node_modules",
      "logs"
    ],
    error_file: "./logs/app-err.log", // 错误日志路径 
    out_file: "./logs/app-out.log", // 普通日志路径 
  }],
};


7. 如果有跨域问题的，可以加一下这个，没有则可以忽略  执行

npm install @koa/cors --save
app.js再做添加代码，如下

const cors = require('@koa/cors');
app.use(cors());




​接上回
咱们已经能够用koa搭建项目，也能简单使用mysql了，搞个留言板实践下，因时间不够人也懒，所以需求比较简单，现在开始。
环境或工具准备：
    数据库：mysql；前端：node、vue；后端：node、koa；

需求分析：

    用户管理：用户注册和登录，发表内容。
    内容管理：用户可以用来发表和编写内容
    数据字典：用来标记用户的基本信息等等（数据库直接写死，不做开发）


系统功能：

    用户管理：
    1.用户相关信息如下： 用户id，用户名，用户昵称，注册时间，用户密码，用户性别，用户所属标签（分类）
    2.用户注册时，提供名称（必须），密码默认为123456，昵称没有时和名称一致
    3.用户采用名称和密码进行登录
    4.用户可以发表和编写查看内容
    
    内容管理：
    1.内容相关信息如下：内容id，发表内容，发表时间，所属时间，创作人
    2.内容可编辑可保存可发表，不可删除，可查看，非本人不可编辑

    数据字典：
    1.数据字典相关信息如下：字典id，名称，所属类型，编码


数据库概念模型设计——基本ER图
    暂时没有工具，略
依据上面的信息，建库建表;（数据库渣的可以像我一样直接手动鼠标点击建库建表，下面sql是导出来的，可以看看）
-- ----------------------------
-- Table structure for dictinfo
-- ----------------------------
DROP TABLE IF EXISTS `dictinfo`;
CREATE TABLE `dictinfo`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '字典项id',
  `type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '字典所属类别',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '字典名称',
  `value` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '字典值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dictinfo
-- ----------------------------
INSERT INTO `dictinfo` VALUES (1, 'sex', '男', '0');
INSERT INTO `dictinfo` VALUES (2, 'sex', '女', '1');
INSERT INTO `dictinfo` VALUES (3, 'tag', '口齿伶俐', '0');
INSERT INTO `dictinfo` VALUES (4, 'tag', '貌比潘安', '1');
INSERT INTO `dictinfo` VALUES (5, 'tag', '羽扇纶巾', '2');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名称',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '123456' COMMENT '用户密码，默认123456',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `sex` int(0) NULL DEFAULT NULL COMMENT '性别，0男1女',
  `tag` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签',
  `createTime` date NULL DEFAULT NULL COMMENT '创建时间：YYYY-MM-DD',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for journal
-- ----------------------------
DROP TABLE IF EXISTS `journal`;
CREATE TABLE `journal`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '内容id',
  `userId` int(0) NOT NULL COMMENT '创作人id，即用户id',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '内容，为json文本，只做存储不做其他改动',
  `date` date NULL DEFAULT NULL COMMENT '所属日期，YYYY-MM-DD',
  `status` int(0) NULL DEFAULT NULL COMMENT '状态，0未发布，1已发布',
  PRIMARY KEY (`id`, `userId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;


开始开发：
1.连接mysql  （具体可看https://www.itying.com/koa/guide-database.html#mysql）
执行 npm i mysql
不能直接就按上面文档上去搞，咱们要小小的封装下。其他的数据库大同小异
创建 db/index.js   代码如下： 

const mysql = require('mysql')

// mysql
const pool = mysql.createPool({
	host: '192.168.1.13',
	port: '3306',
	user: 'test',
	password: 'test123',
	database: 'test'
})

// query sql语句入口
const query = (sql, val) => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject(err)
			}
			else {
				connection.query(sql, val, (err, fields) => {
					if (err) reject(err)
					else resolve(fields)
					connection.release()
				})
			}
		})
	})
}

module.exports = query;


先来个开发接口的例子，剩下的可以自己看源码

为了保证接口返回结果的结构一致，写个小公共方法
创建 utils/common.js   代码如下：
const apiTemplate = (data, message = 'success') => {
  return {
    code: 200,
    message,
    data: {
      ...data,
      message
    }
  }
}
const apiTemplateError = (message = 'error') => {
  return {
    code: 400,
    message,
  }
}
module.exports = {
  apiTemplate,
  apiTemplateError
}


登录接口：

创建apis/login.js ;代码如下：

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



接口相关内容：
         
一、关于不同 形式接口传参：

   1.请求方式不同，接收参数方式
      例如：get， post， delete，put等     在开发对应接口时，定义好对应方法名即可，在框架的帮助下，很简单
   2.参数位置不同，接收参数方式
      1）api/***/:id
         e.g. 
         user.delete('/del/:id',async(ctx)=>{
            const delSql = `delete from user where id = ${ctx.params.id}`
            await db(delSql).then(res => {
               console.log(res)
               ctx.body = common.apiTemplate({res }, '删除成功')
            })
         })

      2）api/***?id=***&name=***   
            用 ctx.request.query 获取参数对象。或者ctx.request.url/search 等，详情看官网
      3）body
         用 ctx.request.body 即可获取
      4）用form表单提交的传参（使用场景：jsonp或者文件上传）还没找到准确获取参数的方法，后面找找看。

二、sql相关内容  以用户管理为例：
   1.查询
   select * from user;
   searchSql = `select * from user where id=${params.id}`
   2.添加
   INSERT INTO `journal`.`user` (`name`,`username`) VALUES ('aa','aaaaa');
   addSql = `insert into user (name,username,sex,tag) values ('${name || username}','${username}','${sex}','${tag}')`
   3.编辑
   UPDATE `journal`.`user` SET `username` = 'bbss' WHERE `id` = 5
   keys=['name','username'];
	 editSql = `update user set ${keys.map(item=>`${item}='${params[item]}'`)} where id = ${params.id}`
   4.删除
   DELETE FROM `journal`.`user` WHERE `id` = 9
	 const delSql = `delete from user where id = ${params.id}`


   其他： 转接第三方接口：
   
    router.post('/proxy*', async (ctx, next) => {
      const path = ctx.request.url.slice(6);
      const method = ctx.request.method;
      const params = ctx.request.body;
      await proxyReq(path, method, JSON.stringify(params)).then(res => {
        ctx.response.body = res;

      }).catch(err => {
        ctx.response.body = {statusCode:err.statusCode};
      })
    });

const http = require("http");
function proxyReq(path, method, params) {
	const options = {
		hostname: '192.168.225.26',
		port: 3000,
		path,
		method,
		headers: {
			'Content-Type': 'application/json'
		}
	}


	return new Promise((resolve, reject) => {
		const req = http.request(options, (res) => {
			console.log(res.statusCode)
			if (res.statusCode === 200) {
				let a = '';
				res.on('data', d => {
					a += d;
				})
				res.on('end', () => {
					resolve(JSON.parse(a));
				})
			} else {
				reject(res)
			}
		})

		req.on('error', error => {
			console.log('error', error);
			reject(error)
		})

		params && req.write(params)
		req.end()

	})

}
 

 用node原生来写的。

接收文件：
koa-bodyparser  不支持 formdata的传参  局限性比较大
可以采用koa-body
后面看看原生(不用中间件)的吧
略坑



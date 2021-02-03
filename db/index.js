/* const mysql = require('mysql')
let pools = {}
let query = (sql,callback, host = '192.168.1.13') => {
    if (!pools.hasOwnProperty(host)) {
        pools[host] = mysql.createPool({
            host: host,
            port: '3306',
            user: 'test',
			password: 'test123',
			database:'test'

        })
    }
    pools[host].getConnection((err, connection) => {
        connection.query(sql, (err, results) => {
            callback(err, results)
            connection.release()
        })
    })
}

module.exports = query */ 


const mysql = require('mysql')

// mysql
const pool = mysql.createPool({
	host: '192.168.31.114',
	port: '3306',
	user: 'root',
	password: '123456',
	database: 'journal'
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

module.exports = query





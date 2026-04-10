require('dotenv').config();   // 🔥 IMPORTANT LINE
var mysql = require('mysql2')

const isProduction = process.env.NODE_ENV === 'production'

const dbConfig = {
    host: isProduction
        ? (process.env.REMOTE_DB_HOST || process.env.MYSQLHOST)
        : (process.env.LOCAL_DB_HOST || process.env.MYSQLHOST),
    port: isProduction
        ? (process.env.REMOTE_DB_PORT || process.env.MYSQLPORT)
        : (process.env.LOCAL_DB_PORT || process.env.MYSQLPORT),
    user: isProduction
        ? (process.env.REMOTE_DB_USER || process.env.MYSQLUSER)
        : (process.env.LOCAL_DB_USER || process.env.MYSQLUSER),
    password: isProduction
        ? (process.env.REMOTE_DB_PASSWORD || process.env.MYSQLPASSWORD)
        : (process.env.LOCAL_DB_PASSWORD || process.env.MYSQLPASSWORD),
    database: isProduction
        ? (process.env.REMOTE_DB_NAME || process.env.MYSQLDATABASE)
        : (process.env.LOCAL_DB_NAME || process.env.MYSQLDATABASE),
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 100
}

var pool = mysql.createPool(dbConfig)

// 🔥 TEST CONNECTION
pool.getConnection((err, connection) => {
    if (err) {
        console.log("❌ DB Connection Error:", err);
    } else {
        console.log("✅ MySQL Connected Successfully");
        connection.release()
    }
})

module.exports = pool
module.exports.db = pool.promise()

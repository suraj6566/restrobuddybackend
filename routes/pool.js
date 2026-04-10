require('dotenv').config();   // 🔥 IMPORTANT LINE
var mysql = require('mysql2');

var pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    multipleStatements: true,
    connectionLimit: 100
});

// 🔥 TEST CONNECTION
pool.getConnection((err, connection) => {
    if (err) {
        console.log("❌ DB Connection Error:", err);
    } else {
        console.log("✅ MySQL Connected Successfully");
        connection.release();
    }
});

module.exports = pool;
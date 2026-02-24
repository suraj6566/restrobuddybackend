require("dotenv").config();
var mysql = require("mysql");

var pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  connectionLimit: 10,
});

module.exports = pool;

pool.getConnection((err, connection) => {
  if (err) {
    console.log("DB Connection Error:", err);
  } else {
    console.log("DB Connected Successfully 🚀");
    connection.release();
  }
});
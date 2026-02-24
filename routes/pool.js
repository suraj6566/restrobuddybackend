require("dotenv").config();
const mysql = require("mysql2");

// create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

// promise wrapper (IMPORTANT 🔥)
const promisePool = pool.promise();

// test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
  } else {
    console.log("✅ DB Connected Successfully 🚀");
    connection.release();
  }
});

module.exports = promisePool;
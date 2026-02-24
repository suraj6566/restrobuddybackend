require("dotenv").config();
const mysql = require("mysql2");

// create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  waitForConnections: true,
  connectionLimit: 10,
});

// promise pool
const promisePool = pool.promise();

// test connection
(async () => {
  try {
    const conn = await promisePool.getConnection();
    console.log("✅ DB Connected Successfully 🚀");
    conn.release();
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
})();

module.exports = promisePool;
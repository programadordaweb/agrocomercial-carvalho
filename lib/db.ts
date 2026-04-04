import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "gustavo_admin_gud",
  password: process.env.DB_PASS || "Ic[kDdj_s0V-}TA9",
  database: process.env.DB_NAME || "gustavo_admin_gudev",
  waitForConnections: true,
  connectionLimit: 5,
});

export default pool;

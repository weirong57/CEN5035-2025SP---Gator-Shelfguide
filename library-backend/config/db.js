// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool or connection
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // optional, specify the limit
  queueLimit: 0 // optional, no limit for queued connections
});

module.exports = connection;

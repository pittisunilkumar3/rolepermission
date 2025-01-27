const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
	if (err) {
		console.error('Database connection failed:', err);
		return;
	}
	console.log('Database connected successfully');
	connection.release();
});

const promisePool = pool.promise();

// Add error handling
pool.on('error', (err) => {
	console.error('Database pool error:', err);
});

module.exports = promisePool;
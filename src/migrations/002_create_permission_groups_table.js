const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS permission_group (
			id INT PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			short_code VARCHAR(100) NOT NULL,
			is_active INT DEFAULT 0,
			system INT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`;
	
	try {
		await db.query(query);
		console.log('Permission Group table created successfully');
	} catch (error) {
		console.error('Error creating permission_group table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS permission_group';
	
	try {
		await db.query(query);
		console.log('Permission Group table dropped successfully');
	} catch (error) {
		console.error('Error dropping permission_group table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
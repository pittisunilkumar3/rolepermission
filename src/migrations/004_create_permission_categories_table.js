const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS permission_category (
			id INT PRIMARY KEY AUTO_INCREMENT,
			perm_group_id INT DEFAULT NULL,
			name VARCHAR(100) DEFAULT NULL,
			short_code VARCHAR(100) DEFAULT NULL,
			enable_view INT DEFAULT 0,
			enable_add INT DEFAULT 0,
			enable_edit INT DEFAULT 0,
			enable_delete INT DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		)
	`;
	
	try {
		await db.query(query);
		console.log('Permission Category table created successfully');
	} catch (error) {
		console.error('Error creating permission_category table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS permission_category';
	
	try {
		await db.query(query);
		console.log('Permission Category table dropped successfully');
	} catch (error) {
		console.error('Error dropping permission_category table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
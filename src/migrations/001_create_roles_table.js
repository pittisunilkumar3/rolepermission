const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS roles (
			id INT PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL,
			slug VARCHAR(150) NOT NULL UNIQUE,
			is_active INT DEFAULT 0,
			is_system INT DEFAULT 0,
			is_superadmin INT DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at DATE
		)
	`;
	
	try {
		await db.query(query);
		console.log('Roles table created successfully');
	} catch (error) {
		console.error('Error creating roles table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS roles';
	
	try {
		await db.query(query);
		console.log('Roles table dropped successfully');
	} catch (error) {
		console.error('Error dropping roles table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
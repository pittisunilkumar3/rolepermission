const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS staff_roles (
			id INT PRIMARY KEY AUTO_INCREMENT,
			role_id INT(11) DEFAULT NULL,
			staff_id INT(11) DEFAULT NULL,
			is_active INT(11) DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			updated_at DATE DEFAULT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
	`;
	
	try {
		await db.query(query);
		console.log('Staff Roles table created successfully');
	} catch (error) {
		console.error('Error creating staff_roles table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS staff_roles';
	
	try {
		await db.query(query);
		console.log('Staff Roles table dropped successfully');
	} catch (error) {
		console.error('Error dropping staff_roles table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS roles_permissions (
			id INT PRIMARY KEY AUTO_INCREMENT,
			role_id INT DEFAULT NULL,
			perm_cat_id INT DEFAULT NULL,
			can_view INT DEFAULT NULL,
			can_add INT DEFAULT NULL,
			can_edit INT DEFAULT NULL,
			can_delete INT DEFAULT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
	`;
	
	try {
		await db.query(query);
		console.log('Roles Permissions table created successfully');
	} catch (error) {
		console.error('Error creating roles_permissions table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS roles_permissions';
	
	try {
		await db.query(query);
		console.log('Roles Permissions table dropped successfully');
	} catch (error) {
		console.error('Error dropping roles_permissions table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
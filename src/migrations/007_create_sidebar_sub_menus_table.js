const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS sidebar_sub_menus (
			id INT PRIMARY KEY AUTO_INCREMENT,
			sidebar_menu_id INT(10) DEFAULT NULL,
			menu VARCHAR(500) DEFAULT NULL,
			\`key\` VARCHAR(500) DEFAULT NULL,
			lang_key VARCHAR(250) DEFAULT NULL,
			url TEXT DEFAULT NULL,
			level INT(5) DEFAULT NULL,
			access_permissions VARCHAR(500) DEFAULT NULL,
			permission_group_id INT(11) DEFAULT NULL,
			activate_controller VARCHAR(100) DEFAULT NULL COMMENT 'income',
			activate_methods VARCHAR(500) DEFAULT NULL COMMENT 'index,edit',
			addon_permission VARCHAR(100) DEFAULT NULL,
			is_active INT(1) DEFAULT 1,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
	`;
	
	try {
		await db.query(query);
		console.log('Sidebar Sub Menus table created successfully');
	} catch (error) {
		console.error('Error creating sidebar_sub_menus table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS sidebar_sub_menus';
	
	try {
		await db.query(query);
		console.log('Sidebar Sub Menus table dropped successfully');
	} catch (error) {
		console.error('Error dropping sidebar_sub_menus table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
const db = require('../../db');

async function up() {
	const createTableQuery = `
		CREATE TABLE IF NOT EXISTS sidebar_menus (
			id INT PRIMARY KEY AUTO_INCREMENT,
			permission_group_id INT(10) DEFAULT NULL,
			icon VARCHAR(100) DEFAULT NULL,
			menu VARCHAR(500) DEFAULT NULL,
			activate_menu VARCHAR(100) DEFAULT NULL,
			lang_key VARCHAR(250) NOT NULL,
			system_level INT(3) DEFAULT 0,
			level INT(5) DEFAULT NULL,
			sidebar_display INT(1) DEFAULT 0,
			access_permissions TEXT DEFAULT NULL,
			is_active INT(1) NOT NULL DEFAULT 1,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
	`;
	
	const sampleData = `
		INSERT INTO sidebar_menus 
		(permission_group_id, icon, menu, activate_menu, lang_key, system_level, level, sidebar_display, access_permissions, is_active)
		VALUES 
		(1, 'fa fa-dashboard', 'Dashboard', 'dashboard', 'dashboard', 1, 1, 1, 'view_dashboard', 1),
		(2, 'fa fa-users', 'User Management', 'users', 'user_management', 1, 2, 1, 'view_users', 1),
		(3, 'fa fa-cog', 'Settings', 'settings', 'settings', 1, 3, 1, 'view_settings', 1)
	`;
	
	try {
		await db.query(createTableQuery);
		console.log('Sidebar Menus table created successfully');
		
		await db.query(sampleData);
		console.log('Sample sidebar menu data inserted successfully');
	} catch (error) {
		console.error('Error in sidebar_menus migration:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS sidebar_menus';
	
	try {
		await db.query(query);
		console.log('Sidebar Menus table dropped successfully');
	} catch (error) {
		console.error('Error dropping sidebar_menus table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
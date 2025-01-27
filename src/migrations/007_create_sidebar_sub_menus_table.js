const db = require('../../db');

async function up() {
	const createTableQuery = `
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
	
	const sampleData = `
		INSERT INTO sidebar_sub_menus 
		(sidebar_menu_id, menu, \`key\`, lang_key, url, level, access_permissions, permission_group_id, activate_controller, activate_methods, is_active)
		VALUES 
		(1, 'Dashboard Overview', 'dashboard_overview', 'dashboard_overview', '/dashboard/overview', 1, 'view_dashboard_overview', 1, 'dashboard', 'overview', 1),
		(1, 'Analytics', 'dashboard_analytics', 'dashboard_analytics', '/dashboard/analytics', 2, 'view_dashboard_analytics', 1, 'dashboard', 'analytics', 1),
		(2, 'User List', 'user_list', 'user_list', '/users/list', 1, 'view_users', 2, 'users', 'list,view', 1),
		(2, 'Add User', 'add_user', 'add_user', '/users/add', 2, 'add_user', 2, 'users', 'add,create', 1),
		(3, 'General Settings', 'general_settings', 'general_settings', '/settings/general', 1, 'view_settings', 3, 'settings', 'general', 1),
		(3, 'Security Settings', 'security_settings', 'security_settings', '/settings/security', 2, 'manage_security', 3, 'settings', 'security', 1)
	`;
	
	try {
		await db.query(createTableQuery);
		console.log('Sidebar Sub Menus table created successfully');
		
		await db.query(sampleData);
		console.log('Sample sidebar submenu data inserted successfully');
	} catch (error) {
		console.error('Error in sidebar_sub_menus migration:', error);
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
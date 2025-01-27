const db = require('../../db');

class SidebarMenu {
	static async create(menuData) {
		const query = `
			INSERT INTO sidebar_menus (
				permission_group_id, icon, menu, activate_menu, lang_key,
				system_level, level, sidebar_display, access_permissions, is_active
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			menuData.permission_group_id,
			menuData.icon,
			menuData.menu,
			menuData.activate_menu,
			menuData.lang_key,
			menuData.system_level || 0,
			menuData.level,
			menuData.sidebar_display || 0,
			menuData.access_permissions,
			menuData.is_active || 1
		];
		return db.query(query, values);
	}

	static async bulkCreate(menus) {
		const query = `
			INSERT INTO sidebar_menus (
				permission_group_id, icon, menu, activate_menu, lang_key,
				system_level, level, sidebar_display, access_permissions, is_active
			) VALUES ?`;
		const values = menus.map(menu => [
			menu.permission_group_id,
			menu.icon,
			menu.menu,
			menu.activate_menu,
			menu.lang_key,
			menu.system_level || 0,
			menu.level,
			menu.sidebar_display || 0,
			menu.access_permissions,
			menu.is_active || 1
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM sidebar_menus WHERE id = ?', [id]);
	}

	static async findAll() {
		try {
			// First check if table exists
			const tableCheck = await db.query(`
				SELECT COUNT(*) as count 
				FROM information_schema.tables 
				WHERE table_schema = '${process.env.DB_NAME}' 
				AND table_name = 'sidebar_menus'
			`);
			console.log('Table check result:', tableCheck);

			// Get all records with count
			const countQuery = 'SELECT COUNT(*) as total FROM sidebar_menus';
			const [countResult] = await db.query(countQuery);
			console.log('Total records:', countResult);

			// Get actual records
			const query = 'SELECT * FROM sidebar_menus';
			console.log('Executing query:', query);
			const result = await db.query(query);
			console.log('Query result:', result);
			return result;
		} catch (error) {
			console.error('Error in findAll:', error);
			throw error;
		}
	}

	static async update(id, menuData) {
		const query = `
			UPDATE sidebar_menus SET
				permission_group_id = ?, icon = ?, menu = ?, activate_menu = ?,
				lang_key = ?, system_level = ?, level = ?, sidebar_display = ?,
				access_permissions = ?, is_active = ?
			WHERE id = ?`;
		const values = [
			menuData.permission_group_id,
			menuData.icon,
			menuData.menu,
			menuData.activate_menu,
			menuData.lang_key,
			menuData.system_level,
			menuData.level,
			menuData.sidebar_display,
			menuData.access_permissions,
			menuData.is_active,
			id
		];
		return db.query(query, values);
	}

	static async bulkUpdate(menus) {
		const promises = menus.map(menu => this.update(menu.id, menu));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM sidebar_menus WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM sidebar_menus WHERE id IN (?)', [ids]);
	}

	static async findAllWithSubmenus() {
		const query = `
			SELECT 
				m.*,
				s.id as submenu_id,
				s.menu as submenu_name,
				s.key as submenu_key,
				s.lang_key as submenu_lang_key,
				s.url as submenu_url,
				s.level as submenu_level,
				s.access_permissions as submenu_permissions,
				s.permission_group_id as submenu_group_id,
				s.activate_controller,
				s.activate_methods,
				s.addon_permission,
				s.is_active as submenu_active
			FROM sidebar_menus m
			LEFT JOIN sidebar_sub_menus s ON m.id = s.sidebar_menu_id
			WHERE m.is_active = 1
			ORDER BY m.level, s.level`;

		console.log('Executing query:', query);
		const [rows] = await db.query(query);
		console.log('Query result:', rows);
		
		// Group the results by menu
		const menus = [];
		const menuMap = new Map();

		rows.forEach(row => {
			if (!menuMap.has(row.id)) {
				const menu = {
					id: row.id,
					permission_group_id: row.permission_group_id,
					icon: row.icon,
					menu: row.menu,
					activate_menu: row.activate_menu,
					lang_key: row.lang_key,
					system_level: row.system_level,
					level: row.level,
					sidebar_display: row.sidebar_display,
					access_permissions: row.access_permissions,
					is_active: row.is_active,
					submenus: []
				};
				menuMap.set(row.id, menu);
				menus.push(menu);
			}

			if (row.submenu_id) {
				menuMap.get(row.id).submenus.push({
					id: row.submenu_id,
					menu: row.submenu_name,
					key: row.submenu_key,
					lang_key: row.submenu_lang_key,
					url: row.submenu_url,
					level: row.submenu_level,
					access_permissions: row.submenu_permissions,
					permission_group_id: row.submenu_group_id,
					activate_controller: row.activate_controller,
					activate_methods: row.activate_methods,
					addon_permission: row.addon_permission,
					is_active: row.submenu_active
				});
			}
		});

		console.log('Final menus structure:', menus);
		return menus;
	}
}

module.exports = SidebarMenu;
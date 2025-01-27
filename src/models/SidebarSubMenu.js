const db = require('../../db');

class SidebarSubMenu {
	static async create(subMenuData) {
		const query = `
			INSERT INTO sidebar_sub_menus (
				sidebar_menu_id, menu, \`key\`, lang_key, url, level,
				access_permissions, permission_group_id, activate_controller,
				activate_methods, addon_permission, is_active
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			subMenuData.sidebar_menu_id,
			subMenuData.menu,
			subMenuData.key,
			subMenuData.lang_key,
			subMenuData.url,
			subMenuData.level,
			subMenuData.access_permissions,
			subMenuData.permission_group_id,
			subMenuData.activate_controller,
			subMenuData.activate_methods,
			subMenuData.addon_permission,
			subMenuData.is_active || 1
		];
		return db.query(query, values);
	}

	static async bulkCreate(subMenus) {
		const query = `
			INSERT INTO sidebar_sub_menus (
				sidebar_menu_id, menu, \`key\`, lang_key, url, level,
				access_permissions, permission_group_id, activate_controller,
				activate_methods, addon_permission, is_active
			) VALUES ?`;
		const values = subMenus.map(menu => [
			menu.sidebar_menu_id,
			menu.menu,
			menu.key,
			menu.lang_key,
			menu.url,
			menu.level,
			menu.access_permissions,
			menu.permission_group_id,
			menu.activate_controller,
			menu.activate_methods,
			menu.addon_permission,
			menu.is_active || 1
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM sidebar_sub_menus WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM sidebar_sub_menus');
	}

	static async findAllWithMenuDetails() {
		try {
			// First check if tables exist and have data
			const checkQuery = `
				SELECT 
					(SELECT COUNT(*) FROM sidebar_menus) as menu_count,
					(SELECT COUNT(*) FROM sidebar_sub_menus) as submenu_count
			`;
			const [[counts]] = await db.query(checkQuery);
			console.log('Table counts:', counts);

			const query = `
				SELECT 
					ssm.*,
					sm.menu as parent_menu_name,
					sm.icon as parent_menu_icon,
					sm.activate_menu as parent_activate_menu,
					sm.level as parent_level
				FROM sidebar_sub_menus ssm
				LEFT JOIN sidebar_menus sm ON ssm.sidebar_menu_id = sm.id
				WHERE sm.id IS NOT NULL
				ORDER BY sm.level, ssm.level`;
			
			console.log('Executing query:', query);
			const [results] = await db.query(query);
			console.log('Query results count:', results?.length || 0);
			
			if (!results || results.length === 0) {
				console.log('No results found');
				return [[]];
			}
			
			return [results];
		} catch (error) {
			console.error('Error in findAllWithMenuDetails:', error);
			throw error;
		}
	}

	static async findByMenuId(menuId) {
		try {
			// First check if menu exists
			const menuQuery = 'SELECT id FROM sidebar_menus WHERE id = ?';
			const [menuResult] = await db.query(menuQuery, [menuId]);
			console.log('Menu check result:', menuResult);

			if (!menuResult || menuResult.length === 0) {
				console.log('Menu not found for ID:', menuId);
				throw new Error('Menu not found');
			}

			// Get submenus with detailed information
			const query = `
				SELECT ssm.*, sm.menu as parent_menu_name
				FROM sidebar_sub_menus ssm
				INNER JOIN sidebar_menus sm ON ssm.sidebar_menu_id = sm.id
				WHERE ssm.sidebar_menu_id = ?
				ORDER BY ssm.level`;
			
			console.log('Executing submenu query:', query, 'with menuId:', menuId);
			const [submenus] = await db.query(query, [menuId]);
			console.log('Found submenus:', submenus);
			
			return [submenus];
		} catch (error) {
			console.error('Error in findByMenuId:', error);
			throw error;
		}
	}

	static async update(id, subMenuData) {
		const query = `
			UPDATE sidebar_sub_menus SET
				sidebar_menu_id = ?, menu = ?, \`key\` = ?, lang_key = ?,
				url = ?, level = ?, access_permissions = ?,
				permission_group_id = ?, activate_controller = ?,
				activate_methods = ?, addon_permission = ?, is_active = ?
			WHERE id = ?`;
		const values = [
			subMenuData.sidebar_menu_id,
			subMenuData.menu,
			subMenuData.key,
			subMenuData.lang_key,
			subMenuData.url,
			subMenuData.level,
			subMenuData.access_permissions,
			subMenuData.permission_group_id,
			subMenuData.activate_controller,
			subMenuData.activate_methods,
			subMenuData.addon_permission,
			subMenuData.is_active,
			id
		];
		return db.query(query, values);
	}

	static async bulkUpdate(subMenus) {
		const promises = subMenus.map(menu => this.update(menu.id, menu));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM sidebar_sub_menus WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM sidebar_sub_menus WHERE id IN (?)', [ids]);
	}
}

module.exports = SidebarSubMenu;
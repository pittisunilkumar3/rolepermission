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

	static async findByMenuId(menuId) {
		return db.query('SELECT * FROM sidebar_sub_menus WHERE sidebar_menu_id = ?', [menuId]);
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
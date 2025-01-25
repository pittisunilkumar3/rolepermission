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
		return db.query('SELECT * FROM sidebar_menus');
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
}

module.exports = SidebarMenu;
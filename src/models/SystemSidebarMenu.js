const db = require('../../db');

class SystemSidebarMenu {
	static async getAll() {
		return await db.query(
			'SELECT * FROM sidebar_menus ORDER BY display_order'
		);
	}

	static async getById(id) {
		const result = await db.query(
			'SELECT * FROM sidebar_menus WHERE id = ?',
			[id]
		);
		return result[0];
	}

	static async create(menuData) {
		const {
			name,
			icon,
			route_path,
			display_order,
			is_active = true,
			permission_category_id = null
		} = menuData;

		const result = await db.query(
			`INSERT INTO sidebar_menus 
			(name, icon, route_path, display_order, is_active, permission_category_id) 
			VALUES (?, ?, ?, ?, ?, ?)`,
			[name, icon, route_path, display_order, is_active, permission_category_id]
		);
		return result.insertId;
	}

	static async update(id, menuData) {
		const {
			name,
			icon,
			route_path,
			display_order,
			is_active,
			permission_category_id
		} = menuData;

		return await db.query(
			`UPDATE sidebar_menus 
			SET name = ?, icon = ?, route_path = ?, 
				display_order = ?, is_active = ?, permission_category_id = ? 
			WHERE id = ?`,
			[name, icon, route_path, display_order, is_active, permission_category_id, id]
		);
	}

	static async delete(id) {
		return await db.query('DELETE FROM sidebar_menus WHERE id = ?', [id]);
	}

	static async getWithSubMenus(id) {
		const menu = await this.getById(id);
		if (!menu) return null;

		const subMenus = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE menu_id = ? ORDER BY display_order',
			[id]
		);

		return {
			...menu,
			sub_menus: subMenus
		};
	}

	static async getAllWithSubMenus() {
		const menus = await this.getAll();
		const menuIds = menus.map(menu => menu.id);

		if (menuIds.length === 0) return [];

		const subMenus = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE menu_id IN (?) ORDER BY display_order',
			[menuIds]
		);

		return menus.map(menu => ({
			...menu,
			sub_menus: subMenus.filter(sub => sub.menu_id === menu.id)
		}));
	}

	static async updateDisplayOrder(orderUpdates) {
		const queries = orderUpdates.map(update => {
			return db.query(
				'UPDATE sidebar_menus SET display_order = ? WHERE id = ?',
				[update.display_order, update.id]
			);
		});
		
		return Promise.all(queries);
	}
}

module.exports = SystemSidebarMenu;
const db = require('../../db');

class SystemSidebarSubMenu {
	static async getAll() {
		return await db.query(
			'SELECT * FROM sidebar_sub_menus ORDER BY menu_id, display_order'
		);
	}

	static async getById(id) {
		const result = await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE id = ?',
			[id]
		);
		return result[0];
	}

	static async getByMenuId(menuId) {
		return await db.query(
			'SELECT * FROM sidebar_sub_menus WHERE menu_id = ? ORDER BY display_order',
			[menuId]
		);
	}

	static async create(subMenuData) {
		const {
			menu_id,
			name,
			icon = null,
			route_path,
			display_order,
			is_active = true,
			permission_category_id = null
		} = subMenuData;

		const result = await db.query(
			`INSERT INTO sidebar_sub_menus 
			(menu_id, name, icon, route_path, display_order, is_active, permission_category_id) 
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[menu_id, name, icon, route_path, display_order, is_active, permission_category_id]
		);
		return result.insertId;
	}

	static async update(id, subMenuData) {
		const {
			menu_id,
			name,
			icon,
			route_path,
			display_order,
			is_active,
			permission_category_id
		} = subMenuData;

		return await db.query(
			`UPDATE sidebar_sub_menus 
			SET menu_id = ?, name = ?, icon = ?, route_path = ?, 
				display_order = ?, is_active = ?, permission_category_id = ? 
			WHERE id = ?`,
			[menu_id, name, icon, route_path, display_order, is_active, permission_category_id, id]
		);
	}

	static async delete(id) {
		return await db.query('DELETE FROM sidebar_sub_menus WHERE id = ?', [id]);
	}

	static async deleteByMenuId(menuId) {
		return await db.query('DELETE FROM sidebar_sub_menus WHERE menu_id = ?', [menuId]);
	}

	static async updateDisplayOrder(orderUpdates) {
		const queries = orderUpdates.map(update => {
			return db.query(
				'UPDATE sidebar_sub_menus SET display_order = ? WHERE id = ?',
				[update.display_order, update.id]
			);
		});
		
		return Promise.all(queries);
	}

	static async search(filters) {
		let query = 'SELECT * FROM sidebar_sub_menus WHERE 1=1';
		const params = [];

		if (filters.menu_id) {
			query += ' AND menu_id = ?';
			params.push(filters.menu_id);
		}

		if (filters.name) {
			query += ' AND name LIKE ?';
			params.push(`%${filters.name}%`);
		}

		if (filters.is_active !== undefined) {
			query += ' AND is_active = ?';
			params.push(filters.is_active);
		}

		if (filters.permission_category_id) {
			query += ' AND permission_category_id = ?';
			params.push(filters.permission_category_id);
		}

		query += ' ORDER BY menu_id, display_order';
		return await db.query(query, params);
	}
}

module.exports = SystemSidebarSubMenu;
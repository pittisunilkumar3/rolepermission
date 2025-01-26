const db = require('../../db');

class SystemPermissionCategory {
	static async getAll() {
		return await db.query('SELECT * FROM permission_category ORDER BY id');
	}

	static async getById(id) {
		const result = await db.query('SELECT * FROM permission_category WHERE id = ?', [id]);
		return result[0];
	}

	static async getByGroupId(groupId) {
		return await db.query(
			'SELECT * FROM permission_category WHERE perm_group_id = ? ORDER BY id',
			[groupId]
		);
	}

	static async create(categoryData) {
		const {
			name,
			short_code,
			perm_group_id,
			enable_view = true,
			enable_add = true,
			enable_edit = true,
			enable_delete = true
		} = categoryData;

		const result = await db.query(
			`INSERT INTO permission_category 
			(name, short_code, perm_group_id, enable_view, enable_add, enable_edit, enable_delete) 
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[name, short_code, perm_group_id, enable_view, enable_add, enable_edit, enable_delete]
		);
		return result.insertId;
	}

	static async update(id, categoryData) {
		const {
			name,
			short_code,
			perm_group_id,
			enable_view,
			enable_add,
			enable_edit,
			enable_delete
		} = categoryData;

		return await db.query(
			`UPDATE permission_category 
			SET name = ?, short_code = ?, perm_group_id = ?, 
				enable_view = ?, enable_add = ?, enable_edit = ?, enable_delete = ? 
			WHERE id = ?`,
			[name, short_code, perm_group_id, enable_view, enable_add, enable_edit, enable_delete, id]
		);
	}

	static async delete(id) {
		return await db.query('DELETE FROM permission_category WHERE id = ?', [id]);
	}

	static async search(filters) {
		let query = 'SELECT * FROM permission_category WHERE 1=1';
		const params = [];

		if (filters.name) {
			query += ' AND name LIKE ?';
			params.push(`%${filters.name}%`);
		}

		if (filters.short_code) {
			query += ' AND short_code = ?';
			params.push(filters.short_code);
		}

		if (filters.perm_group_id) {
			query += ' AND perm_group_id = ?';
			params.push(filters.perm_group_id);
		}

		return await db.query(query, params);
	}
}

module.exports = SystemPermissionCategory;
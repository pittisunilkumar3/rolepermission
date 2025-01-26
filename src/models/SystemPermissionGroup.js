const db = require('../../db');

class SystemPermissionGroup {
	static async getAll() {
		return await db.query('SELECT * FROM permission_group ORDER BY id');
	}

	static async getById(id) {
		const result = await db.query('SELECT * FROM permission_group WHERE id = ?', [id]);
		return result[0];
	}

	static async create(groupData) {
		const { 
			name, 
			short_code, 
			description = null, 
			is_active = true 
		} = groupData;

		const result = await db.query(
			`INSERT INTO permission_group 
			(name, short_code, description, is_active) 
			VALUES (?, ?, ?, ?)`,
			[name, short_code, description, is_active]
		);
		return result.insertId;
	}

	static async update(id, groupData) {
		const { name, short_code, description, is_active } = groupData;
		return await db.query(
			`UPDATE permission_group 
			SET name = ?, short_code = ?, description = ?, is_active = ? 
			WHERE id = ?`,
			[name, short_code, description, is_active, id]
		);
	}

	static async delete(id) {
		return await db.query('DELETE FROM permission_group WHERE id = ?', [id]);
	}

	static async search(filters) {
		let query = 'SELECT * FROM permission_group WHERE 1=1';
		const params = [];

		if (filters.name) {
			query += ' AND name LIKE ?';
			params.push(`%${filters.name}%`);
		}

		if (filters.short_code) {
			query += ' AND short_code = ?';
			params.push(filters.short_code);
		}

		if (filters.is_active !== undefined) {
			query += ' AND is_active = ?';
			params.push(filters.is_active);
		}

		return await db.query(query, params);
	}

	static async getWithCategories(id) {
		const group = await this.getById(id);
		if (!group) return null;

		const categories = await db.query(
			'SELECT * FROM permission_category WHERE perm_group_id = ?',
			[id]
		);

		return {
			...group,
			categories
		};
	}
}

module.exports = SystemPermissionGroup;
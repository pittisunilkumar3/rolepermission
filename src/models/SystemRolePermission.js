const db = require('../../db');

class SystemRolePermission {
	static async getAllByRoleId(roleId) {
		return await db.query(
			'SELECT * FROM roles_permissions WHERE role_id = ?',
			[roleId]
		);
	}

	static async create(permissionData) {
		const {
			role_id,
			perm_cat_id,
			can_view = false,
			can_add = false,
			can_edit = false,
			can_delete = false
		} = permissionData;

		const result = await db.query(
			`INSERT INTO roles_permissions 
			(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete) 
			VALUES (?, ?, ?, ?, ?, ?)`,
			[role_id, perm_cat_id, can_view, can_add, can_edit, can_delete]
		);
		return result.insertId;
	}

	static async update(id, permissionData) {
		const { can_view, can_add, can_edit, can_delete } = permissionData;
		return await db.query(
			`UPDATE roles_permissions 
			SET can_view = ?, can_add = ?, can_edit = ?, can_delete = ? 
			WHERE id = ?`,
			[can_view, can_add, can_edit, can_delete, id]
		);
	}

	static async delete(id) {
		return await db.query('DELETE FROM roles_permissions WHERE id = ?', [id]);
	}

	static async deleteByRoleId(roleId) {
		return await db.query(
			'DELETE FROM roles_permissions WHERE role_id = ?',
			[roleId]
		);
	}

	static async getPermissionsByCategory(roleId, categoryId) {
		return await db.query(
			`SELECT * FROM roles_permissions 
			WHERE role_id = ? AND perm_cat_id = ?`,
			[roleId, categoryId]
		);
	}
}

module.exports = SystemRolePermission;
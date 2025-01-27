const db = require('../../db');

class RolePermission {
	static async create(permissionData) {
		const query = `
			INSERT INTO roles_permissions (
				role_id, perm_cat_id, can_view, can_add, can_edit, can_delete
			) VALUES (?, ?, ?, ?, ?, ?)`;
		const values = [
			permissionData.role_id,
			permissionData.perm_cat_id,
			permissionData.can_view || null,
			permissionData.can_add || null,
			permissionData.can_edit || null,
			permissionData.can_delete || null
		];
		return db.query(query, values);
	}

	static async bulkCreate(permissions) {
		const query = `
			INSERT INTO roles_permissions (
				role_id, perm_cat_id, can_view, can_add, can_edit, can_delete
			) VALUES ?`;
		const values = permissions.map(permission => [
			permission.role_id,
			permission.perm_cat_id,
			permission.can_view || null,
			permission.can_add || null,
			permission.can_edit || null,
			permission.can_delete || null
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM roles_permissions WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM roles_permissions');
	}

	static async update(id, permissionData) {
		const query = `
			UPDATE roles_permissions SET
				role_id = ?, perm_cat_id = ?, can_view = ?,
				can_add = ?, can_edit = ?, can_delete = ?
			WHERE id = ?`;
		const values = [
			permissionData.role_id,
			permissionData.perm_cat_id,
			permissionData.can_view,
			permissionData.can_add,
			permissionData.can_edit,
			permissionData.can_delete,
			id
		];
		return db.query(query, values);
	}

	static async bulkUpdate(permissions) {
		const promises = permissions.map(permission => this.update(permission.id, permission));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM roles_permissions WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM roles_permissions WHERE id IN (?)', [ids]);
	}
}

module.exports = RolePermission;
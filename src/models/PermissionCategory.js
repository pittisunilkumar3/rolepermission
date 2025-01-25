const db = require('../../db');

class PermissionCategory {
	static async create(categoryData) {
		const query = `
			INSERT INTO permission_category (
				perm_group_id, name, short_code, 
				enable_view, enable_add, enable_edit, enable_delete
			) VALUES (?, ?, ?, ?, ?, ?, ?)`;
		const values = [
			categoryData.perm_group_id,
			categoryData.name,
			categoryData.short_code,
			categoryData.enable_view || 0,
			categoryData.enable_add || 0,
			categoryData.enable_edit || 0,
			categoryData.enable_delete || 0
		];
		return db.query(query, values);
	}

	static async bulkCreate(categories) {
		const query = `
			INSERT INTO permission_category (
				perm_group_id, name, short_code, 
				enable_view, enable_add, enable_edit, enable_delete
			) VALUES ?`;
		const values = categories.map(category => [
			category.perm_group_id,
			category.name,
			category.short_code,
			category.enable_view || 0,
			category.enable_add || 0,
			category.enable_edit || 0,
			category.enable_delete || 0
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM permission_category WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM permission_category');
	}

	static async update(id, categoryData) {
		const query = `
			UPDATE permission_category SET
				perm_group_id = ?, name = ?, short_code = ?,
				enable_view = ?, enable_add = ?, enable_edit = ?, enable_delete = ?
			WHERE id = ?`;
		const values = [
			categoryData.perm_group_id,
			categoryData.name,
			categoryData.short_code,
			categoryData.enable_view,
			categoryData.enable_add,
			categoryData.enable_edit,
			categoryData.enable_delete,
			id
		];
		return db.query(query, values);
	}

	static async bulkUpdate(categories) {
		const promises = categories.map(category => this.update(category.id, category));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM permission_category WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM permission_category WHERE id IN (?)', [ids]);
	}
}

module.exports = PermissionCategory;
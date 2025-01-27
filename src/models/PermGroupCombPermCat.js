const db = require('../../db');

class PermGroupCombPermCat {
	static async getAllByGroupId(groupId) {
		const query = `
			SELECT pc.* FROM permission_category pc
			INNER JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE pg.id = ?`;
		return await db.query(query, [groupId]);
	}

	static async getOneByGroupId(groupId, catId) {
		const query = `
			SELECT pc.* FROM permission_category pc
			INNER JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE pg.id = ? AND pc.id = ?`;
		const [result] = await db.query(query, [groupId, catId]);
		return result;
	}

	static async deleteByGroupId(groupId) {
		const query = 'DELETE FROM permission_category WHERE perm_group_id = ?';
		return await db.query(query, [groupId]);
	}

	static async deleteOneByGroupId(groupId, catId) {
		const query = 'DELETE FROM permission_category WHERE perm_group_id = ? AND id = ?';
		return await db.query(query, [groupId, catId]);
	}

	static async updateByGroupId(groupId, data) {
		const query = `
			UPDATE permission_category 
			SET name = ?, short_code = ?, enable_view = ?, 
				enable_add = ?, enable_edit = ?, enable_delete = ?
			WHERE perm_group_id = ?`;
		return await db.query(query, [
			data.name, data.short_code, data.enable_view,
			data.enable_add, data.enable_edit, data.enable_delete,
			groupId
		]);
	}

	static async updateOneByGroupId(groupId, catId, data) {
		const query = `
			UPDATE permission_category 
			SET name = ?, short_code = ?, enable_view = ?, 
				enable_add = ?, enable_edit = ?, enable_delete = ?
			WHERE perm_group_id = ? AND id = ?`;
		return await db.query(query, [
			data.name, data.short_code, data.enable_view,
			data.enable_add, data.enable_edit, data.enable_delete,
			groupId, catId
		]);
	}

	static async createOne(groupId, data) {
		const query = `
			INSERT INTO permission_category 
			(perm_group_id, name, short_code, enable_view, enable_add, enable_edit, enable_delete)
			VALUES (?, ?, ?, ?, ?, ?, ?)`;
		return await db.query(query, [
			groupId,
			data.name,
			data.short_code,
			data.enable_view,
			data.enable_add,
			data.enable_edit,
			data.enable_delete
		]);
	}

	static async createMultiple(groupId, categories) {
		const query = `
			INSERT INTO permission_category 
			(perm_group_id, name, short_code, enable_view, enable_add, enable_edit, enable_delete)
			VALUES ?`;
		
		const values = categories.map(cat => [
			groupId,
			cat.name,
			cat.short_code,
			cat.enable_view,
			cat.enable_add,
			cat.enable_edit,
			cat.enable_delete
		]);

		return await db.query(query, [values]);
	}
}

module.exports = PermGroupCombPermCat;
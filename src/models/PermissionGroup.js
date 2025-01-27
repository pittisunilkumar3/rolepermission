const db = require('../../db');

class PermissionGroup {
	static async create(groupData) {
		const query = 'INSERT INTO permission_group (name, short_code, is_active, system) VALUES (?, ?, ?, ?)';
		const values = [groupData.name, groupData.short_code, groupData.is_active || 0, groupData.system];
		return db.query(query, values);
	}

	static async bulkCreate(groups) {
		const query = 'INSERT INTO permission_group (name, short_code, is_active, system) VALUES ?';
		const values = groups.map(group => [
			group.name,
			group.short_code,
			group.is_active || 0,
			group.system
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM permission_group WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM permission_group');
	}

	static async update(id, groupData) {
		const query = 'UPDATE permission_group SET name = ?, short_code = ?, is_active = ?, system = ? WHERE id = ?';
		const values = [groupData.name, groupData.short_code, groupData.is_active, groupData.system, id];
		return db.query(query, values);
	}

	static async bulkUpdate(groups) {
		const promises = groups.map(group => this.update(group.id, group));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM permission_group WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM permission_group WHERE id IN (?)', [ids]);
	}
}

module.exports = PermissionGroup;
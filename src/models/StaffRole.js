const db = require('../../db');

class StaffRole {
	static async create(staffRoleData) {
		const query = `
			INSERT INTO staff_roles (
				role_id, staff_id, is_active, updated_at
			) VALUES (?, ?, ?, CURDATE())`;
		const values = [
			staffRoleData.role_id,
			staffRoleData.staff_id,
			staffRoleData.is_active || 0
		];
		return db.query(query, values);
	}

	static async bulkCreate(staffRoles) {
		const query = `
			INSERT INTO staff_roles (
				role_id, staff_id, is_active, updated_at
			) VALUES ?`;
		const values = staffRoles.map(role => [
			role.role_id,
			role.staff_id,
			role.is_active || 0,
			new Date().toISOString().split('T')[0]
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM staff_roles WHERE id = ?', [id]);
	}

	static async findByStaffId(staffId) {
		return db.query('SELECT * FROM staff_roles WHERE staff_id = ?', [staffId]);
	}

	static async findByRoleId(roleId) {
		return db.query('SELECT * FROM staff_roles WHERE role_id = ?', [roleId]);
	}

	static async findAll() {
		return db.query('SELECT * FROM staff_roles');
	}

	static async update(id, staffRoleData) {
		const query = `
			UPDATE staff_roles SET
				role_id = ?, staff_id = ?, is_active = ?, updated_at = CURDATE()
			WHERE id = ?`;
		const values = [
			staffRoleData.role_id,
			staffRoleData.staff_id,
			staffRoleData.is_active,
			id
		];
		return db.query(query, values);
	}

	static async bulkUpdate(staffRoles) {
		const promises = staffRoles.map(role => this.update(role.id, role));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM staff_roles WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM staff_roles WHERE id IN (?)', [ids]);
	}

	static async deleteByStaffId(staffId) {
		return db.query('DELETE FROM staff_roles WHERE staff_id = ?', [staffId]);
	}

	static async deleteByRoleId(roleId) {
		return db.query('DELETE FROM staff_roles WHERE role_id = ?', [roleId]);
	}
}

module.exports = StaffRole;
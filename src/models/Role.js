const db = require('../../db');

class Role {
	static async createTable() {
		const query = `
			CREATE TABLE IF NOT EXISTS roles (
				id INT PRIMARY KEY AUTO_INCREMENT,
				name VARCHAR(100) NOT NULL,
				slug VARCHAR(150) NOT NULL UNIQUE,
				is_active INT DEFAULT 0,
				is_system INT DEFAULT 0,
				is_superadmin INT DEFAULT 0,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at DATE
			)`;
		return db.query(query);
	}

	static async create(roleData) {
		const query = 'INSERT INTO roles (name, slug, is_active, is_system, is_superadmin, updated_at) VALUES (?, ?, ?, ?, ?, CURDATE())';
		const values = [roleData.name, roleData.slug, roleData.is_active || 0, roleData.is_system || 0, roleData.is_superadmin || 0];
		return db.query(query, values);
	}

	static async bulkCreate(roles) {
		const query = 'INSERT INTO roles (name, slug, is_active, is_system, is_superadmin, updated_at) VALUES ?';
		const values = roles.map(role => [
			role.name,
			role.slug,
			role.is_active || 0,
			role.is_system || 0,
			role.is_superadmin || 0,
			new Date().toISOString().split('T')[0]
		]);
		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM roles WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM roles');
	}

	static async findSuperAdmin() {
		return db.query('SELECT * FROM roles WHERE is_superadmin = 1');
	}

	static async update(id, roleData) {
		const query = 'UPDATE roles SET name = ?, slug = ?, is_active = ?, is_system = ?, is_superadmin = ?, updated_at = CURDATE() WHERE id = ?';
		const values = [roleData.name, roleData.slug, roleData.is_active, roleData.is_system, roleData.is_superadmin, id];
		return db.query(query, values);
	}

	static async bulkUpdate(roles) {
		const promises = roles.map(role => this.update(role.id, role));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM roles WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM roles WHERE id IN (?)', [ids]);
	}
}

module.exports = Role;
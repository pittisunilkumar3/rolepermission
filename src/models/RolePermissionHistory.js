const db = require('../../db');

class RolePermissionHistory {
	static async createHistoryEntry(roleId, categoryId, changes, userId) {
		const query = `
			INSERT INTO role_permission_history 
			(role_id, category_id, changes, changed_by, changed_at)
			VALUES (?, ?, ?, ?, NOW())`;
		
		return await db.query(query, [
			roleId,
			categoryId,
			JSON.stringify(changes),
			userId
		]);
	}

	static async getHistory(options = {}) {
		let query = `
			SELECT 
				rph.id,
				r.name as role_name,
				pc.name as category_name,
				rph.changes,
				rph.changed_by,
				rph.changed_at
			FROM role_permission_history rph
			JOIN roles r ON r.id = rph.role_id
			JOIN permission_category pc ON pc.id = rph.category_id
			WHERE 1=1`;
		
		const params = [];

		if (options.roleId) {
			query += ` AND rph.role_id = ?`;
			params.push(options.roleId);
		}

		if (options.fromDate) {
			query += ` AND rph.changed_at >= ?`;
			params.push(options.fromDate);
		}

		if (options.toDate) {
			query += ` AND rph.changed_at <= ?`;
			params.push(options.toDate);
		}

		query += ` ORDER BY rph.changed_at DESC`;

		return await db.query(query, params);
	}

	static async getChangesSummary(roleId) {
		const query = `
			SELECT 
				DATE(rph.changed_at) as change_date,
				COUNT(*) as change_count,
				GROUP_CONCAT(DISTINCT pc.name) as affected_categories
			FROM role_permission_history rph
			JOIN permission_category pc ON pc.id = rph.category_id
			WHERE rph.role_id = ?
			GROUP BY DATE(rph.changed_at)
			ORDER BY change_date DESC`;

		return await db.query(query, [roleId]);
	}

	static async getRecentChanges(limit = 10) {
		const query = `
			SELECT 
				rph.id,
				r.name as role_name,
				pc.name as category_name,
				rph.changes,
				rph.changed_by,
				rph.changed_at
			FROM role_permission_history rph
			JOIN roles r ON r.id = rph.role_id
			JOIN permission_category pc ON pc.id = rph.category_id
			ORDER BY rph.changed_at DESC
			LIMIT ?`;

		return await db.query(query, [limit]);
	}
}

module.exports = RolePermissionHistory;
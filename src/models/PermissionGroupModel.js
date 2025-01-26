const db = require('../../db');

class PermissionGroupModel {
	static async getAllGroups() {
		const query = `
			SELECT 
				pg.*,
				COUNT(DISTINCT pc.id) as category_count
			FROM permission_group pg
			LEFT JOIN permission_category pc ON pg.id = pc.perm_group_id
			GROUP BY pg.id
			ORDER BY pg.id`;
		
		return await db.query(query);
	}

	static async getGroupById(id) {
		const queries = {
			group: `SELECT * FROM permission_group WHERE id = ?`,
			categories: `
				SELECT 
					pc.*,
					COUNT(DISTINCT rp.role_id) as roles_count
				FROM permission_category pc
				LEFT JOIN roles_permissions rp ON pc.id = rp.perm_cat_id
				WHERE pc.perm_group_id = ?
				GROUP BY pc.id
				ORDER BY pc.id`
		};

		const [group, categories] = await Promise.all([
			db.query(queries.group, [id]),
			db.query(queries.categories, [id])
		]);

		if (!group[0]) return null;

		return {
			...group[0],
			categories
		};
	}

	static async getGroupWithDetails(id) {
		const queries = {
			group: `SELECT * FROM permission_group WHERE id = ?`,
			categories: `
				SELECT pc.* FROM permission_category pc
				WHERE pc.perm_group_id = ?`,
			roles: `
				SELECT DISTINCT 
					r.id,
					r.name,
					COUNT(DISTINCT rp.perm_cat_id) as permissions_count
				FROM roles r
				JOIN roles_permissions rp ON r.id = rp.role_id
				JOIN permission_category pc ON rp.perm_cat_id = pc.id
				WHERE pc.perm_group_id = ?
				GROUP BY r.id`
		};

		const [group, categories, roles] = await Promise.all([
			db.query(queries.group, [id]),
			db.query(queries.categories, [id]),
			db.query(queries.roles, [id])
		]);

		if (!group[0]) return null;

		return {
			...group[0],
			categories,
			roles
		};
	}

	static async createGroup(groupData) {
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

	static async updateGroup(id, groupData) {
		const { 
			name, 
			short_code, 
			description, 
			is_active 
		} = groupData;

		return await db.query(
			`UPDATE permission_group 
			SET name = ?, short_code = ?, description = ?, is_active = ? 
			WHERE id = ?`,
			[name, short_code, description, is_active, id]
		);
	}

	static async deleteGroup(id) {
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();

			// Get all category IDs in this group
			const categories = await connection.query(
				'SELECT id FROM permission_category WHERE perm_group_id = ?',
				[id]
			);
			
			const categoryIds = categories.map(cat => cat.id);

			if (categoryIds.length > 0) {
				// Delete related role permissions
				await connection.query(
					'DELETE FROM roles_permissions WHERE perm_cat_id IN (?)',
					[categoryIds]
				);
				
				// Delete categories
				await connection.query(
					'DELETE FROM permission_category WHERE perm_group_id = ?',
					[id]
				);
			}

			// Delete the group
			await connection.query(
				'DELETE FROM permission_group WHERE id = ?',
				[id]
			);

			await connection.commit();
			return true;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}
}

module.exports = PermissionGroupModel;
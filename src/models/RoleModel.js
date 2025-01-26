const db = require('../../db');

class RoleModel {
	static async getAllRoles() {
		const query = `
			SELECT 
				r.*,
				COUNT(DISTINCT sr.staff_id) as staff_count,
				COUNT(DISTINCT rp.perm_cat_id) as permission_count
			FROM roles r
			LEFT JOIN staff_roles sr ON r.id = sr.role_id
			LEFT JOIN roles_permissions rp ON r.id = rp.role_id
			GROUP BY r.id
			ORDER BY r.id`;
		
		return await db.query(query);
	}

	static async getRoleById(id) {
		const queries = {
			role: `SELECT * FROM roles WHERE id = ?`,
			permissions: `
				SELECT 
					rp.*,
					pc.name as category_name,
					pc.short_code as category_code,
					pg.name as group_name
				FROM roles_permissions rp
				JOIN permission_category pc ON rp.perm_cat_id = pc.id
				JOIN permission_group pg ON pc.perm_group_id = pg.id
				WHERE rp.role_id = ?`,
			staff: `
				SELECT s.* 
				FROM staff s
				JOIN staff_roles sr ON s.id = sr.staff_id
				WHERE sr.role_id = ?`
		};

		const [role, permissions, staff] = await Promise.all([
			db.query(queries.role, [id]),
			db.query(queries.permissions, [id]),
			db.query(queries.staff, [id])
		]);

		if (!role[0]) return null;

		return {
			...role[0],
			permissions,
			staff
		};
	}

	static async createRole(roleData) {
		const { name, description = null, is_active = true, permissions = [] } = roleData;
		
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();

			const result = await connection.query(
				'INSERT INTO roles (name, description, is_active) VALUES (?, ?, ?)',
				[name, description, is_active]
			);

			const roleId = result.insertId;

			if (permissions.length > 0) {
				const permissionValues = permissions.map(p => [
					roleId,
					p.category_id,
					p.can_view || false,
					p.can_add || false,
					p.can_edit || false,
					p.can_delete || false
				]);

				await connection.query(
					`INSERT INTO roles_permissions 
					(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete) 
					VALUES ?`,
					[permissionValues]
				);
			}

			await connection.commit();
			return roleId;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	static async updateRole(id, roleData) {
		const { name, description, is_active, permissions } = roleData;
		
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();

			await connection.query(
				'UPDATE roles SET name = ?, description = ?, is_active = ? WHERE id = ?',
				[name, description, is_active, id]
			);

			if (permissions) {
				await connection.query('DELETE FROM roles_permissions WHERE role_id = ?', [id]);
				
				if (permissions.length > 0) {
					const permissionValues = permissions.map(p => [
						id,
						p.category_id,
						p.can_view || false,
						p.can_add || false,
						p.can_edit || false,
						p.can_delete || false
					]);

					await connection.query(
						`INSERT INTO roles_permissions 
						(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete) 
						VALUES ?`,
						[permissionValues]
					);
				}
			}

			await connection.commit();
			return true;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	static async deleteRole(id) {
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();
			
			await connection.query('DELETE FROM roles_permissions WHERE role_id = ?', [id]);
			await connection.query('DELETE FROM staff_roles WHERE role_id = ?', [id]);
			await connection.query('DELETE FROM roles WHERE id = ?', [id]);
			
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

module.exports = RoleModel;
const db = require('../../db');

class StaffModel {
	static async getAllStaff() {
		const query = `
			SELECT 
				s.*,
				GROUP_CONCAT(r.name) as role_names,
				GROUP_CONCAT(r.id) as role_ids
			FROM staff s
			LEFT JOIN staff_roles sr ON s.id = sr.staff_id
			LEFT JOIN roles r ON sr.role_id = r.id
			GROUP BY s.id
			ORDER BY s.id`;
		
		return await db.query(query);
	}

	static async getStaffById(id) {
		const query = `
			SELECT 
				s.*,
				GROUP_CONCAT(r.name) as role_names,
				GROUP_CONCAT(r.id) as role_ids
			FROM staff s
			LEFT JOIN staff_roles sr ON s.id = sr.staff_id
			LEFT JOIN roles r ON sr.role_id = r.id
			WHERE s.id = ?
			GROUP BY s.id`;
		
		const result = await db.query(query, [id]);
		return result[0];
	}

	static async getStaffWithRoles(id) {
		const queries = {
			staff: `SELECT * FROM staff WHERE id = ?`,
			roles: `
				SELECT r.* 
				FROM roles r
				JOIN staff_roles sr ON r.id = sr.role_id
				WHERE sr.staff_id = ?`
		};

		const [staff, roles] = await Promise.all([
			db.query(queries.staff, [id]),
			db.query(queries.roles, [id])
		]);

		if (!staff[0]) return null;

		return {
			...staff[0],
			roles
		};
	}

	static async createStaff(staffData) {
		const { name, email, is_active = true, roles = [] } = staffData;
		
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();

			const result = await connection.query(
				'INSERT INTO staff (name, email, is_active) VALUES (?, ?, ?)',
				[name, email, is_active]
			);

			const staffId = result.insertId;

			if (roles.length > 0) {
				const roleValues = roles.map(roleId => [staffId, roleId]);
				await connection.query(
					'INSERT INTO staff_roles (staff_id, role_id) VALUES ?',
					[roleValues]
				);
			}

			await connection.commit();
			return staffId;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	static async updateStaff(id, staffData) {
		const { name, email, is_active, roles } = staffData;
		
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();

			await connection.query(
				'UPDATE staff SET name = ?, email = ?, is_active = ? WHERE id = ?',
				[name, email, is_active, id]
			);

			if (roles) {
				await connection.query('DELETE FROM staff_roles WHERE staff_id = ?', [id]);
				
				if (roles.length > 0) {
					const roleValues = roles.map(roleId => [id, roleId]);
					await connection.query(
						'INSERT INTO staff_roles (staff_id, role_id) VALUES ?',
						[roleValues]
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

	static async deleteStaff(id) {
		const connection = await db.getConnection();
		try {
			await connection.beginTransaction();
			
			await connection.query('DELETE FROM staff_roles WHERE staff_id = ?', [id]);
			await connection.query('DELETE FROM staff WHERE id = ?', [id]);
			
			await connection.commit();
			return true;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	static async getStaffDetails(id) {
		const queries = {
			staff: `
				SELECT 
					s.*,
					GROUP_CONCAT(DISTINCT r.name) as role_names
				FROM staff s
				LEFT JOIN staff_roles sr ON s.id = sr.staff_id
				LEFT JOIN roles r ON sr.role_id = r.id
				WHERE s.id = ?
				GROUP BY s.id`,
			
			rolePermissions: `
				SELECT 
					r.id as role_id,
					r.name as role_name,
					pc.id as category_id,
					pc.name as category_name,
					pc.short_code as category_code,
					pg.id as group_id,
					pg.name as group_name,
					pg.short_code as group_code,
					rp.can_view,
					rp.can_add,
					rp.can_edit,
					rp.can_delete
				FROM staff_roles sr
				JOIN roles r ON sr.role_id = r.id
				JOIN roles_permissions rp ON r.id = rp.role_id
				JOIN permission_category pc ON rp.perm_cat_id = pc.id
				JOIN permission_group pg ON pc.perm_group_id = pg.id
				WHERE sr.staff_id = ?`,
			
			menus: `
				SELECT DISTINCT
					sm.*,
					pc.name as permission_category_name
				FROM staff_roles sr
				JOIN roles r ON sr.role_id = r.id
				JOIN roles_permissions rp ON r.id = rp.role_id
				JOIN permission_category pc ON rp.perm_cat_id = pc.id
				JOIN sidebar_menus sm ON sm.permission_category_id = pc.id
				WHERE sr.staff_id = ? AND rp.can_view = 1
				ORDER BY sm.display_order`,
			
			subMenus: `
				SELECT DISTINCT
					ssm.*,
					pc.name as permission_category_name
				FROM staff_roles sr
				JOIN roles r ON sr.role_id = r.id
				JOIN roles_permissions rp ON r.id = rp.role_id
				JOIN permission_category pc ON rp.perm_cat_id = pc.id
				JOIN sidebar_sub_menus ssm ON ssm.permission_category_id = pc.id
				WHERE sr.staff_id = ? AND rp.can_view = 1
				ORDER BY ssm.menu_id, ssm.display_order`
		};

		try {
			const [staff, permissions, menus, subMenus] = await Promise.all([
				db.query(queries.staff, [id]),
				db.query(queries.rolePermissions, [id]),
				db.query(queries.menus, [id]),
				db.query(queries.subMenus, [id])
			]);

			if (!staff[0]) return null;

			// Group permissions by role and permission group
			const permissionsByRole = permissions.reduce((acc, perm) => {
				const role = acc.find(r => r.role_id === perm.role_id);
				if (role) {
					const group = role.permission_groups.find(g => g.group_id === perm.group_id);
					if (group) {
						group.categories.push({
							id: perm.category_id,
							name: perm.category_name,
							code: perm.category_code,
							permissions: {
								can_view: perm.can_view,
								can_add: perm.can_add,
								can_edit: perm.can_edit,
								can_delete: perm.can_delete
							}
						});
					} else {
						role.permission_groups.push({
							group_id: perm.group_id,
							group_name: perm.group_name,
							group_code: perm.group_code,
							categories: [{
								id: perm.category_id,
								name: perm.category_name,
								code: perm.category_code,
								permissions: {
									can_view: perm.can_view,
									can_add: perm.can_add,
									can_edit: perm.can_edit,
									can_delete: perm.can_delete
								}
							}]
						});
					}
				} else {
					acc.push({
						role_id: perm.role_id,
						role_name: perm.role_name,
						permission_groups: [{
							group_id: perm.group_id,
							group_name: perm.group_name,
							group_code: perm.group_code,
							categories: [{
								id: perm.category_id,
								name: perm.category_name,
								code: perm.category_code,
								permissions: {
									can_view: perm.can_view,
									can_add: perm.can_add,
									can_edit: perm.can_edit,
									can_delete: perm.can_delete
								}
							}]
						}]
					});
				}
				return acc;
			}, []);

			// Group sub-menus by menu
			const menusWithSubs = menus.map(menu => ({
				...menu,
				sub_menus: subMenus.filter(sub => sub.menu_id === menu.id)
			}));

			return {
				staff: staff[0],
				roles: permissionsByRole,
				accessible_menus: menusWithSubs
			};
		} catch (error) {
			console.error('Error in getStaffDetails:', error);
			throw error;
		}
	}
}

module.exports = StaffModel;
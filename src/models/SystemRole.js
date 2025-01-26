const db = require('../../db');

class SystemRole {
	static async getAll() {
		return await db.query('SELECT * FROM roles ORDER BY id');
	}

	static async getById(id) {
		const result = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
		return result[0];
	}

	static async create(roleData) {
		const { name, description = null, is_active = true } = roleData;
		const result = await db.query(
			'INSERT INTO roles (name, description, is_active) VALUES (?, ?, ?)',
			[name, description, is_active]
		);
		return result.insertId;
	}

	static async update(id, roleData) {
		const { name, description, is_active } = roleData;
		return await db.query(
			'UPDATE roles SET name = ?, description = ?, is_active = ? WHERE id = ?',
			[name, description, is_active, id]
		);
	}

	static async delete(id) {
		return await db.query('DELETE FROM roles WHERE id = ?', [id]);
	}

	static async search(filters) {
		let query = 'SELECT * FROM roles WHERE 1=1';
		const params = [];

		if (filters.name) {
			query += ' AND name LIKE ?';
			params.push(`%${filters.name}%`);
		}

		if (filters.is_active !== undefined) {
			query += ' AND is_active = ?';
			params.push(filters.is_active);
		}

		return await db.query(query, params);
	}

	static async getRoleDetails(roleId) {
		const queries = {
			roleInfo: `
				SELECT * FROM roles WHERE id = ?
			`,
			permissions: `
				SELECT 
					rp.id as permission_id,
					rp.can_view,
					rp.can_add,
					rp.can_edit,
					rp.can_delete,
					pc.id as category_id,
					pc.name as category_name,
					pc.short_code as category_code,
					pg.id as group_id,
					pg.name as group_name,
					pg.short_code as group_code
				FROM roles_permissions rp
				JOIN permission_category pc ON rp.perm_cat_id = pc.id
				JOIN permission_group pg ON pc.perm_group_id = pg.id
				WHERE rp.role_id = ?
			`,
			menus: `
				SELECT 
					sm.*,
					pc.name as permission_category_name
				FROM sidebar_menus sm
				LEFT JOIN permission_category pc ON sm.permission_category_id = pc.id
				WHERE sm.permission_category_id IN (
					SELECT pc.id
					FROM roles_permissions rp
					JOIN permission_category pc ON rp.perm_cat_id = pc.id
					WHERE rp.role_id = ? AND rp.can_view = 1
				)
				ORDER BY sm.display_order
			`,
			subMenus: `
				SELECT 
					ssm.*,
					pc.name as permission_category_name
				FROM sidebar_sub_menus ssm
				LEFT JOIN permission_category pc ON ssm.permission_category_id = pc.id
				WHERE ssm.permission_category_id IN (
					SELECT pc.id
					FROM roles_permissions rp
					JOIN permission_category pc ON rp.perm_cat_id = pc.id
					WHERE rp.role_id = ? AND rp.can_view = 1
				)
				ORDER BY ssm.menu_id, ssm.display_order
			`
		};

		try {
			const [roleInfo, permissions, menus, subMenus] = await Promise.all([
				db.query(queries.roleInfo, [roleId]),
				db.query(queries.permissions, [roleId]),
				db.query(queries.menus, [roleId]),
				db.query(queries.subMenus, [roleId])
			]);

			if (!roleInfo[0]) {
				return null;
			}

			// Group permissions by permission group
			const permissionsByGroup = permissions.reduce((acc, perm) => {
				const group = acc.find(g => g.group_id === perm.group_id);
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
					acc.push({
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
				return acc;
			}, []);

			// Group sub-menus by menu
			const menusWithSubs = menus.map(menu => ({
				...menu,
				sub_menus: subMenus.filter(sub => sub.menu_id === menu.id)
			}));

			return {
				role: roleInfo[0],
				permissions_by_group: permissionsByGroup,
				menus: menusWithSubs
			};
		} catch (error) {
			console.error('Error in getRoleDetails:', error);
			throw error;
		}
	}
}

module.exports = SystemRole;
const db = require('../../db');

class ComplexDataModel {
	static async getStaffWithRolesAndPermissions(staffId) {
		const query = `
			SELECT 
				s.*,
				r.id as role_id,
				r.name as role_name,
				r.description as role_description,
				pc.id as category_id,
				pc.name as category_name,
				pc.short_code as category_code,
				pg.id as group_id,
				pg.name as group_name,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				sm.id as menu_id,
				sm.name as menu_name,
				sm.route_path,
				ssm.id as submenu_id,
				ssm.name as submenu_name,
				ssm.route_path as submenu_route
			FROM staff s
			LEFT JOIN staff_roles sr ON s.id = sr.staff_id
			LEFT JOIN roles r ON sr.role_id = r.id
			LEFT JOIN roles_permissions rp ON r.id = rp.role_id
			LEFT JOIN permission_category pc ON rp.perm_cat_id = pc.id
			LEFT JOIN permission_group pg ON pc.perm_group_id = pg.id
			LEFT JOIN sidebar_menus sm ON pc.id = sm.permission_category_id
			LEFT JOIN sidebar_sub_menus ssm ON sm.id = ssm.menu_id
			WHERE s.id = ?`;

		const results = await db.query(query, [staffId]);
		
		// Transform the flat results into a nested structure
		return this.transformResults(results);
	}

	static transformResults(results) {
		if (!results.length) return null;

		const staff = {
			id: results[0].id,
			name: results[0].name,
			email: results[0].email,
			roles: []
		};

		const roleMap = new Map();
		const menuMap = new Map();

		results.forEach(row => {
			// Process roles
			if (row.role_id && !roleMap.has(row.role_id)) {
				const role = {
					id: row.role_id,
					name: row.role_name,
					description: row.role_description,
					permissions: []
				};
				roleMap.set(row.role_id, role);
				staff.roles.push(role);
			}

			// Process permissions
			if (row.category_id) {
				const role = roleMap.get(row.role_id);
				if (role && !role.permissions.some(p => p.category_id === row.category_id)) {
					role.permissions.push({
						category_id: row.category_id,
						category_name: row.category_name,
						category_code: row.category_code,
						group_id: row.group_id,
						group_name: row.group_name,
						permissions: {
							can_view: row.can_view,
							can_add: row.can_add,
							can_edit: row.can_edit,
							can_delete: row.can_delete
						}
					});
				}
			}

			// Process menus
			if (row.menu_id) {
				if (!menuMap.has(row.menu_id)) {
					const menu = {
						id: row.menu_id,
						name: row.menu_name,
						route_path: row.route_path,
						sub_menus: []
					};
					menuMap.set(row.menu_id, menu);
					staff.menus = staff.menus || [];
					staff.menus.push(menu);
				}

				// Process sub-menus
				if (row.submenu_id) {
					const menu = menuMap.get(row.menu_id);
					if (!menu.sub_menus.some(sm => sm.id === row.submenu_id)) {
						menu.sub_menus.push({
							id: row.submenu_id,
							name: row.submenu_name,
							route_path: row.submenu_route
						});
					}
				}
			}
		});

		return staff;
	}

	static async getRoleWithFullDetails(roleId) {
		const query = `
			SELECT 
				r.*,
				pc.id as category_id,
				pc.name as category_name,
				pc.short_code as category_code,
				pg.id as group_id,
				pg.name as group_name,
				pg.short_code as group_code,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				COUNT(DISTINCT sr.staff_id) as assigned_staff_count
			FROM roles r
			LEFT JOIN roles_permissions rp ON r.id = rp.role_id
			LEFT JOIN permission_category pc ON rp.perm_cat_id = pc.id
			LEFT JOIN permission_group pg ON pc.perm_group_id = pg.id
			LEFT JOIN staff_roles sr ON r.id = sr.role_id
			WHERE r.id = ?
			GROUP BY r.id, pc.id, pg.id`;

		const results = await db.query(query, [roleId]);
		return this.transformRoleResults(results);
	}

	static transformRoleResults(results) {
		if (!results.length) return null;

		const role = {
			id: results[0].id,
			name: results[0].name,
			description: results[0].description,
			assigned_staff_count: results[0].assigned_staff_count,
			permission_groups: []
		};

		const groupMap = new Map();

		results.forEach(row => {
			if (row.group_id && !groupMap.has(row.group_id)) {
				const group = {
					id: row.group_id,
					name: row.group_name,
					code: row.group_code,
					categories: []
				};
				groupMap.set(row.group_id, group);
				role.permission_groups.push(group);
			}

			if (row.category_id) {
				const group = groupMap.get(row.group_id);
				if (group && !group.categories.some(c => c.id === row.category_id)) {
					group.categories.push({
						id: row.category_id,
						name: row.category_name,
						code: row.category_code,
						permissions: {
							can_view: row.can_view,
							can_add: row.can_add,
							can_edit: row.can_edit,
							can_delete: row.can_delete
						}
					});
				}
			}
		});

		return role;
	}

	static async getSuperAdminSystemDetails() {
		const query = `
			SELECT 
				s.id as staff_id, s.name as staff_name, s.email,
				r.id as role_id, r.name as role_name,
				pc.id as category_id, pc.name as category_name,
				pg.id as group_id, pg.name as group_name,
				rp.can_view, rp.can_add, rp.can_edit, rp.can_delete,
				sm.id as menu_id, sm.name as menu_name, sm.route_path,
				ssm.id as submenu_id, ssm.name as submenu_name, 
				ssm.route_path as submenu_route,
				rpt.id as template_id, rpt.name as template_name,
				rpt.permissions as template_permissions
			FROM staff s
			LEFT JOIN staff_roles sr ON s.id = sr.staff_id
			LEFT JOIN roles r ON sr.role_id = r.id
			LEFT JOIN roles_permissions rp ON r.id = rp.role_id
			LEFT JOIN permission_category pc ON rp.perm_cat_id = pc.id
			LEFT JOIN permission_group pg ON pc.perm_group_id = pg.id
			LEFT JOIN sidebar_menus sm ON pc.id = sm.permission_category_id
			LEFT JOIN sidebar_sub_menus ssm ON sm.id = ssm.menu_id
			LEFT JOIN role_permission_templates rpt ON r.id = rpt.id
			WHERE s.is_superadmin = 1`;

		const results = await db.query(query);
		return this.transformSuperAdminResults(results);
	}

	static transformSuperAdminResults(results) {
		if (!results.length) return null;

		const systemDetails = {
			staff_members: new Map(),
			roles: new Map(),
			permission_groups: new Map(),
			menus: new Map(),
			templates: new Map()
		};

		results.forEach(row => {
			// Process staff
			if (row.staff_id && !systemDetails.staff_members.has(row.staff_id)) {
				systemDetails.staff_members.set(row.staff_id, {
					id: row.staff_id,
					name: row.staff_name,
					email: row.email,
					roles: []
				});
			}

			// Process roles
			if (row.role_id && !systemDetails.roles.has(row.role_id)) {
				systemDetails.roles.set(row.role_id, {
					id: row.role_id,
					name: row.role_name,
					permissions: []
				});
			}

			// Process permissions and categories
			if (row.category_id) {
				const role = systemDetails.roles.get(row.role_id);
				if (role && !role.permissions.some(p => p.category_id === row.category_id)) {
					role.permissions.push({
						category_id: row.category_id,
						category_name: row.category_name,
						group_id: row.group_id,
						group_name: row.group_name,
						permissions: {
							can_view: row.can_view,
							can_add: row.can_add,
							can_edit: row.can_edit,
							can_delete: row.can_delete
						}
					});
				}
			}

			// Process menus
			if (row.menu_id && !systemDetails.menus.has(row.menu_id)) {
				systemDetails.menus.set(row.menu_id, {
					id: row.menu_id,
					name: row.menu_name,
					route_path: row.route_path,
					sub_menus: []
				});
			}

			// Process sub-menus
			if (row.submenu_id) {
				const menu = systemDetails.menus.get(row.menu_id);
				if (menu && !menu.sub_menus.some(sm => sm.id === row.submenu_id)) {
					menu.sub_menus.push({
						id: row.submenu_id,
						name: row.submenu_name,
						route_path: row.submenu_route
					});
				}
			}

			// Process templates
			if (row.template_id && !systemDetails.templates.has(row.template_id)) {
				systemDetails.templates.set(row.template_id, {
					id: row.template_id,
					name: row.template_name,
					permissions: JSON.parse(row.template_permissions)
				});
			}
		});

		// Convert Maps to arrays for the final response
		return {
			staff_members: Array.from(systemDetails.staff_members.values()),
			roles: Array.from(systemDetails.roles.values()),
			menus: Array.from(systemDetails.menus.values()),
			templates: Array.from(systemDetails.templates.values())
		};
	}
}

module.exports = ComplexDataModel;
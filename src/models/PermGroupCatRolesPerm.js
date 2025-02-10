const db = require('../../db');

class PermGroupCatRolesPerm {
	static async getAllCombined() {
		const query = `
			SELECT 
				r.id as role_id,
				r.name as role_name,
				rp.id as role_permission_id,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				pc.id as permission_category_id,
				pc.name as permission_category_name,
				pc.short_code as permission_category_code,
				pc.enable_view,
				pc.enable_add,
				pc.enable_edit,
				pc.enable_delete,
				pg.id as permission_group_id,
				pg.name as permission_group_name,
				pg.short_code as permission_group_code,
				pg.is_active as permission_group_active
			FROM roles r
			JOIN roles_permissions rp ON r.id = rp.role_id
			JOIN permission_category pc ON rp.perm_cat_id = pc.id
			JOIN permission_group pg ON pc.perm_group_id = pg.id
			ORDER BY pg.id, pc.id, r.id`;
		
		return await db.query(query);
	}

	static async getByRoleId(roleId) {
		const query = `
			SELECT 
				r.id as role_id,
				r.name as role_name,
				rp.id as role_permission_id,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				pc.id as permission_category_id,
				pc.name as permission_category_name,
				pc.short_code as permission_category_code,
				pc.enable_view,
				pc.enable_add,
				pc.enable_edit,
				pc.enable_delete,
				pg.id as permission_group_id,
				pg.name as permission_group_name,
				pg.short_code as permission_group_code,
				pg.is_active as permission_group_active
			FROM roles r
			JOIN roles_permissions rp ON r.id = rp.role_id
			JOIN permission_category pc ON rp.perm_cat_id = pc.id
			JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE r.id = ?
			ORDER BY pg.id, pc.id`;
		
		return await db.query(query, [roleId]);
	}

	static async getByGroupId(groupId) {
		const query = `
			SELECT 
				r.id as role_id,
				r.name as role_name,
				rp.id as role_permission_id,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				pc.id as permission_category_id,
				pc.name as permission_category_name,
				pc.short_code as permission_category_code,
				pc.enable_view,
				pc.enable_add,
				pc.enable_edit,
				pc.enable_delete,
				pg.id as permission_group_id,
				pg.name as permission_group_name,
				pg.short_code as permission_group_code,
				pg.is_active as permission_group_active
			FROM roles r
			JOIN roles_permissions rp ON r.id = rp.role_id
			JOIN permission_category pc ON rp.perm_cat_id = pc.id
			JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE pg.id = ?
			ORDER BY r.id, pc.id`;
		
		return await db.query(query, [groupId]);
	}

	static async getByCategoryId(categoryId) {
		const query = `
			SELECT 
				r.id as role_id,
				r.name as role_name,
				rp.id as role_permission_id,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				pc.id as permission_category_id,
				pc.name as permission_category_name,
				pc.short_code as permission_category_code,
				pc.enable_view,
				pc.enable_add,
				pc.enable_edit,
				pc.enable_delete,
				pg.id as permission_group_id,
				pg.name as permission_group_name,
				pg.short_code as permission_group_code,
				pg.is_active as permission_group_active
			FROM roles r
			JOIN roles_permissions rp ON r.id = rp.role_id
			JOIN permission_category pc ON rp.perm_cat_id = pc.id
			JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE pc.id = ?
			ORDER BY r.id`;
		
		return await db.query(query, [categoryId]);
	}

	static async updateRolePermissions(roleId, permissions) {
		const queries = permissions.map(permission => {
			const query = `
				UPDATE roles_permissions 
				SET can_view = ?, can_add = ?, can_edit = ?, can_delete = ?
				WHERE role_id = ? AND perm_cat_id = ?`;
			return db.query(query, [
				permission.can_view,
				permission.can_add,
				permission.can_edit,
				permission.can_delete,
				roleId,
				permission.permission_category_id
			]);
		});
		
		return Promise.all(queries);
	}

	/**
	 * Bulk update permissions for multiple roles
	 * @param {Array<Object>} rolePermissions - Array of role permission objects to update
	 * @param {number} rolePermissions[].role_id - The ID of the role
	 * @param {number} rolePermissions[].permission_category_id - The ID of the permission category
	 * @param {boolean} rolePermissions[].can_view - View permission flag
	 * @param {boolean} rolePermissions[].can_add - Add permission flag
	 * @param {boolean} rolePermissions[].can_edit - Edit permission flag
	 * @param {boolean} rolePermissions[].can_delete - Delete permission flag
	 * @returns {Promise<Array>} Results of the bulk update operations
	 * @example
	 * const rolePermissions = [
	 *   { role_id: 1, permission_category_id: 1, can_view: true, can_add: false, can_edit: true, can_delete: false }
	 * ];
	 * await PermGroupCatRolesPerm.bulkUpdateRolePermissions(rolePermissions);
	 */
	static async bulkUpdateRolePermissions(rolePermissions) {
		const queries = rolePermissions.map(permission => {
			const query = `
				UPDATE roles_permissions 
				SET can_view = ?, can_add = ?, can_edit = ?, can_delete = ?
				WHERE role_id = ? AND perm_cat_id = ?`;
			return db.query(query, [
				permission.can_view,
				permission.can_add,
				permission.can_edit,
				permission.can_delete,
				permission.role_id,
				permission.permission_category_id
			]);
		});
		
		return Promise.all(queries);
	}

	static async searchPermissions(filters, sort) {
		// Input validation
		if (filters && typeof filters !== 'object') {
			throw new Error('Filters must be an object');
		}

		if (sort && typeof sort !== 'object') {
			throw new Error('Sort must be an object');
		}

		// Validate filter values
		if (filters?.role_name && typeof filters.role_name !== 'string') {
			throw new Error('Role name must be a string');
		}

		if (filters?.permission_group_code && typeof filters.permission_group_code !== 'string') {
			throw new Error('Permission group code must be a string');
		}

		if (filters?.permission_category_code && typeof filters.permission_category_code !== 'string') {
			throw new Error('Permission category code must be a string');
		}

		if (filters?.has_permissions && typeof filters.has_permissions !== 'object') {
			throw new Error('has_permissions must be an object');
		}

		// Validate sort parameters
		const allowedSortFields = ['role_name', 'permission_category_name', 'permission_group_name'];
		const allowedSortOrders = ['ASC', 'DESC'];

		if (sort?.field && !allowedSortFields.includes(sort.field)) {
			throw new Error(`Invalid sort field. Allowed fields are: ${allowedSortFields.join(', ')}`);
		}

		if (sort?.order && !allowedSortOrders.includes(sort.order.toUpperCase())) {
			throw new Error('Sort order must be either ASC or DESC');
		}

		let query = `
			SELECT 
				r.id as role_id,
				r.name as role_name,
				rp.id as role_permission_id,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete,
				pc.id as permission_category_id,
				pc.name as permission_category_name,
				pc.short_code as permission_category_code,
				pc.enable_view,
				pc.enable_add,
				pc.enable_edit,
				pc.enable_delete,
				pg.id as permission_group_id,
				pg.name as permission_group_name,
				pg.short_code as permission_group_code,
				pg.is_active as permission_group_active
			FROM roles r
			JOIN roles_permissions rp ON r.id = rp.role_id
			JOIN permission_category pc ON rp.perm_cat_id = pc.id
			JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE 1=1`;

		const params = [];

		if (filters?.role_name) {
			query += ` AND r.name LIKE ?`;
			params.push(`%${filters.role_name}%`);
		}

		if (filters?.permission_group_code) {
			query += ` AND pg.short_code = ?`;
			params.push(filters.permission_group_code);
		}

		if (filters?.permission_category_code) {
			query += ` AND pc.short_code = ?`;
			params.push(filters.permission_category_code);
		}

		if (filters?.has_permissions) {
			if (filters.has_permissions.can_view === true) {
				query += ` AND rp.can_view = 1`;
			}
			if (filters.has_permissions.can_add === true) {
				query += ` AND rp.can_add = 1`;
			}
		}

		if (sort?.field && sort?.order) {
			const order = sort.order.toUpperCase();
			query += ` ORDER BY ${sort.field} ${order}`;
		}

		return await db.query(query, params);
	}

	/**
	 * Get statistics about roles, groups, categories and permissions
	 * @returns {Promise<Object>} Statistics object containing counts and usage data
	 * @property {number} total_roles - Total number of roles
	 * @property {number} total_permission_groups - Total number of permission groups
	 * @property {number} total_permission_categories - Total number of permission categories
	 * @property {Object} permissions_per_role - Number of permissions per role
	 * @property {Array} most_used_permissions - Top 5 most used permissions
	 * @example
	 * const stats = await PermGroupCatRolesPerm.getStatistics();
	 */
	static async getStatistics() {
		const queries = {
			roles: 'SELECT COUNT(*) as count FROM roles',
			groups: 'SELECT COUNT(*) as count FROM permission_group',
			categories: 'SELECT COUNT(*) as count FROM permission_category',
			permissionsPerRole: `
				SELECT r.name, COUNT(*) as count 
				FROM roles r
				JOIN roles_permissions rp ON r.id = rp.role_id
				GROUP BY r.id, r.name`,
			mostUsedPermissions: `
				SELECT pc.name as category, COUNT(*) as count
				FROM permission_category pc
				JOIN roles_permissions rp ON pc.id = rp.perm_cat_id
				GROUP BY pc.id, pc.name
				ORDER BY count DESC
				LIMIT 5`
		};

		const [roles, groups, categories, permissionsPerRole, mostUsedPermissions] = await Promise.all([
			db.query(queries.roles),
			db.query(queries.groups),
			db.query(queries.categories),
			db.query(queries.permissionsPerRole),
			db.query(queries.mostUsedPermissions)
		]);

		const permissionsPerRoleObj = {};
		permissionsPerRole.forEach(row => {
			permissionsPerRoleObj[row.name] = row.count;
		});

		return {
			total_roles: roles[0].count,
			total_permission_groups: groups[0].count,
			total_permission_categories: categories[0].count,
			permissions_per_role: permissionsPerRoleObj,
			most_used_permissions: mostUsedPermissions
		};
	}

	/**
	 * Validate if a role has all required permissions
	 * @param {number} roleId - The ID of the role to validate
	 * @param {Array<Object>} requiredPermissions - Array of required permission objects
	 * @param {number} requiredPermissions[].permission_category_id - Category ID for the permission
	 * @param {Array<string>} requiredPermissions[].required_actions - Array of required actions ('can_view', 'can_add', etc)
	 * @returns {Promise<boolean>} True if role has all required permissions, false otherwise
	 * @example
	 * const required = [
	 *   { permission_category_id: 1, required_actions: ['can_view', 'can_edit'] }
	 * ];
	 * const isValid = await PermGroupCatRolesPerm.validateRolePermissions(1, required);
	 */
	static async validateRolePermissions(roleId, requiredPermissions) {
		const query = `
			SELECT rp.perm_cat_id, rp.can_view, rp.can_add, rp.can_edit, rp.can_delete
			FROM roles_permissions rp
			WHERE rp.role_id = ? AND rp.perm_cat_id IN (?)`;

		const categoryIds = requiredPermissions.map(p => p.permission_category_id);
		const permissions = await db.query(query, [roleId, categoryIds]);

		const validation = requiredPermissions.map(required => {
			const existing = permissions.find(p => p.perm_cat_id === required.permission_category_id);
			if (!existing) return false;

			return required.required_actions.every(action => existing[action] === 1);
		});

		return validation.every(v => v === true);
	}

	/**
	 * Clone permissions from one role to another
	 * @param {number} sourceRoleId - The ID of the source role
	 * @param {number} targetRoleId - The ID of the target role
	 * @param {string|Array<string>} permissionsToClone - 'all' or array of permission types to clone
	 * @returns {Promise<Object>} Result of the clone operation
	 * @example
	 * // Clone all permissions
	 * await PermGroupCatRolesPerm.cloneRolePermissions(1, 2, 'all');
	 * // Clone specific permissions
	 * await PermGroupCatRolesPerm.cloneRolePermissions(1, 2, ['can_view', 'can_edit']);
	 */
	static async cloneRolePermissions(sourceRoleId, targetRoleId, permissionsToClone) {
		// First, get source role permissions
		const query = `
			SELECT * FROM roles_permissions
			WHERE role_id = ?`;
		const sourcePermissions = await db.query(query, [sourceRoleId]);

		// Delete existing permissions for target role
		await db.query('DELETE FROM roles_permissions WHERE role_id = ?', [targetRoleId]);

		// Prepare permissions to clone
		const permissions = sourcePermissions.map(perm => {
			const newPerm = { ...perm, role_id: targetRoleId };
			if (permissionsToClone !== 'all') {
				permissionsToClone.forEach(action => {
					newPerm[action] = perm[action];
				});
			}
			return newPerm;
		});

		// Insert cloned permissions
		const insertQuery = `
			INSERT INTO roles_permissions 
			(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete)
			VALUES ?`;
		
		const values = permissions.map(p => [
			p.role_id,
			p.perm_cat_id,
			p.can_view,
			p.can_add,
			p.can_edit,
			p.can_delete
		]);

		return await db.query(insertQuery, [values]);
	}

	/**
	 * Get a matrix of permissions across all roles and categories
	 * @returns {Promise<Object>} Permission matrix object
	 * @property {Array<string>} roles - Array of role names
	 * @property {Array<Object>} permission_categories - Array of categories with permissions per role
	 * @example
	 * const matrix = await PermGroupCatRolesPerm.getPermissionMatrix();
	 */
	static async getPermissionMatrix() {
		const queries = {
			roles: 'SELECT id, name FROM roles',
			categories: 'SELECT id, name FROM permission_category',
			permissions: `
				SELECT 
					r.id as role_id,
					r.name as role_name,
					pc.id as category_id,
					pc.name as category_name,
					rp.can_view,
					rp.can_add,
					rp.can_edit,
					rp.can_delete
				FROM roles r
				CROSS JOIN permission_category pc
				LEFT JOIN roles_permissions rp 
					ON r.id = rp.role_id 
					AND pc.id = rp.perm_cat_id
				ORDER BY r.id, pc.id`
		};

		const [roles, categories, permissions] = await Promise.all([
			db.query(queries.roles),
			db.query(queries.categories),
			db.query(queries.permissions)
		]);

		const matrix = {
			roles: roles.map(r => r.name),
			permission_categories: categories.map(cat => {
				const catPerms = {};
				roles.forEach(role => {
					const perm = permissions.find(
						p => p.role_id === role.id && p.category_id === cat.id
					);
					catPerms[role.name] = perm ? 
						Object.entries({
							view: perm.can_view,
							add: perm.can_add,
							edit: perm.can_edit,
							delete: perm.can_delete
						})
						.filter(([_, value]) => value === 1)
						.map(([key]) => key) : [];
				});
				return {
					id: cat.id,
					name: cat.name,
					permissions: catPerms
				};
			})
		};

		return matrix;
	}

	static async syncRolePermissions(template, roleIds, options) {
		// Get template permissions
		const templateQuery = `
			SELECT * FROM roles_permissions
			WHERE role_id = (
				SELECT id FROM roles 
				WHERE name = ? 
				LIMIT 1
			)`;
		const templatePerms = await db.query(templateQuery, [template]);

		const results = [];
		for (const roleId of roleIds) {
			if (options.sync_only_missing) {
				// Only add permissions that don't exist
				const existingQuery = `
					SELECT perm_cat_id 
					FROM roles_permissions 
					WHERE role_id = ?`;
				const existing = await db.query(existingQuery, [roleId]);
				const existingCatIds = existing.map(e => e.perm_cat_id);
				
				const newPerms = templatePerms.filter(
					tp => !existingCatIds.includes(tp.perm_cat_id)
				);

				if (newPerms.length > 0) {
					const insertQuery = `
						INSERT INTO roles_permissions 
						(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete)
						VALUES ?`;
					
					const values = newPerms.map(p => [
						roleId,
						p.perm_cat_id,
						p.can_view,
						p.can_add,
						p.can_edit,
						p.can_delete
					]);

					results.push(await db.query(insertQuery, [values]));
				}
			} else if (options.override_existing) {
				// Delete existing and insert new
				await db.query(
					'DELETE FROM roles_permissions WHERE role_id = ?',
					[roleId]
				);

				const insertQuery = `
					INSERT INTO roles_permissions 
					(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete)
					VALUES ?`;
				
				const values = templatePerms.map(p => [
					roleId,
					p.perm_cat_id,
					p.can_view,
					p.can_add,
					p.can_edit,
					p.can_delete
				]);

				results.push(await db.query(insertQuery, [values]));
			}
		}

		return results;
	}
static async getRoleComplete(roleId) {
	const queries = {
		roleInfo: `
			SELECT * FROM roles WHERE id = ?`,
		permissionsByGroup: `
			SELECT 
				pg.id as group_id,
				pg.name as group_name,
				pg.short_code as group_code,
				pc.id as category_id,
				pc.name as category_name,
				pc.short_code as category_code,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete
			FROM permission_group pg
			JOIN permission_category pc ON pc.perm_group_id = pg.id
			JOIN roles_permissions rp ON rp.perm_cat_id = pc.id
			WHERE rp.role_id = ?
			ORDER BY pg.id, pc.id`,
		permissionSummary: `
			SELECT 
				COUNT(DISTINCT rp.id) as total_permissions,
				COUNT(DISTINCT pg.id) as groups_with_access,
				COUNT(DISTINCT pc.id) as categories_with_access,
				SUM(CASE WHEN rp.can_view = 1 
					AND rp.can_add = 1 
					AND rp.can_edit = 1 
					AND rp.can_delete = 1 
					THEN 1 ELSE 0 END) as full_access_categories
			FROM roles_permissions rp
			JOIN permission_category pc ON rp.perm_cat_id = pc.id
			JOIN permission_group pg ON pc.perm_group_id = pg.id
			WHERE rp.role_id = ?`
	};

	const [roleInfo, permissionsByGroup, summary] = await Promise.all([
		db.query(queries.roleInfo, [roleId]),
		db.query(queries.permissionsByGroup, [roleId]),
		db.query(queries.permissionSummary, [roleId])
	]);

	if (!roleInfo[0]) {
		return null;
	}

	// Group permissions by permission group
	const groupedPermissions = permissionsByGroup.reduce((acc, curr) => {
		const group = acc.find(g => g.group_id === curr.group_id);
		if (group) {
			group.categories.push({
				category_id: curr.category_id,
				category_name: curr.category_name,
				category_code: curr.category_code,
				permissions: {
					can_view: curr.can_view,
					can_add: curr.can_add,
					can_edit: curr.can_edit,
					can_delete: curr.can_delete
				}
			});
		} else {
			acc.push({
				group_id: curr.group_id,
				group_name: curr.group_name,
				group_code: curr.group_code,
				categories: [{
					category_id: curr.category_id,
					category_name: curr.category_name,
					category_code: curr.category_code,
					permissions: {
						can_view: curr.can_view,
						can_add: curr.can_add,
						can_edit: curr.can_edit,
						can_delete: curr.can_delete
					}
				}]
			});
		}
		return acc;
	}, []);

	return {
		role: roleInfo[0],
		permissions_by_group: groupedPermissions,
		permission_summary: summary[0]
	};
}

static async getRoleAccessMap(roleId) {
	const query = `
		SELECT 
			pc.name as category_name,
			rp.can_view,
			rp.can_add,
			rp.can_edit,
			rp.can_delete
		FROM roles r
		JOIN roles_permissions rp ON r.id = rp.role_id
		JOIN permission_category pc ON rp.perm_cat_id = pc.id
		WHERE r.id = ?`;

	const permissions = await db.query(query, [roleId]);
	const roleInfo = await db.query('SELECT name FROM roles WHERE id = ?', [roleId]);

	if (!roleInfo[0]) {
		return null;
	}

	const accessLevels = {
		full_access: [],
		partial_access: {},
		no_access: []
	};

	permissions.forEach(perm => {
		const hasFullAccess = perm.can_view && perm.can_add && perm.can_edit && perm.can_delete;
		const hasNoAccess = !perm.can_view && !perm.can_add && !perm.can_edit && !perm.can_delete;

		if (hasFullAccess) {
			accessLevels.full_access.push(perm.category_name);
		} else if (!hasNoAccess) {
			const granted = [];
			const restricted = [];
			
			if (perm.can_view) granted.push('view');
			else restricted.push('view');
			if (perm.can_add) granted.push('add');
			else restricted.push('add');
			if (perm.can_edit) granted.push('edit');
			else restricted.push('edit');
			if (perm.can_delete) granted.push('delete');
			else restricted.push('delete');

			accessLevels.partial_access[perm.category_name] = {
				granted,
				restricted
			};
		} else {
			accessLevels.no_access.push(perm.category_name);
		}
	});

	return {
		role_name: roleInfo[0].name,
		access_levels: accessLevels,
		effective_permissions: {
			can_manage_users: accessLevels.full_access.includes('User Management'),
			can_configure_system: accessLevels.full_access.includes('System Settings'),
			can_manage_content: accessLevels.full_access.includes('Content Management') ? 
				'full' : (accessLevels.partial_access['Content Management'] ? 'partial' : 'none')
		}
	};
}

static async compareRoles(roleIds) {
    const query = `
        SELECT 
            r.id as role_id,
            r.name as role_name,
            pc.name as category_name,
            rp.can_view,
            rp.can_add,
            rp.can_edit,
            rp.can_delete
        FROM roles r
        JOIN roles_permissions rp ON r.id = rp.role_id
        JOIN permission_category pc ON rp.perm_cat_id = pc.id
        WHERE r.id IN (?)
        ORDER BY r.id, pc.name`;

    const permissions = await db.query(query, [roleIds]);

    // Group permissions by role
    const rolePermissions = {};
    permissions.forEach(perm => {
        if (!rolePermissions[perm.role_id]) {
            rolePermissions[perm.role_id] = {
                name: perm.role_name,
                permissions: {}
            };
        }
        
        rolePermissions[perm.role_id].permissions[perm.category_name] = 
            Object.entries({
                view: perm.can_view,
                add: perm.can_add,
                edit: perm.can_edit,
                delete: perm.can_delete
            })
            .filter(([_, value]) => value === 1)
            .map(([key]) => key);
    });

    // Find common permissions
    const commonPermissions = {};
    const differences = {};
    
    Object.keys(rolePermissions).forEach(roleId => {
        differences[`role_${roleId}`] = {
            unique_permissions: {}
        };
    });

    // Get all category names
    const allCategories = [...new Set(
        permissions.map(p => p.category_name)
    )];

    allCategories.forEach(category => {
        const rolePerms = Object.values(rolePermissions).map(
            rp => rp.permissions[category] || []
        );

        // Find common actions for this category
        const common = rolePerms.reduce((a, b) => 
            a.filter(action => b.includes(action))
        );

        if (common.length > 0) {
            commonPermissions[category] = common;
        }

        // Find unique permissions for each role
        Object.entries(rolePermissions).forEach(([roleId, rp]) => {
            const unique = (rp.permissions[category] || [])
                .filter(action => !common.includes(action));
            
            if (unique.length > 0) {
                differences[`role_${roleId}`].unique_permissions[category] = 
                    unique.length === 4 ? ['all'] : unique;
            }
        });
    });

    return {
        common_permissions: commonPermissions,
        differences
    };
}

static async getRolePermissionTree(roleId) {
	const query = `
		SELECT 
			pg.id as group_id,
			pg.name as group_name,
			pg.short_code as group_code,
			pc.id as category_id,
			pc.name as category_name,
			pc.short_code as category_code,
			rp.can_view,
			rp.can_add,
			rp.can_edit,
			rp.can_delete
		FROM permission_group pg
		JOIN permission_category pc ON pc.perm_group_id = pg.id
		JOIN roles_permissions rp ON rp.perm_cat_id = pc.id
		WHERE rp.role_id = ?
		ORDER BY pg.id, pc.id`;

	const [permissions, roleInfo] = await Promise.all([
		db.query(query, [roleId]),
		db.query('SELECT name FROM roles WHERE id = ?', [roleId])
	]);

	if (!roleInfo[0]) {
		return null;
	}

	// Group by permission group
	const permissionTree = permissions.reduce((acc, curr) => {
		const group = acc.find(g => g.group.id === curr.group_id);
		const permissions = Object.entries({
			view: curr.can_view,
			add: curr.can_add,
			edit: curr.can_edit,
			delete: curr.can_delete
		})
		.filter(([_, value]) => value === 1)
		.map(([key]) => key);

		const accessLevel = permissions.length === 4 ? 'full' : 
						  permissions.length === 0 ? 'none' : 'partial';

		if (group) {
			group.categories.push({
				id: curr.category_id,
				name: curr.category_name,
				code: curr.category_code,
				access_level: accessLevel,
				permissions
			});
		} else {
			acc.push({
				group: {
					id: curr.group_id,
					name: curr.group_name,
					code: curr.group_code
				},
				categories: [{
					id: curr.category_id,
					name: curr.category_name,
					code: curr.category_code,
					access_level: accessLevel,
					permissions
				}]
			});
		}
		return acc;
	}, []);

	return {
		role_name: roleInfo[0].name,
		permission_tree: permissionTree
	};
}

static async getPermissionHistory(roleId, fromDate, toDate) {
	const query = `
		SELECT 
			rp.role_id,
			r.name as role_name,
			pc.name as permission_category,
			rp.can_view,
			rp.can_add,
			rp.can_edit,
			rp.can_delete,
			rp.created_at,
			rp.updated_at
		FROM roles_permissions rp
		JOIN roles r ON r.id = rp.role_id
		JOIN permission_category pc ON pc.id = rp.perm_cat_id
		WHERE rp.role_id = ?
		AND (rp.created_at BETWEEN ? AND ? OR rp.updated_at BETWEEN ? AND ?)
		ORDER BY rp.updated_at DESC`;

	return await db.query(query, [roleId, fromDate, toDate, fromDate, toDate]);
}

static async getRoleAccessSummary(roleId) {
	const query = `
		SELECT 
			r.id as role_id,
			r.name as role_name,
			COUNT(DISTINCT pc.perm_group_id) as total_groups_accessed,
			COUNT(DISTINCT rp.perm_cat_id) as total_categories_accessed,
			SUM(rp.can_view) as total_view_permissions,
			SUM(rp.can_add) as total_add_permissions,
			SUM(rp.can_edit) as total_edit_permissions,
			SUM(rp.can_delete) as total_delete_permissions,
			COUNT(CASE WHEN rp.can_view = 1 AND rp.can_add = 1 
				AND rp.can_edit = 1 AND rp.can_delete = 1 
				THEN 1 END) as full_access_count
		FROM roles r
		LEFT JOIN roles_permissions rp ON r.id = rp.role_id
		LEFT JOIN permission_category pc ON pc.id = rp.perm_cat_id
		WHERE r.id = ?
		GROUP BY r.id`;

	const result = await db.query(query, [roleId]);
	return result[0] || null;
}

static async findConflictingPermissions(roleId) {
	const query = `
		SELECT 
			pc1.name as category1,
			pc2.name as category2,
			pg1.name as group1,
			pg2.name as group2
		FROM roles_permissions rp1
		JOIN roles_permissions rp2 ON rp1.role_id = rp2.role_id
		JOIN permission_category pc1 ON pc1.id = rp1.perm_cat_id
		JOIN permission_category pc2 ON pc2.id = rp2.perm_cat_id
		JOIN permission_group pg1 ON pg1.id = pc1.perm_group_id
		JOIN permission_group pg2 ON pg2.id = pc2.perm_group_id
		WHERE rp1.role_id = ?
		AND pc1.id < pc2.id
		AND (
			(pc1.enable_view = 0 AND rp1.can_view = 1) OR
			(pc1.enable_add = 0 AND rp1.can_add = 1) OR
			(pc1.enable_edit = 0 AND rp1.can_edit = 1) OR
			(pc1.enable_delete = 0 AND rp1.can_delete = 1) OR
			(pc2.enable_view = 0 AND rp2.can_view = 1) OR
			(pc2.enable_add = 0 AND rp2.can_add = 1) OR
			(pc2.enable_edit = 0 AND rp2.can_edit = 1) OR
			(pc2.enable_delete = 0 AND rp2.can_delete = 1)
		)`;

	return await db.query(query, [roleId]);
}

static async findMissingPermissions(roleId) {
	const query = `
		WITH RolePermissions AS (
			SELECT 
				pc.id as category_id,
				pc.name as category_name,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete
			FROM roles_permissions rp
			JOIN permission_category pc ON pc.id = rp.perm_cat_id
			WHERE rp.role_id = ?
		),
		MissingPermissions AS (
			SELECT 
				pc.id as category_id,
				pc.name as category_name,
				pc.enable_view,
				pc.enable_add,
				pc.enable_edit,
				pc.enable_delete
			FROM permission_category pc
			LEFT JOIN RolePermissions rp ON pc.id = rp.category_id
			WHERE rp.category_id IS NULL
			AND (pc.enable_view = 1 OR pc.enable_add = 1 
				OR pc.enable_edit = 1 OR pc.enable_delete = 1)
		)
		SELECT * FROM MissingPermissions`;

	return await db.query(query, [roleId]);
}

static async getPermissionDependencies(categoryId) {
	const query = `
		WITH RECURSIVE PermissionDeps AS (
			SELECT 
				pc1.id,
				pc1.name,
				pc2.id as depends_on_id,
				pc2.name as depends_on_name
			FROM permission_category pc1
			JOIN permission_category pc2 ON pc1.perm_group_id = pc2.perm_group_id
			WHERE pc1.id = ?
			
			UNION ALL
			
			SELECT 
				pd.id,
				pd.name,
				pc.id,
				pc.name
			FROM PermissionDeps pd
			JOIN permission_category pc ON pd.depends_on_id = pc.id
		)
		SELECT DISTINCT * FROM PermissionDeps`;

	return await db.query(query, [categoryId]);
}
}

module.exports = PermGroupCatRolesPerm;



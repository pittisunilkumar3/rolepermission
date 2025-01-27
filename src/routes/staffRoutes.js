const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const db = require('../../db');

// Get staff with all related details
router.get('/with-details/:id', async (req, res) => {
	try {
		// Get staff details
		const [staff] = await db.query(`
			SELECT * FROM staff WHERE id = ?
		`, [req.params.id]);

		if (!staff || staff.length === 0) {
			return res.status(404).json({ message: 'Staff member not found' });
		}

		// Get staff roles
		const [staffRoles] = await db.query(`
			SELECT r.* 
			FROM roles r
			INNER JOIN staff_roles sr ON r.id = sr.role_id
			WHERE sr.staff_id = ?
		`, [req.params.id]);

		// Get role permissions
		const roleIds = staffRoles.map(role => role.id);
		const [rolePermissions] = await db.query(`
			SELECT rp.*, r.name as role_name
			FROM roles_permissions rp
			INNER JOIN roles r ON r.id = rp.role_id
			WHERE rp.role_id IN (?)
		`, [roleIds]);

		// Get menus and submenus
		const [menus] = await db.query(`
			SELECT 
				m.*, 
				GROUP_CONCAT(
					JSON_OBJECT(
						'id', sm.id,
						'menu', sm.menu,
						'key', sm.key,
						'url', sm.url,
						'level', sm.level,
						'access_permissions', sm.access_permissions
					)
				) as submenus
			FROM sidebar_menus m
			LEFT JOIN sidebar_sub_menus sm ON m.id = sm.sidebar_menu_id
			WHERE m.is_active = 1
			GROUP BY m.id
			ORDER BY m.level, sm.level
		`);

		// Format response
		const staffDetails = {
			...staff[0],
			roles: staffRoles.map(role => ({
				...role,
				permissions: rolePermissions.filter(perm => perm.role_id === role.id)
			})),
			menus: menus.map(menu => ({
				...menu,
				submenus: menu.submenus ? JSON.parse(`[${menu.submenus}]`) : []
			}))
		};

		res.json({
			success: true,
			data: staffDetails
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ 
			success: false,
			error: error.message 
		});
	}
});

// Get all staff with their details
router.get('/all-with-details', async (req, res) => {
	try {
		// Get all staff
		const [allStaff] = await db.query('SELECT * FROM staff WHERE is_active = 1');

		if (!allStaff || allStaff.length === 0) {
			return res.json({
				success: true,
				data: []
			});
		}

		// Get all roles and staff roles
		const [staffRoles] = await db.query(`
			SELECT sr.staff_id, r.* 
			FROM roles r
			INNER JOIN staff_roles sr ON r.id = sr.role_id
			WHERE sr.staff_id IN (?)
		`, [allStaff.map(s => s.id)]);

		// Get all role permissions
		const [rolePermissions] = await db.query(`
			SELECT rp.*, r.name as role_name
			FROM roles_permissions rp
			INNER JOIN roles r ON r.id = rp.role_id
			WHERE rp.role_id IN (?)
		`, [staffRoles.map(r => r.id)]);

		// Get all menus and submenus
		const [menus] = await db.query(`
			SELECT 
				m.*, 
				GROUP_CONCAT(
					JSON_OBJECT(
						'id', sm.id,
						'menu', sm.menu,
						'key', sm.key,
						'url', sm.url,
						'level', sm.level,
						'access_permissions', sm.access_permissions
					)
				) as submenus
			FROM sidebar_menus m
			LEFT JOIN sidebar_sub_menus sm ON m.id = sm.sidebar_menu_id
			WHERE m.is_active = 1
			GROUP BY m.id
			ORDER BY m.level, sm.level
		`);

		// Format response
		const staffList = allStaff.map(staff => ({
			...staff,
			roles: staffRoles
				.filter(role => role.staff_id === staff.id)
				.map(role => ({
					...role,
					permissions: rolePermissions.filter(perm => perm.role_id === role.id)
				})),
			menus: menus.map(menu => ({
				...menu,
				submenus: menu.submenus ? JSON.parse(`[${menu.submenus}]`) : []
			}))
		}));

		res.json({
			success: true,
			data: staffList
		});
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ 
			success: false,
			error: error.message 
		});
	}
});

// Create single staff member
router.post('/', async (req, res) => {
	try {
		const result = await Staff.create(req.body);
		res.status(201).json({ message: 'Staff member created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create staff members
router.post('/bulk', async (req, res) => {
	try {
		const result = await Staff.bulkCreate(req.body.staff);
		res.status(201).json({ message: 'Staff members created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single staff member
router.get('/:id', async (req, res) => {
	try {
		const [staff] = await Staff.findById(req.params.id);
		if (staff.length === 0) {
			return res.status(404).json({ message: 'Staff member not found' });
		}
		res.json({ data: staff[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all staff members
router.get('/', async (req, res) => {
	try {
		const [staff] = await Staff.findAll();
		res.json({ data: staff });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single staff member
router.put('/:id', async (req, res) => {
	try {
		await Staff.update(req.params.id, req.body);
		res.json({ message: 'Staff member updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update staff members
router.put('/bulk/update', async (req, res) => {
	try {
		await Staff.bulkUpdate(req.body.staff);
		res.json({ message: 'Staff members updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single staff member
router.delete('/:id', async (req, res) => {
	try {
		await Staff.delete(req.params.id);
		res.json({ message: 'Staff member deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete staff members
router.delete('/bulk/delete', async (req, res) => {
	try {
		await Staff.bulkDelete(req.body.ids);
		res.json({ message: 'Staff members deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
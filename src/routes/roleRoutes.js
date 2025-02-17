const express = require('express');
const router = express.Router();
const RoleModel = require('../models/RoleModel');

// Get all roles
router.get('/', async (req, res) => {
	try {
		const roles = await RoleModel.getAllRoles();
		res.json({ success: true, data: roles });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get role by ID
router.get('/:id', async (req, res) => {
	try {
		const role = await RoleModel.getRoleById(req.params.id);
		if (!role) {
			return res.status(404).json({ success: false, error: 'Role not found' });
		}
		res.json({ success: true, data: role });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create role
router.post('/', async (req, res) => {
	try {
		const roleId = await RoleModel.createRole(req.body);
		const role = await RoleModel.getRoleById(roleId);
		res.status(201).json({ success: true, data: role });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update role
router.put('/:id', async (req, res) => {
	try {
		await RoleModel.updateRole(req.params.id, req.body);
		const role = await RoleModel.getRoleById(req.params.id);
		if (!role) {
			return res.status(404).json({ success: false, error: 'Role not found' });
		}
		res.json({ success: true, data: role });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete role
router.delete('/:id', async (req, res) => {
	try {
		await RoleModel.deleteRole(req.params.id);
		res.json({ success: true, message: 'Role deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;

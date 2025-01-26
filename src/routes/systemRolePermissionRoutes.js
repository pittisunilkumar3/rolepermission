const express = require('express');
const router = express.Router();
const SystemRolePermission = require('../models/SystemRolePermission');

// Get all permissions by role ID
router.get('/role/:roleId', async (req, res) => {
	try {
		const permissions = await SystemRolePermission.getAllByRoleId(req.params.roleId);
		res.json({ success: true, data: permissions });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create new permission
router.post('/', async (req, res) => {
	try {
		const permissionId = await SystemRolePermission.create(req.body);
		res.status(201).json({ 
			success: true, 
			data: { id: permissionId }
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update permission
router.put('/:id', async (req, res) => {
	try {
		await SystemRolePermission.update(req.params.id, req.body);
		res.json({ success: true, message: 'Permission updated successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete permission
router.delete('/:id', async (req, res) => {
	try {
		await SystemRolePermission.delete(req.params.id);
		res.json({ success: true, message: 'Permission deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete all permissions for a role
router.delete('/role/:roleId', async (req, res) => {
	try {
		await SystemRolePermission.deleteByRoleId(req.params.roleId);
		res.json({ success: true, message: 'Role permissions deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get permissions by category
router.get('/role/:roleId/category/:categoryId', async (req, res) => {
	try {
		const permissions = await SystemRolePermission.getPermissionsByCategory(
			req.params.roleId,
			req.params.categoryId
		);
		res.json({ success: true, data: permissions });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
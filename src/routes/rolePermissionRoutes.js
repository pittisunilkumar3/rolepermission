const express = require('express');
const router = express.Router();
const RolePermission = require('../models/RolePermission');

// Create single role permission
router.post('/', async (req, res) => {
	try {
		const result = await RolePermission.create(req.body);
		res.status(201).json({ message: 'Role permission created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create role permissions
router.post('/bulk', async (req, res) => {
	try {
		const result = await RolePermission.bulkCreate(req.body.permissions);
		res.status(201).json({ message: 'Role permissions created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single role permission
router.get('/:id', async (req, res) => {
	try {
		const [permission] = await RolePermission.findById(req.params.id);
		if (permission.length === 0) {
			return res.status(404).json({ message: 'Role permission not found' });
		}
		res.json({ data: permission[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all role permissions
router.get('/', async (req, res) => {
	try {
		const [permissions] = await RolePermission.findAll();
		res.json({ data: permissions });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single role permission
router.put('/:id', async (req, res) => {
	try {
		await RolePermission.update(req.params.id, req.body);
		res.json({ message: 'Role permission updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update role permissions
router.put('/bulk/update', async (req, res) => {
	try {
		await RolePermission.bulkUpdate(req.body.permissions);
		res.json({ message: 'Role permissions updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single role permission
router.delete('/:id', async (req, res) => {
	try {
		await RolePermission.delete(req.params.id);
		res.json({ message: 'Role permission deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete role permissions
router.delete('/bulk/delete', async (req, res) => {
	try {
		await RolePermission.bulkDelete(req.body.ids);
		res.json({ message: 'Role permissions deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
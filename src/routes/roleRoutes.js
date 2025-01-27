const express = require('express');
const router = express.Router();
const Role = require('../models/Role');

// Create single role
router.post('/', async (req, res) => {
	try {
		const result = await Role.create(req.body);
		res.status(201).json({ message: 'Role created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create roles
router.post('/bulk', async (req, res) => {
	try {
		const result = await Role.bulkCreate(req.body.roles);
		res.status(201).json({ message: 'Roles created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single role
router.get('/:id', async (req, res) => {
	try {
		const [role] = await Role.findById(req.params.id);
		if (role.length === 0) {
			return res.status(404).json({ message: 'Role not found' });
		}
		res.json({ data: role[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all roles
router.get('/', async (req, res) => {
	try {
		const [roles] = await Role.findAll();
		res.json({ data: roles });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get super admin role
router.get('/super-admin/details', async (req, res) => {
	try {
		const [role] = await Role.findSuperAdmin();
		if (role.length === 0) {
			return res.status(404).json({ message: 'Super admin role not found' });
		}
		res.json({ data: role[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single role
router.put('/:id', async (req, res) => {
	try {
		await Role.update(req.params.id, req.body);
		res.json({ message: 'Role updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update roles
router.put('/bulk/update', async (req, res) => {
	try {
		await Role.bulkUpdate(req.body.roles);
		res.json({ message: 'Roles updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single role
router.delete('/:id', async (req, res) => {
	try {
		await Role.delete(req.params.id);
		res.json({ message: 'Role deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete roles
router.delete('/bulk/delete', async (req, res) => {
	try {
		await Role.bulkDelete(req.body.ids);
		res.json({ message: 'Roles deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
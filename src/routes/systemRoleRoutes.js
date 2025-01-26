const express = require('express');
const router = express.Router();
const SystemRole = require('../models/SystemRole');

// Get all roles
router.get('/', async (req, res) => {
	try {
		const roles = await SystemRole.getAll();
		res.json({ success: true, data: roles });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get role by ID
router.get('/:id', async (req, res) => {
	try {
		const role = await SystemRole.getById(req.params.id);
		if (!role) {
			return res.status(404).json({ success: false, error: 'Role not found' });
		}
		res.json({ success: true, data: role });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create new role
router.post('/', async (req, res) => {
	try {
		const roleId = await SystemRole.create(req.body);
		const role = await SystemRole.getById(roleId);
		res.status(201).json({ success: true, data: role });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update role
router.put('/:id', async (req, res) => {
	try {
		await SystemRole.update(req.params.id, req.body);
		const role = await SystemRole.getById(req.params.id);
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
		await SystemRole.delete(req.params.id);
		res.json({ success: true, message: 'Role deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Search roles
router.post('/search', async (req, res) => {
	try {
		const roles = await SystemRole.search(req.body);
		res.json({ success: true, data: roles });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get comprehensive role details
router.get('/:id/details', async (req, res) => {
    try {
        const roleDetails = await SystemRole.getRoleDetails(req.params.id);
        if (!roleDetails) {
            return res.status(404).json({ success: false, error: 'Role not found' });
        }
        res.json({ success: true, data: roleDetails });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
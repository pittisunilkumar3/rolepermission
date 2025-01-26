const express = require('express');
const router = express.Router();
const SystemPermissionGroup = require('../models/SystemPermissionGroup');

// Get all permission groups
router.get('/', async (req, res) => {
	try {
		const groups = await SystemPermissionGroup.getAll();
		res.json({ success: true, data: groups });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get permission group by ID
router.get('/:id', async (req, res) => {
	try {
		const group = await SystemPermissionGroup.getById(req.params.id);
		if (!group) {
			return res.status(404).json({ success: false, error: 'Permission group not found' });
		}
		res.json({ success: true, data: group });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get permission group with categories
router.get('/:id/with-categories', async (req, res) => {
	try {
		const group = await SystemPermissionGroup.getWithCategories(req.params.id);
		if (!group) {
			return res.status(404).json({ success: false, error: 'Permission group not found' });
		}
		res.json({ success: true, data: group });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create new permission group
router.post('/', async (req, res) => {
	try {
		const groupId = await SystemPermissionGroup.create(req.body);
		const group = await SystemPermissionGroup.getById(groupId);
		res.status(201).json({ success: true, data: group });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update permission group
router.put('/:id', async (req, res) => {
	try {
		await SystemPermissionGroup.update(req.params.id, req.body);
		const group = await SystemPermissionGroup.getById(req.params.id);
		if (!group) {
			return res.status(404).json({ success: false, error: 'Permission group not found' });
		}
		res.json({ success: true, data: group });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete permission group
router.delete('/:id', async (req, res) => {
	try {
		await SystemPermissionGroup.delete(req.params.id);
		res.json({ success: true, message: 'Permission group deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Search permission groups
router.post('/search', async (req, res) => {
	try {
		const groups = await SystemPermissionGroup.search(req.body);
		res.json({ success: true, data: groups });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
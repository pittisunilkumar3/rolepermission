const express = require('express');
const router = express.Router();
const PermissionGroup = require('../models/PermissionGroup');

// Create single permission group
router.post('/', async (req, res) => {
	try {
		const result = await PermissionGroup.create(req.body);
		res.status(201).json({ message: 'Permission group created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create permission groups
router.post('/bulk', async (req, res) => {
	try {
		const result = await PermissionGroup.bulkCreate(req.body.groups);
		res.status(201).json({ message: 'Permission groups created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single permission group
router.get('/:id', async (req, res) => {
	try {
		const [group] = await PermissionGroup.findById(req.params.id);
		if (group.length === 0) {
			return res.status(404).json({ message: 'Permission group not found' });
		}
		res.json({ data: group[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all permission groups
router.get('/', async (req, res) => {
	try {
		const [groups] = await PermissionGroup.findAll();
		res.json({ data: groups });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single permission group
router.put('/:id', async (req, res) => {
	try {
		await PermissionGroup.update(req.params.id, req.body);
		res.json({ message: 'Permission group updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update permission groups
router.put('/bulk/update', async (req, res) => {
	try {
		await PermissionGroup.bulkUpdate(req.body.groups);
		res.json({ message: 'Permission groups updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single permission group
router.delete('/:id', async (req, res) => {
	try {
		await PermissionGroup.delete(req.params.id);
		res.json({ message: 'Permission group deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete permission groups
router.delete('/bulk/delete', async (req, res) => {
	try {
		await PermissionGroup.bulkDelete(req.body.ids);
		res.json({ message: 'Permission groups deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
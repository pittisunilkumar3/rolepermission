const express = require('express');
const router = express.Router();
const PermissionGroupModel = require('../models/PermissionGroupModel');

// Get all permission groups
router.get('/', async (req, res) => {
	try {
		const groups = await PermissionGroupModel.getAllGroups();
		res.json({ success: true, data: groups });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get permission group by ID
router.get('/:id', async (req, res) => {
	try {
		const group = await PermissionGroupModel.getGroupById(req.params.id);
		if (!group) {
			return res.status(404).json({ success: false, error: 'Permission group not found' });
		}
		res.json({ success: true, data: group });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get permission group with full details
router.get('/:id/details', async (req, res) => {
	try {
		const groupDetails = await PermissionGroupModel.getGroupWithDetails(req.params.id);
		if (!groupDetails) {
			return res.status(404).json({ success: false, error: 'Permission group not found' });
		}
		res.json({ success: true, data: groupDetails });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create permission group
router.post('/', async (req, res) => {
	try {
		const groupId = await PermissionGroupModel.createGroup(req.body);
		const group = await PermissionGroupModel.getGroupById(groupId);
		res.status(201).json({ success: true, data: group });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update permission group
router.put('/:id', async (req, res) => {
	try {
		await PermissionGroupModel.updateGroup(req.params.id, req.body);
		const group = await PermissionGroupModel.getGroupById(req.params.id);
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
		await PermissionGroupModel.deleteGroup(req.params.id);
		res.json({ success: true, message: 'Permission group deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;

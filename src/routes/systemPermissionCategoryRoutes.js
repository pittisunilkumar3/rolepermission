const express = require('express');
const router = express.Router();
const SystemPermissionCategory = require('../models/SystemPermissionCategory');

// Get all permission categories
router.get('/', async (req, res) => {
	try {
		const categories = await SystemPermissionCategory.getAll();
		res.json({ success: true, data: categories });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get permission category by ID
router.get('/:id', async (req, res) => {
	try {
		const category = await SystemPermissionCategory.getById(req.params.id);
		if (!category) {
			return res.status(404).json({ success: false, error: 'Permission category not found' });
		}
		res.json({ success: true, data: category });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get categories by group ID
router.get('/group/:groupId', async (req, res) => {
	try {
		const categories = await SystemPermissionCategory.getByGroupId(req.params.groupId);
		res.json({ success: true, data: categories });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create new permission category
router.post('/', async (req, res) => {
	try {
		const categoryId = await SystemPermissionCategory.create(req.body);
		const category = await SystemPermissionCategory.getById(categoryId);
		res.status(201).json({ success: true, data: category });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update permission category
router.put('/:id', async (req, res) => {
	try {
		await SystemPermissionCategory.update(req.params.id, req.body);
		const category = await SystemPermissionCategory.getById(req.params.id);
		if (!category) {
			return res.status(404).json({ success: false, error: 'Permission category not found' });
		}
		res.json({ success: true, data: category });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete permission category
router.delete('/:id', async (req, res) => {
	try {
		await SystemPermissionCategory.delete(req.params.id);
		res.json({ success: true, message: 'Permission category deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Search permission categories
router.post('/search', async (req, res) => {
	try {
		const categories = await SystemPermissionCategory.search(req.body);
		res.json({ success: true, data: categories });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
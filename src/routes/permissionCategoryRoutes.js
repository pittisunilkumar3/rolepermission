const express = require('express');
const router = express.Router();
const PermissionCategory = require('../models/PermissionCategory');

// Create single permission category
router.post('/', async (req, res) => {
	try {
		const result = await PermissionCategory.create(req.body);
		res.status(201).json({ message: 'Permission category created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create permission categories
router.post('/bulk', async (req, res) => {
	try {
		const result = await PermissionCategory.bulkCreate(req.body.categories);
		res.status(201).json({ message: 'Permission categories created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single permission category
router.get('/:id', async (req, res) => {
	try {
		const [category] = await PermissionCategory.findById(req.params.id);
		if (category.length === 0) {
			return res.status(404).json({ message: 'Permission category not found' });
		}
		res.json({ data: category[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all permission categories
router.get('/', async (req, res) => {
	try {
		const [categories] = await PermissionCategory.findAll();
		res.json({ data: categories });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single permission category
router.put('/:id', async (req, res) => {
	try {
		await PermissionCategory.update(req.params.id, req.body);
		res.json({ message: 'Permission category updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update permission categories
router.put('/bulk/update', async (req, res) => {
	try {
		await PermissionCategory.bulkUpdate(req.body.categories);
		res.json({ message: 'Permission categories updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single permission category
router.delete('/:id', async (req, res) => {
	try {
		await PermissionCategory.delete(req.params.id);
		res.json({ message: 'Permission category deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete permission categories
router.delete('/bulk/delete', async (req, res) => {
	try {
		await PermissionCategory.bulkDelete(req.body.ids);
		res.json({ message: 'Permission categories deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
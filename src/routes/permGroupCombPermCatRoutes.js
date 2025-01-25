const express = require('express');
const router = express.Router();
const PermGroupCombPermCat = require('../models/PermGroupCombPermCat');

// Get all permission categories by group ID
router.get('/group/:groupId/categories', async (req, res) => {
	try {
		const categories = await PermGroupCombPermCat.getAllByGroupId(req.params.groupId);
		res.json(categories);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single permission category by group ID and category ID
router.get('/group/:groupId/categories/:catId', async (req, res) => {
	try {
		const category = await PermGroupCombPermCat.getOneByGroupId(
			req.params.groupId,
			req.params.catId
		);
		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}
		res.json(category);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete all permission categories by group ID
router.delete('/group/:groupId/categories', async (req, res) => {
	try {
		await PermGroupCombPermCat.deleteByGroupId(req.params.groupId);
		res.json({ message: 'Categories deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single permission category by group ID and category ID
router.delete('/group/:groupId/categories/:catId', async (req, res) => {
	try {
		await PermGroupCombPermCat.deleteOneByGroupId(
			req.params.groupId,
			req.params.catId
		);
		res.json({ message: 'Category deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update all permission categories by group ID
router.put('/group/:groupId/categories', async (req, res) => {
	try {
		await PermGroupCombPermCat.updateByGroupId(req.params.groupId, req.body);
		res.json({ message: 'Categories updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single permission category by group ID and category ID
router.put('/group/:groupId/categories/:catId', async (req, res) => {
	try {
		await PermGroupCombPermCat.updateOneByGroupId(
			req.params.groupId,
			req.params.catId,
			req.body
		);
		res.json({ message: 'Category updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create single permission category
router.post('/group/:groupId/categories', async (req, res) => {
	try {
		await PermGroupCombPermCat.createOne(req.params.groupId, req.body);
		res.status(201).json({ message: 'Category created successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create multiple permission categories
router.post('/group/:groupId/categories/bulk', async (req, res) => {
	try {
		await PermGroupCombPermCat.createMultiple(req.params.groupId, req.body.categories);
		res.status(201).json({ message: 'Categories created successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
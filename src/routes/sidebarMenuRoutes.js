const express = require('express');
const router = express.Router();
const SidebarMenu = require('../models/SidebarMenu');

// Create single sidebar menu
router.post('/', async (req, res) => {
	try {
		const result = await SidebarMenu.create(req.body);
		res.status(201).json({ message: 'Sidebar menu created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create sidebar menus
router.post('/bulk', async (req, res) => {
	try {
		const result = await SidebarMenu.bulkCreate(req.body.menus);
		res.status(201).json({ message: 'Sidebar menus created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single sidebar menu
router.get('/:id', async (req, res) => {
	try {
		const [menu] = await SidebarMenu.findById(req.params.id);
		if (menu.length === 0) {
			return res.status(404).json({ message: 'Sidebar menu not found' });
		}
		res.json({ data: menu[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all sidebar menus
router.get('/', async (req, res) => {
	try {
		const [menus] = await SidebarMenu.findAll();
		res.json({ data: menus });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single sidebar menu
router.put('/:id', async (req, res) => {
	try {
		await SidebarMenu.update(req.params.id, req.body);
		res.json({ message: 'Sidebar menu updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update sidebar menus
router.put('/bulk/update', async (req, res) => {
	try {
		await SidebarMenu.bulkUpdate(req.body.menus);
		res.json({ message: 'Sidebar menus updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single sidebar menu
router.delete('/:id', async (req, res) => {
	try {
		await SidebarMenu.delete(req.params.id);
		res.json({ message: 'Sidebar menu deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete sidebar menus
router.delete('/bulk/delete', async (req, res) => {
	try {
		await SidebarMenu.bulkDelete(req.body.ids);
		res.json({ message: 'Sidebar menus deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
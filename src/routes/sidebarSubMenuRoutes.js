const express = require('express');
const router = express.Router();
const SidebarSubMenu = require('../models/SidebarSubMenu');

// Create single sidebar sub-menu
router.post('/', async (req, res) => {
	try {
		const result = await SidebarSubMenu.create(req.body);
		res.status(201).json({ message: 'Sidebar sub-menu created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create sidebar sub-menus
router.post('/bulk', async (req, res) => {
	try {
		const result = await SidebarSubMenu.bulkCreate(req.body.subMenus);
		res.status(201).json({ message: 'Sidebar sub-menus created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single sidebar sub-menu
router.get('/:id', async (req, res) => {
	try {
		const [subMenu] = await SidebarSubMenu.findById(req.params.id);
		if (subMenu.length === 0) {
			return res.status(404).json({ message: 'Sidebar sub-menu not found' });
		}
		res.json({ data: subMenu[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all sidebar sub-menus
router.get('/', async (req, res) => {
	try {
		const [subMenus] = await SidebarSubMenu.findAll();
		res.json({ data: subMenus });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get sub-menus by menu ID
router.get('/by-menu/:menuId', async (req, res) => {
	try {
		const [subMenus] = await SidebarSubMenu.findByMenuId(req.params.menuId);
		res.json({ data: subMenus });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single sidebar sub-menu
router.put('/:id', async (req, res) => {
	try {
		await SidebarSubMenu.update(req.params.id, req.body);
		res.json({ message: 'Sidebar sub-menu updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update sidebar sub-menus
router.put('/bulk/update', async (req, res) => {
	try {
		await SidebarSubMenu.bulkUpdate(req.body.subMenus);
		res.json({ message: 'Sidebar sub-menus updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single sidebar sub-menu
router.delete('/:id', async (req, res) => {
	try {
		await SidebarSubMenu.delete(req.params.id);
		res.json({ message: 'Sidebar sub-menu deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete sidebar sub-menus
router.delete('/bulk/delete', async (req, res) => {
	try {
		await SidebarSubMenu.bulkDelete(req.body.ids);
		res.json({ message: 'Sidebar sub-menus deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
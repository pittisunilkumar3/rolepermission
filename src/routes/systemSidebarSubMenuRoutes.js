const express = require('express');
const router = express.Router();
const SystemSidebarSubMenu = require('../models/SystemSidebarSubMenu');

// Get all sub-menus
router.get('/', async (req, res) => {
	try {
		const subMenus = await SystemSidebarSubMenu.getAll();
		res.json({ success: true, data: subMenus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get sub-menu by ID
router.get('/:id', async (req, res) => {
	try {
		const subMenu = await SystemSidebarSubMenu.getById(req.params.id);
		if (!subMenu) {
			return res.status(404).json({ success: false, error: 'Sub-menu not found' });
		}
		res.json({ success: true, data: subMenu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get sub-menus by menu ID
router.get('/menu/:menuId', async (req, res) => {
	try {
		const subMenus = await SystemSidebarSubMenu.getByMenuId(req.params.menuId);
		res.json({ success: true, data: subMenus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create new sub-menu
router.post('/', async (req, res) => {
	try {
		const subMenuId = await SystemSidebarSubMenu.create(req.body);
		const subMenu = await SystemSidebarSubMenu.getById(subMenuId);
		res.status(201).json({ success: true, data: subMenu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update sub-menu
router.put('/:id', async (req, res) => {
	try {
		await SystemSidebarSubMenu.update(req.params.id, req.body);
		const subMenu = await SystemSidebarSubMenu.getById(req.params.id);
		if (!subMenu) {
			return res.status(404).json({ success: false, error: 'Sub-menu not found' });
		}
		res.json({ success: true, data: subMenu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete sub-menu
router.delete('/:id', async (req, res) => {
	try {
		await SystemSidebarSubMenu.delete(req.params.id);
		res.json({ success: true, message: 'Sub-menu deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete all sub-menus for a menu
router.delete('/menu/:menuId', async (req, res) => {
	try {
		await SystemSidebarSubMenu.deleteByMenuId(req.params.menuId);
		res.json({ success: true, message: 'Sub-menus deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update display order
router.put('/order/update', async (req, res) => {
	try {
		await SystemSidebarSubMenu.updateDisplayOrder(req.body);
		res.json({ success: true, message: 'Display order updated successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Search sub-menus
router.post('/search', async (req, res) => {
	try {
		const subMenus = await SystemSidebarSubMenu.search(req.body);
		res.json({ success: true, data: subMenus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const SystemSidebarMenu = require('../models/SystemSidebarMenu');

// Get all menus
router.get('/', async (req, res) => {
	try {
		const menus = await SystemSidebarMenu.getAll();
		res.json({ success: true, data: menus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get menu by ID
router.get('/:id', async (req, res) => {
	try {
		const menu = await SystemSidebarMenu.getById(req.params.id);
		if (!menu) {
			return res.status(404).json({ success: false, error: 'Menu not found' });
		}
		res.json({ success: true, data: menu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get menu with sub-menus
router.get('/:id/with-submenus', async (req, res) => {
	try {
		const menu = await SystemSidebarMenu.getWithSubMenus(req.params.id);
		if (!menu) {
			return res.status(404).json({ success: false, error: 'Menu not found' });
		}
		res.json({ success: true, data: menu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get all menus with sub-menus
router.get('/all/with-submenus', async (req, res) => {
	try {
		const menus = await SystemSidebarMenu.getAllWithSubMenus();
		res.json({ success: true, data: menus });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create new menu
router.post('/', async (req, res) => {
	try {
		const menuId = await SystemSidebarMenu.create(req.body);
		const menu = await SystemSidebarMenu.getById(menuId);
		res.status(201).json({ success: true, data: menu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update menu
router.put('/:id', async (req, res) => {
	try {
		await SystemSidebarMenu.update(req.params.id, req.body);
		const menu = await SystemSidebarMenu.getById(req.params.id);
		if (!menu) {
			return res.status(404).json({ success: false, error: 'Menu not found' });
		}
		res.json({ success: true, data: menu });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete menu
router.delete('/:id', async (req, res) => {
	try {
		await SystemSidebarMenu.delete(req.params.id);
		res.json({ success: true, message: 'Menu deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update display order
router.put('/order/update', async (req, res) => {
	try {
		await SystemSidebarMenu.updateDisplayOrder(req.body);
		res.json({ success: true, message: 'Display order updated successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
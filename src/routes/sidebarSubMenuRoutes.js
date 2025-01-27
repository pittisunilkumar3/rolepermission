const express = require('express');
const router = express.Router();
const SidebarSubMenu = require('../models/SidebarSubMenu');
const db = require('../../db');

// Database connection and schema check
router.get('/db-check', async (req, res) => {
	try {
		// Check database connection
		const [connection] = await db.query('SELECT 1 as connected');
		console.log('Database connection:', connection);

		// Get all tables in the database
		const [tables] = await db.query(`
			SHOW TABLES FROM ${process.env.DB_NAME}
		`);
		console.log('Database tables:', tables);

		// Get sample data from both tables
		const [menus] = await db.query('SELECT * FROM sidebar_menus LIMIT 5');
		const [submenus] = await db.query('SELECT * FROM sidebar_sub_menus LIMIT 5');

		res.json({
			success: true,
			connection: connection,
			tables: tables,
			sample_data: {
				menus: menus,
				submenus: submenus
			}
		});
	} catch (error) {
		console.error('Database check error:', error);
		res.status(500).json({
			error: 'Database check failed',
			details: error.message
		});
	}
});

// Get all menus with their submenus
router.get('/with-menu-details', async (req, res) => {
	try {
		// Get all menus first
		const [menus] = await db.query(`
			SELECT * FROM sidebar_menus 
			WHERE is_active = 1
			ORDER BY level
		`);

		if (!menus || menus.length === 0) {
			return res.json({
				success: true,
				message: 'No menus found',
				data: []
			});
		}

		// Get all submenus in a single query
		const [allSubmenus] = await db.query(`
			SELECT * FROM sidebar_sub_menus 
			WHERE is_active = 1
			ORDER BY level
		`);

		// Create the response structure
		const menuData = menus.map(menu => ({
			id: menu.id,
			menu: menu.menu,
			icon: menu.icon,
			activate_menu: menu.activate_menu,
			lang_key: menu.lang_key,
			level: menu.level,
			sidebar_display: menu.sidebar_display,
			submenus: allSubmenus.filter(sub => sub.sidebar_menu_id === menu.id)
		}));

		return res.json({
			success: true,
			data: menuData
		});

	} catch (error) {
		console.error('Error:', error);
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch menu data',
			error: error.message
		});
	}
});



// Database check endpoint
router.get('/check-data', async (req, res) => {
	try {
		// Check menus table
		const [menus] = await db.query('SELECT * FROM sidebar_menus');
		console.log('Menus found:', menus.length);

		// Check submenus table
		const [submenus] = await db.query('SELECT * FROM sidebar_sub_menus');
		console.log('Submenus found:', submenus.length);

		res.json({
			success: true,
			data: {
				menus: menus,
				submenus: submenus
			}
		});
	} catch (error) {
		console.error('Database check error:', error);
		res.status(500).json({
			error: 'Database check failed',
			details: error.message
		});
	}
});




// Test route for debugging
router.get('/test/:menuId', async (req, res) => {
	try {
		console.log('Starting /test endpoint with menuId:', req.params.menuId);
		
		// Test database connection
		const [testConn] = await db.query('SELECT 1 as test');
		console.log('Database connection:', testConn);
		
		// Check if tables exist
		const [tables] = await db.query(`
			SELECT table_name 
			FROM information_schema.tables 
			WHERE table_schema = '${process.env.DB_NAME}'
			AND table_name IN ('sidebar_menus', 'sidebar_sub_menus')
		`);
		console.log('Tables:', tables);
		
		// Check submenu table
		const [submenus] = await db.query(`
			SELECT * FROM sidebar_sub_menus 
			WHERE sidebar_menu_id = ?
		`, [req.params.menuId]);
		console.log('Submenus found:', submenus);
		
		// Get the menu details
		const [menu] = await db.query(`
			SELECT * FROM sidebar_menus 
			WHERE id = ?
		`, [req.params.menuId]);
		console.log('Menu found:', menu);
		
		res.json({
			success: true,
			tables,
			menu: menu[0],
			submenus: submenus,
			connectionTest: testConn
		});
	} catch (error) {
		console.error('Test endpoint error:', error);
		res.status(500).json({
			error: 'Test failed',
			details: error.message
		});
	}
});




// Create single sidebar sub-menu
router.post('/', async (req, res) => {
	try {
		console.log('Creating new sidebar sub-menu with data:', req.body);
		const result = await SidebarSubMenu.create(req.body);
		console.log('Created sidebar sub-menu:', result);
		res.status(201).json({ message: 'Sidebar sub-menu created successfully', data: result });
	} catch (error) {
		console.error('Error creating sidebar sub-menu:', error);
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

// Get sub-menus by menu ID
router.get('/by-menu/:menuId', async (req, res) => {
	try {
		console.log('Starting /by-menu endpoint with menuId:', req.params.menuId);
		
		if (!req.params.menuId || isNaN(req.params.menuId)) {
			return res.status(400).json({ 
				error: 'Invalid menu ID provided' 
			});
		}

		const [subMenus] = await SidebarSubMenu.findByMenuId(req.params.menuId);
		
		res.json({ 
			success: true,
			data: subMenus || [] 
		});
	} catch (error) {
		console.error('Error getting submenus:', error);
		res.status(500).json({ 
			error: 'Failed to get submenus',
			details: error.message 
		});
	}
});

// Get all sidebar sub-menus
router.get('/', async (req, res) => {
	try {
		console.log('Starting GET / endpoint to fetch all sub-menus');
		const [subMenus] = await SidebarSubMenu.findAll();
		console.log('Found sub-menus:', subMenus?.length || 0);
		res.json({ data: subMenus });
	} catch (error) {
		console.error('Error fetching all sub-menus:', error);
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
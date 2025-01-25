const express = require('express');
const cors = require('cors');
const db = require('./db');
const Role = require('./src/models/Role');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionGroupRoutes = require('./src/routes/permissionGroupRoutes');
const permissionCategoryRoutes = require('./src/routes/permissionCategoryRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const permGroupCombPermCatRoutes = require('./src/routes/permGroupCombPermCatRoutes');
const sidebarMenuRoutes = require('./src/routes/sidebarMenuRoutes');
const sidebarSubMenuRoutes = require('./src/routes/sidebarSubMenuRoutes');
const staffRoleRoutes = require('./src/routes/staffRoleRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const runMigrations = require('./src/migrations/migrationRunner');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database and run migrations
(async () => {
	try {
		await runMigrations();
		console.log('Database initialization completed');
	} catch (error) {
		console.error('Database initialization failed:', error);
		process.exit(1);
	}
})();

// API routes
app.use('/api/roles', roleRoutes);
app.use('/api/permission-groups', permissionGroupRoutes);
app.use('/api/permission-categories', permissionCategoryRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api', permGroupCombPermCatRoutes);
app.use('/api/sidebar-menus', sidebarMenuRoutes);
app.use('/api/sidebar-sub-menus', sidebarSubMenuRoutes);
app.use('/api/staff-roles', staffRoleRoutes);
app.use('/api/staff', staffRoutes);

// Test API endpoint
app.get('/api/test', async (req, res) => {
	try {
		const [result] = await db.query('SELECT 1 as test');
		res.json({ message: 'Database connection successful', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
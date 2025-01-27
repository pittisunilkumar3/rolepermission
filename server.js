const express = require('express');
const cors = require('cors');
const db = require('./db');
const sidebarMenuRoutes = require('./src/routes/sidebarMenuRoutes');
const sidebarSubMenuRoutes = require('./src/routes/sidebarSubMenuRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionGroupRoutes = require('./src/routes/permissionGroupRoutes');
const permissionCategoryRoutes = require('./src/routes/permissionCategoryRoutes');
const rolePermissionRoutes = require('./src/routes/rolePermissionRoutes');
const permGroupCombPermCatRoutes = require('./src/routes/permGroupCombPermCatRoutes');
const staffRoleRoutes = require('./src/routes/staffRoleRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sidebar routes first
app.use('/api/sidebar-menus', sidebarMenuRoutes);
app.use('/api/sidebar-sub-menus', sidebarSubMenuRoutes);

// Other routes
app.use('/api/roles', roleRoutes);
app.use('/api/permission-groups', permissionGroupRoutes);
app.use('/api/permission-categories', permissionCategoryRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api', permGroupCombPermCatRoutes);
app.use('/api/staff-roles', staffRoleRoutes);
app.use('/api/staff', staffRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('Global error:', err);
	res.status(500).json({
		success: false,
		message: 'Internal server error',
		error: err.message
	});
});

const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});


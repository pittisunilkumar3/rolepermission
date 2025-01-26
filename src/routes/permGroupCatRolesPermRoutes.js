const express = require('express');
const router = express.Router();
const PermGroupCatRolesPerm = require('../models/PermGroupCatRolesPerm');

// Get all combined permissions data
router.get('/combined-permissions', async (req, res) => {
	try {
		const data = await PermGroupCatRolesPerm.getAllCombined();
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get combined permissions data by role ID
router.get('/combined-permissions/role/:roleId', async (req, res) => {
	try {
		const data = await PermGroupCatRolesPerm.getByRoleId(req.params.roleId);
		if (!data || data.length === 0) {
			return res.status(404).json({ message: 'No permissions found for this role' });
		}
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get combined permissions data by group ID
router.get('/combined-permissions/group/:groupId', async (req, res) => {
	try {
		const data = await PermGroupCatRolesPerm.getByGroupId(req.params.groupId);
		if (!data || data.length === 0) {
			return res.status(404).json({ message: 'No permissions found for this group' });
		}
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get combined permissions data by category ID
router.get('/combined-permissions/category/:categoryId', async (req, res) => {
	try {
		const data = await PermGroupCatRolesPerm.getByCategoryId(req.params.categoryId);
		if (!data || data.length === 0) {
			return res.status(404).json({ message: 'No permissions found for this category' });
		}
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update role permissions
router.put('/combined-permissions/role/:roleId', async (req, res) => {
	try {
		await PermGroupCatRolesPerm.updateRolePermissions(req.params.roleId, req.body.permissions);
		res.json({ message: 'Role permissions updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update role permissions
router.put('/combined-permissions/bulk-update', async (req, res) => {
	try {
		await PermGroupCatRolesPerm.bulkUpdateRolePermissions(req.body.role_permissions);
		res.json({ message: 'Role permissions updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Search permissions
router.post('/combined-permissions/search', async (req, res) => {
    try {
        const data = await PermGroupCatRolesPerm.searchPermissions(req.body.filters, req.body.sort);
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get permission statistics
router.get('/combined-permissions/statistics', async (req, res) => {
    try {
        const data = await PermGroupCatRolesPerm.getStatistics();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Validate role permissions
router.post('/combined-permissions/validate/role/:roleId', async (req, res) => {
    try {
        const isValid = await PermGroupCatRolesPerm.validateRolePermissions(
            req.params.roleId,
            req.body.required_permissions
        );
        res.json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clone role permissions
router.post('/combined-permissions/clone', async (req, res) => {
    try {
        await PermGroupCatRolesPerm.cloneRolePermissions(
            req.body.source_role_id,
            req.body.target_role_id,
            req.body.permissions_to_clone
        );
        res.json({ message: 'Role permissions cloned successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get permission matrix
router.get('/combined-permissions/matrix', async (req, res) => {
    try {
        const data = await PermGroupCatRolesPerm.getPermissionMatrix();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync role permissions
router.post('/combined-permissions/sync', async (req, res) => {
    try {
        await PermGroupCatRolesPerm.syncRolePermissions(
            req.body.template,
            req.body.roles,
            req.body.sync_options
        );
        res.json({ message: 'Role permissions synchronized successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get complete role information
router.get('/combined-permissions/role/:roleId/complete', async (req, res) => {
	try {
		const data = await PermGroupCatRolesPerm.getRoleComplete(req.params.roleId);
		if (!data) {
			return res.status(404).json({ message: 'Role not found' });
		}
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get role access map
router.get('/combined-permissions/role/:roleId/access-map', async (req, res) => {
	try {
		const data = await PermGroupCatRolesPerm.getRoleAccessMap(req.params.roleId);
		if (!data) {
			return res.status(404).json({ message: 'Role not found' });
		}
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
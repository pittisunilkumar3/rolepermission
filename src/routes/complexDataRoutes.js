const express = require('express');
const router = express.Router();
const ComplexDataModel = require('../models/ComplexDataModel');

// Get staff with roles, permissions and menus
router.get('/staff/:id/full-details', async (req, res) => {
	try {
		const data = await ComplexDataModel.getStaffWithRolesAndPermissions(req.params.id);
		if (!data) {
			return res.status(404).json({ success: false, error: 'Staff not found' });
		}
		res.json({ success: true, data });
	} catch (error) {
		console.error('Error in getStaffWithRolesAndPermissions:', error);
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get role with full details including permissions and staff count
router.get('/roles/:id/full-details', async (req, res) => {
	try {
		const data = await ComplexDataModel.getRoleWithFullDetails(req.params.id);
		if (!data) {
			return res.status(404).json({ success: false, error: 'Role not found' });
		}
		res.json({ success: true, data });
	} catch (error) {
		console.error('Error in getRoleWithFullDetails:', error);
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get superadmin system details
router.get('/superadmin/system-details', async (req, res) => {
	try {
		const data = await ComplexDataModel.getSuperAdminSystemDetails();
		if (!data) {
			return res.status(404).json({ success: false, error: 'No superadmin data found' });
		}
		res.json({ success: true, data });
	} catch (error) {
		console.error('Error in getSuperAdminSystemDetails:', error);
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;
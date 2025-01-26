const express = require('express');
const router = express.Router();
const StaffModel = require('../models/StaffModel');

// Get all staff
router.get('/', async (req, res) => {
	try {
		const staff = await StaffModel.getAllStaff();
		res.json({ success: true, data: staff });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get staff by ID
router.get('/:id', async (req, res) => {
	try {
		const staff = await StaffModel.getStaffById(req.params.id);
		if (!staff) {
			return res.status(404).json({ success: false, error: 'Staff not found' });
		}
		res.json({ success: true, data: staff });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get staff with roles
router.get('/:id/roles', async (req, res) => {
	try {
		const staffWithRoles = await StaffModel.getStaffWithRoles(req.params.id);
		if (!staffWithRoles) {
			return res.status(404).json({ success: false, error: 'Staff not found' });
		}
		res.json({ success: true, data: staffWithRoles });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Create staff
router.post('/', async (req, res) => {
	try {
		const staffId = await StaffModel.createStaff(req.body);
		const staff = await StaffModel.getStaffById(staffId);
		res.status(201).json({ success: true, data: staff });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Update staff
router.put('/:id', async (req, res) => {
	try {
		await StaffModel.updateStaff(req.params.id, req.body);
		const staff = await StaffModel.getStaffById(req.params.id);
		if (!staff) {
			return res.status(404).json({ success: false, error: 'Staff not found' });
		}
		res.json({ success: true, data: staff });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Delete staff
router.delete('/:id', async (req, res) => {
	try {
		await StaffModel.deleteStaff(req.params.id);
		res.json({ success: true, message: 'Staff deleted successfully' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Get staff details with roles, permissions and menus
router.get('/:id/details', async (req, res) => {
	try {
		const staffDetails = await StaffModel.getStaffDetails(req.params.id);
		if (!staffDetails) {
			return res.status(404).json({ success: false, error: 'Staff not found' });
		}
		res.json({ success: true, data: staffDetails });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

module.exports = router;

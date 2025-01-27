const express = require('express');
const router = express.Router();
const StaffRole = require('../models/StaffRole');

// Create single staff role
router.post('/', async (req, res) => {
	try {
		const result = await StaffRole.create(req.body);
		res.status(201).json({ message: 'Staff role created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create staff roles
router.post('/bulk', async (req, res) => {
	try {
		const result = await StaffRole.bulkCreate(req.body.staffRoles);
		res.status(201).json({ message: 'Staff roles created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single staff role
router.get('/:id', async (req, res) => {
	try {
		const [role] = await StaffRole.findById(req.params.id);
		if (role.length === 0) {
			return res.status(404).json({ message: 'Staff role not found' });
		}
		res.json({ data: role[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all staff roles
router.get('/', async (req, res) => {
	try {
		const [roles] = await StaffRole.findAll();
		res.json({ data: roles });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get roles by staff ID
router.get('/by-staff/:staffId', async (req, res) => {
	try {
		const [roles] = await StaffRole.findByStaffId(req.params.staffId);
		res.json({ data: roles });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get staff by role ID
router.get('/by-role/:roleId', async (req, res) => {
	try {
		const [staff] = await StaffRole.findByRoleId(req.params.roleId);
		res.json({ data: staff });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single staff role
router.put('/:id', async (req, res) => {
	try {
		await StaffRole.update(req.params.id, req.body);
		res.json({ message: 'Staff role updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update staff roles
router.put('/bulk/update', async (req, res) => {
	try {
		await StaffRole.bulkUpdate(req.body.staffRoles);
		res.json({ message: 'Staff roles updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single staff role
router.delete('/:id', async (req, res) => {
	try {
		await StaffRole.delete(req.params.id);
		res.json({ message: 'Staff role deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete staff roles
router.delete('/bulk/delete', async (req, res) => {
	try {
		await StaffRole.bulkDelete(req.body.ids);
		res.json({ message: 'Staff roles deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete roles by staff ID
router.delete('/by-staff/:staffId', async (req, res) => {
	try {
		await StaffRole.deleteByStaffId(req.params.staffId);
		res.json({ message: 'Staff roles deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete staff by role ID
router.delete('/by-role/:roleId', async (req, res) => {
	try {
		await StaffRole.deleteByRoleId(req.params.roleId);
		res.json({ message: 'Staff roles deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
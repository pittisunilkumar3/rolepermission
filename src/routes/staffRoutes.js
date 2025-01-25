const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Create single staff member
router.post('/', async (req, res) => {
	try {
		const result = await Staff.create(req.body);
		res.status(201).json({ message: 'Staff member created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk create staff members
router.post('/bulk', async (req, res) => {
	try {
		const result = await Staff.bulkCreate(req.body.staff);
		res.status(201).json({ message: 'Staff members created successfully', data: result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get single staff member
router.get('/:id', async (req, res) => {
	try {
		const [staff] = await Staff.findById(req.params.id);
		if (staff.length === 0) {
			return res.status(404).json({ message: 'Staff member not found' });
		}
		res.json({ data: staff[0] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all staff members
router.get('/', async (req, res) => {
	try {
		const [staff] = await Staff.findAll();
		res.json({ data: staff });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update single staff member
router.put('/:id', async (req, res) => {
	try {
		await Staff.update(req.params.id, req.body);
		res.json({ message: 'Staff member updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk update staff members
router.put('/bulk/update', async (req, res) => {
	try {
		await Staff.bulkUpdate(req.body.staff);
		res.json({ message: 'Staff members updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete single staff member
router.delete('/:id', async (req, res) => {
	try {
		await Staff.delete(req.params.id);
		res.json({ message: 'Staff member deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Bulk delete staff members
router.delete('/bulk/delete', async (req, res) => {
	try {
		await Staff.bulkDelete(req.body.ids);
		res.json({ message: 'Staff members deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;
const express = require('express');
const router = express.Router();
const RolePermissionTemplate = require('../models/RolePermissionTemplate');

// Create template
router.post('/templates', async (req, res) => {
	try {
		const { name, permissions } = req.body;
		await RolePermissionTemplate.createTemplate(name, permissions);
		res.status(201).json({ message: 'Template created successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all templates
router.get('/templates', async (req, res) => {
	try {
		const templates = await RolePermissionTemplate.getAllTemplates();
		res.json({ data: templates });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get template by name
router.get('/templates/:name', async (req, res) => {
	try {
		const template = await RolePermissionTemplate.getTemplate(req.params.name);
		if (!template) {
			return res.status(404).json({ message: 'Template not found' });
		}
		res.json({ data: template });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update template
router.put('/templates/:name', async (req, res) => {
	try {
		const { permissions } = req.body;
		await RolePermissionTemplate.updateTemplate(req.params.name, permissions);
		res.json({ message: 'Template updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete template
router.delete('/templates/:name', async (req, res) => {
	try {
		await RolePermissionTemplate.deleteTemplate(req.params.name);
		res.json({ message: 'Template deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Apply template to role
router.post('/templates/:name/apply/:roleId', async (req, res) => {
	try {
		await RolePermissionTemplate.applyTemplate(req.params.name, req.params.roleId);
		res.json({ message: 'Template applied successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Export template to role
router.post('/templates/:name/export/:roleId', async (req, res) => {
	try {
		await RolePermissionTemplate.exportTemplateToRole(req.params.name, req.params.roleId);
		res.json({ message: 'Template exported successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Clone template
router.post('/templates/:name/clone', async (req, res) => {
    try {
        const { new_name, modify_permissions } = req.body;
        await RolePermissionTemplate.cloneTemplate(
            req.params.name,
            new_name,
            modify_permissions
        );
        res.json({ message: 'Template cloned successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Import role permissions as template
router.post('/templates/import/role/:roleId', async (req, res) => {
    try {
        const { template_name, include_categories } = req.body;
        await RolePermissionTemplate.importFromRole(
            req.params.roleId,
            template_name,
            { include_categories }
        );
        res.json({ message: 'Template created from role successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get template versions
router.get('/templates/:name/versions', async (req, res) => {
    try {
        const versions = await RolePermissionTemplate.getVersions(req.params.name);
        res.json({ data: versions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific template version
router.get('/templates/:name/versions/:versionId', async (req, res) => {
    try {
        const version = await RolePermissionTemplate.getVersion(
            req.params.name,
            req.params.versionId
        );
        if (!version) {
            return res.status(404).json({ message: 'Version not found' });
        }
        res.json({ data: version });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Revert to specific version
router.post('/templates/:name/versions/:versionId/revert', async (req, res) => {
    try {
        await RolePermissionTemplate.revertToVersion(
            req.params.name,
            req.params.versionId
        );
        res.json({ message: 'Template reverted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
const db = require('../../db');

class RolePermissionTemplate {
	static async createTemplate(name, permissions) {
		const query = `
			INSERT INTO role_permission_templates 
			(name, permissions, created_at)
			VALUES (?, ?, NOW())`;
		
		return await db.query(query, [name, JSON.stringify(permissions)]);
	}

	static async getTemplate(name) {
		const query = `
			SELECT * FROM role_permission_templates
			WHERE name = ?`;
		
		const [template] = await db.query(query, [name]);
		return template;
	}

	static async getAllTemplates() {
		const query = `
			SELECT 
				name,
				permissions,
				created_at,
				last_used
			FROM role_permission_templates
			ORDER BY last_used DESC`;
		
		return await db.query(query);
	}

	static async applyTemplate(templateName, roleId) {
		const template = await this.getTemplate(templateName);
		if (!template) {
			throw new Error('Template not found');
		}

		const permissions = JSON.parse(template.permissions);
		const deleteQuery = 'DELETE FROM roles_permissions WHERE role_id = ?';
		const insertQuery = `
			INSERT INTO roles_permissions 
			(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete)
			VALUES ?`;

		await db.query(deleteQuery, [roleId]);
		
		const values = permissions.map(p => [
			roleId,
			p.category_id,
			p.can_view,
			p.can_add,
			p.can_edit,
			p.can_delete
		]);

		await db.query(insertQuery, [values]);
		await db.query(
			'UPDATE role_permission_templates SET last_used = NOW() WHERE name = ?',
			[templateName]
		);

		return { message: 'Template applied successfully' };
	}

	static async updateTemplate(name, permissions) {
		const query = `
			UPDATE role_permission_templates
			SET permissions = ?, updated_at = NOW()
			WHERE name = ?`;
		
		return await db.query(query, [JSON.stringify(permissions), name]);
	}

	static async deleteTemplate(name) {
		const query = `
			DELETE FROM role_permission_templates
			WHERE name = ?`;
		
		return await db.query(query, [name]);
	}

	static async exportTemplateToRole(templateName, roleId) {
		const template = await this.getTemplate(templateName);
		if (!template) {
			throw new Error('Template not found');
		}

		const permissions = JSON.parse(template.permissions);
		const rolePerms = await db.query(
			'SELECT * FROM roles_permissions WHERE role_id = ?',
			[roleId]
		);

		const merged = this.mergePermissions(rolePerms, permissions);
		const query = `
			INSERT INTO roles_permissions 
			(role_id, perm_cat_id, can_view, can_add, can_edit, can_delete)
			VALUES ?
			ON DUPLICATE KEY UPDATE
			can_view = VALUES(can_view),
			can_add = VALUES(can_add),
			can_edit = VALUES(can_edit),
			can_delete = VALUES(can_delete)`;

		const values = merged.map(p => [
			roleId,
			p.category_id,
			p.can_view,
			p.can_add,
			p.can_edit,
			p.can_delete
		]);

		return await db.query(query, [values]);
	}

	static mergePermissions(existing, template) {
		const merged = [...existing];
		template.forEach(tp => {
			const existingPerm = merged.find(
				ep => ep.perm_cat_id === tp.category_id
			);
			if (existingPerm) {
				existingPerm.can_view |= tp.can_view;
				existingPerm.can_add |= tp.can_add;
				existingPerm.can_edit |= tp.can_edit;
				existingPerm.can_delete |= tp.can_delete;
			} else {
				merged.push({
					perm_cat_id: tp.category_id,
					...tp
				});
			}
		});
		return merged;
	}

	static async cloneTemplate(name, newName, modifications = {}) {
		const template = await this.getTemplate(name);
		if (!template) {
			throw new Error('Source template not found');
		}

		let permissions = JSON.parse(template.permissions);

		if (modifications.add_categories) {
			const newCategories = await db.query(
				'SELECT * FROM permission_category WHERE id IN (?)',
				[modifications.add_categories]
			);
			permissions = [...permissions, ...newCategories.map(cat => ({
				category_id: cat.id,
				can_view: 1,
				can_add: 0,
				can_edit: 0,
				can_delete: 0
			}))];
		}

		if (modifications.remove_categories) {
			permissions = permissions.filter(
				p => !modifications.remove_categories.includes(p.category_id)
			);
		}

		return await this.createTemplate(newName, permissions);
	}

	static async importFromRole(roleId, templateName, options = {}) {
		const query = `
			SELECT 
				pc.id as category_id,
				pc.name as category_name,
				rp.can_view,
				rp.can_add,
				rp.can_edit,
				rp.can_delete
			FROM roles_permissions rp
			JOIN permission_category pc ON pc.id = rp.perm_cat_id
			WHERE rp.role_id = ?
			${options.include_categories ? 'AND pc.short_code IN (?)' : ''}`;

		const params = [roleId];
		if (options.include_categories) {
			params.push(options.include_categories);
		}

		const permissions = await db.query(query, params);
		return await this.createTemplate(templateName, permissions);
	}

	static async createVersion(name, permissions) {
		const query = `
			INSERT INTO role_permission_template_versions 
			(template_name, permissions, created_at)
			VALUES (?, ?, NOW())`;
		
		return await db.query(query, [name, JSON.stringify(permissions)]);
	}

	static async getVersions(name) {
		const query = `
			SELECT 
				version_id,
				permissions,
				created_at,
				created_by
			FROM role_permission_template_versions
			WHERE template_name = ?
			ORDER BY created_at DESC`;
		
		return await db.query(query, [name]);
	}

	static async getVersion(name, versionId) {
		const query = `
			SELECT * FROM role_permission_template_versions
			WHERE template_name = ? AND version_id = ?`;
		
		const [version] = await db.query(query, [name, versionId]);
		return version;
	}

	static async revertToVersion(name, versionId) {
		const version = await this.getVersion(name, versionId);
		if (!version) {
			throw new Error('Version not found');
		}

		await this.updateTemplate(name, JSON.parse(version.permissions));
		return { message: 'Template reverted to version successfully' };
	}
}

module.exports = RolePermissionTemplate;
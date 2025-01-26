const db = require('../../db');

class RolePermissionAnalytics {
	static async getUsageAnalytics(roleId) {
		const queries = {
			usagePatterns: `
				SELECT 
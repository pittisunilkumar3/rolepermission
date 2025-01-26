exports.up = async function(db) {
	// Create role_permission_templates table
	await db.query(`
		CREATE TABLE role_permission_templates (
			id INT PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(100) NOT NULL UNIQUE,
			permissions JSON NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			last_used TIMESTAMP NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	`);

	// Create role_permission_template_versions table
	await db.query(`
		CREATE TABLE role_permission_template_versions (
			version_id INT PRIMARY KEY AUTO_INCREMENT,
			template_name VARCHAR(100) NOT NULL,
			permissions JSON NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			created_by VARCHAR(100) DEFAULT 'system',
			FOREIGN KEY (template_name) REFERENCES role_permission_templates(name)
				ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	`);
};

exports.down = async function(db) {
	await db.query('DROP TABLE IF EXISTS role_permission_template_versions');
	await db.query('DROP TABLE IF EXISTS role_permission_templates');
};
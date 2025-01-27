const fs = require('fs').promises;
const path = require('path');

async function runMigrations() {
	try {
		// Get all migration files
		const files = await fs.readdir(__dirname);
		const migrationFiles = files.filter(file => 
			file.endsWith('.js') && 
			file !== 'migrationRunner.js'
		).sort();

		// Execute migrations in order
		for (const file of migrationFiles) {
			const migration = require(path.join(__dirname, file));
			console.log(`Running migration: ${file}`);
			await migration.up();
			console.log(`Completed migration: ${file}`);
		}

		console.log('All migrations completed successfully');
	} catch (error) {
		console.error('Migration failed:', error);
		throw error;
	}
}

module.exports = runMigrations;
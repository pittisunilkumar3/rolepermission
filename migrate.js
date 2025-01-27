const runMigrations = require('./src/migrations/migrationRunner');

(async () => {
	try {
		await runMigrations();
		console.log('Migrations completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	}
})();
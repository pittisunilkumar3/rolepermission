const db = require('../../db');

async function up() {
	const query = `
		CREATE TABLE IF NOT EXISTS staff (
			id INT PRIMARY KEY AUTO_INCREMENT,
			employee_id VARCHAR(100) NOT NULL,
			lang_id INT NOT NULL,
			currency_id INT DEFAULT 0,
			department INT DEFAULT NULL,
			designation INT DEFAULT NULL,
			qualification VARCHAR(255) NOT NULL,
			work_exp VARCHAR(255) NOT NULL,
			name VARCHAR(100) NOT NULL,
			surname VARCHAR(100) NOT NULL,
			father_name VARCHAR(100) NOT NULL,
			mother_name VARCHAR(100) NOT NULL,
			contact_no VARCHAR(20) NOT NULL,
			emergency_contact_no VARCHAR(20) NOT NULL,
			email VARCHAR(100) NOT NULL,
			dob DATE NOT NULL,
			marital_status VARCHAR(20) NOT NULL,
			date_of_joining DATE DEFAULT NULL,
			date_of_leaving DATE DEFAULT NULL,
			local_address VARCHAR(255) NOT NULL,
			permanent_address VARCHAR(255) NOT NULL,
			note TEXT NOT NULL,
			image VARCHAR(255) NOT NULL,
			password VARCHAR(255) NOT NULL,
			gender VARCHAR(10) NOT NULL,
			account_title VARCHAR(100) NOT NULL,
			bank_account_no VARCHAR(50) NOT NULL,
			bank_name VARCHAR(100) NOT NULL,
			ifsc_code VARCHAR(20) NOT NULL,
			bank_branch VARCHAR(100) NOT NULL,
			payscale VARCHAR(100) NOT NULL,
			basic_salary INT DEFAULT NULL,
			epf_no VARCHAR(50) NOT NULL,
			contract_type VARCHAR(50) NOT NULL,
			shift VARCHAR(50) NOT NULL,
			location VARCHAR(100) NOT NULL,
			facebook VARCHAR(255) NOT NULL,
			twitter VARCHAR(255) NOT NULL,
			linkedin VARCHAR(255) NOT NULL,
			instagram VARCHAR(255) NOT NULL,
			resume VARCHAR(255) NOT NULL,
			joining_letter VARCHAR(255) NOT NULL,
			resignation_letter VARCHAR(255) NOT NULL,
			other_document_name VARCHAR(255) NOT NULL,
			other_document_file VARCHAR(255) NOT NULL,
			user_id INT NOT NULL,
			is_active INT NOT NULL,
			verification_code VARCHAR(100) NOT NULL,
			zoom_api_key VARCHAR(255) DEFAULT NULL,
			zoom_api_secret VARCHAR(255) DEFAULT NULL,
			disable_at DATE DEFAULT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`;
	
	try {
		await db.query(query);
		console.log('Staff table created successfully');
	} catch (error) {
		console.error('Error creating staff table:', error);
		throw error;
	}
}

async function down() {
	const query = 'DROP TABLE IF EXISTS staff';
	
	try {
		await db.query(query);
		console.log('Staff table dropped successfully');
	} catch (error) {
		console.error('Error dropping staff table:', error);
		throw error;
	}
}

module.exports = {
	up,
	down
};
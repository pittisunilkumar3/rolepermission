const db = require('../../db');

class Staff {
	static async create(staffData) {
		const query = `
			INSERT INTO staff (
				employee_id, lang_id, currency_id, department, designation,
				qualification, work_exp, name, surname, father_name,
				mother_name, contact_no, emergency_contact_no, email, dob,
				marital_status, date_of_joining, date_of_leaving, local_address,
				permanent_address, note, image, password, gender, account_title,
				bank_account_no, bank_name, ifsc_code, bank_branch, payscale,
				basic_salary, epf_no, contract_type, shift, location,
				facebook, twitter, linkedin, instagram, resume,
				joining_letter, resignation_letter, other_document_name,
				other_document_file, user_id, is_active, verification_code,
				zoom_api_key, zoom_api_secret, disable_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
					?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
					?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

		const values = [
			staffData.employee_id, staffData.lang_id, staffData.currency_id || 0,
			staffData.department, staffData.designation, staffData.qualification,
			staffData.work_exp, staffData.name, staffData.surname, staffData.father_name,
			staffData.mother_name, staffData.contact_no, staffData.emergency_contact_no,
			staffData.email, staffData.dob, staffData.marital_status,
			staffData.date_of_joining, staffData.date_of_leaving, staffData.local_address,
			staffData.permanent_address, staffData.note, staffData.image,
			staffData.password, staffData.gender, staffData.account_title,
			staffData.bank_account_no, staffData.bank_name, staffData.ifsc_code,
			staffData.bank_branch, staffData.payscale, staffData.basic_salary,
			staffData.epf_no, staffData.contract_type, staffData.shift,
			staffData.location, staffData.facebook, staffData.twitter,
			staffData.linkedin, staffData.instagram, staffData.resume,
			staffData.joining_letter, staffData.resignation_letter,
			staffData.other_document_name, staffData.other_document_file,
			staffData.user_id, staffData.is_active, staffData.verification_code,
			staffData.zoom_api_key, staffData.zoom_api_secret, staffData.disable_at
		];

		return db.query(query, values);
	}

	static async bulkCreate(staffMembers) {
		const query = `
			INSERT INTO staff (
				employee_id, lang_id, currency_id, department, designation,
				qualification, work_exp, name, surname, father_name,
				mother_name, contact_no, emergency_contact_no, email, dob,
				marital_status, date_of_joining, date_of_leaving, local_address,
				permanent_address, note, image, password, gender, account_title,
				bank_account_no, bank_name, ifsc_code, bank_branch, payscale,
				basic_salary, epf_no, contract_type, shift, location,
				facebook, twitter, linkedin, instagram, resume,
				joining_letter, resignation_letter, other_document_name,
				other_document_file, user_id, is_active, verification_code,
				zoom_api_key, zoom_api_secret, disable_at
			) VALUES ?`;

		const values = staffMembers.map(staff => [
			staff.employee_id, staff.lang_id, staff.currency_id || 0,
			staff.department, staff.designation, staff.qualification,
			staff.work_exp, staff.name, staff.surname, staff.father_name,
			staff.mother_name, staff.contact_no, staff.emergency_contact_no,
			staff.email, staff.dob, staff.marital_status,
			staff.date_of_joining, staff.date_of_leaving, staff.local_address,
			staff.permanent_address, staff.note, staff.image,
			staff.password, staff.gender, staff.account_title,
			staff.bank_account_no, staff.bank_name, staff.ifsc_code,
			staff.bank_branch, staff.payscale, staff.basic_salary,
			staff.epf_no, staff.contract_type, staff.shift,
			staff.location, staff.facebook, staff.twitter,
			staff.linkedin, staff.instagram, staff.resume,
			staff.joining_letter, staff.resignation_letter,
			staff.other_document_name, staff.other_document_file,
			staff.user_id, staff.is_active, staff.verification_code,
			staff.zoom_api_key, staff.zoom_api_secret, staff.disable_at
		]);

		return db.query(query, [values]);
	}

	static async findById(id) {
		return db.query('SELECT * FROM staff WHERE id = ?', [id]);
	}

	static async findAll() {
		return db.query('SELECT * FROM staff');
	}

	static async update(id, staffData) {
		const query = `
			UPDATE staff SET
				employee_id = ?, lang_id = ?, currency_id = ?, department = ?,
				designation = ?, qualification = ?, work_exp = ?, name = ?,
				surname = ?, father_name = ?, mother_name = ?, contact_no = ?,
				emergency_contact_no = ?, email = ?, dob = ?, marital_status = ?,
				date_of_joining = ?, date_of_leaving = ?, local_address = ?,
				permanent_address = ?, note = ?, image = ?, password = ?,
				gender = ?, account_title = ?, bank_account_no = ?, bank_name = ?,
				ifsc_code = ?, bank_branch = ?, payscale = ?, basic_salary = ?,
				epf_no = ?, contract_type = ?, shift = ?, location = ?,
				facebook = ?, twitter = ?, linkedin = ?, instagram = ?,
				resume = ?, joining_letter = ?, resignation_letter = ?,
				other_document_name = ?, other_document_file = ?, user_id = ?,
				is_active = ?, verification_code = ?, zoom_api_key = ?,
				zoom_api_secret = ?, disable_at = ?
			WHERE id = ?`;

		const values = [
			staffData.employee_id, staffData.lang_id, staffData.currency_id,
			staffData.department, staffData.designation, staffData.qualification,
			staffData.work_exp, staffData.name, staffData.surname, staffData.father_name,
			staffData.mother_name, staffData.contact_no, staffData.emergency_contact_no,
			staffData.email, staffData.dob, staffData.marital_status,
			staffData.date_of_joining, staffData.date_of_leaving, staffData.local_address,
			staffData.permanent_address, staffData.note, staffData.image,
			staffData.password, staffData.gender, staffData.account_title,
			staffData.bank_account_no, staffData.bank_name, staffData.ifsc_code,
			staffData.bank_branch, staffData.payscale, staffData.basic_salary,
			staffData.epf_no, staffData.contract_type, staffData.shift,
			staffData.location, staffData.facebook, staffData.twitter,
			staffData.linkedin, staffData.instagram, staffData.resume,
			staffData.joining_letter, staffData.resignation_letter,
			staffData.other_document_name, staffData.other_document_file,
			staffData.user_id, staffData.is_active, staffData.verification_code,
			staffData.zoom_api_key, staffData.zoom_api_secret, staffData.disable_at,
			id
		];

		return db.query(query, values);
	}

	static async bulkUpdate(staffMembers) {
		const promises = staffMembers.map(staff => this.update(staff.id, staff));
		return Promise.all(promises);
	}

	static async delete(id) {
		return db.query('DELETE FROM staff WHERE id = ?', [id]);
	}

	static async bulkDelete(ids) {
		return db.query('DELETE FROM staff WHERE id IN (?)', [ids]);
	}
}

module.exports = Staff;
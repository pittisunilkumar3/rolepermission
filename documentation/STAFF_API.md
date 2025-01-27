# Staff Management API Documentation

## Database Structure
The staff table has the following structure:

```sql
CREATE TABLE staff (
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
```

## Base URL
`http://localhost:5000/api/staff`

## Endpoints

### 1. Create Staff Member
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"employee_id": "EMP001",
	"lang_id": 1,
	"currency_id": 1,
	"department": 1,
	"designation": 1,
	"qualification": "B.Tech",
	"work_exp": "5 years",
	"name": "John",
	"surname": "Doe",
	"father_name": "Michael Doe",
	"mother_name": "Sarah Doe",
	"contact_no": "1234567890",
	"emergency_contact_no": "0987654321",
	"email": "john.doe@example.com",
	"dob": "1990-01-01",
	"marital_status": "married",
	"date_of_joining": "2023-01-01",
	"local_address": "123 Local St",
	"permanent_address": "456 Permanent St",
	"note": "Employee notes",
	"image": "profile.jpg",
	"password": "hashedpassword",
	"gender": "male",
	"account_title": "John Doe",
	"bank_account_no": "1234567890",
	"bank_name": "Example Bank",
	"ifsc_code": "BANK0123",
	"bank_branch": "Main Branch",
	"payscale": "Level 5",
	"basic_salary": 50000,
	"epf_no": "EPF123456",
	"contract_type": "permanent",
	"shift": "day",
	"location": "New York",
	"facebook": "facebook.com/johndoe",
	"twitter": "twitter.com/johndoe",
	"linkedin": "linkedin.com/in/johndoe",
	"instagram": "instagram.com/johndoe",
	"resume": "resume.pdf",
	"joining_letter": "joining.pdf",
	"resignation_letter": "resignation.pdf",
	"other_document_name": "Certificate",
	"other_document_file": "certificate.pdf",
	"user_id": 1,
	"is_active": 1,
	"verification_code": "ABC123"
}
```
- **Success Response:**
```json
{
	"message": "Staff member created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Staff Members
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"staff": [
		{
			"employee_id": "EMP001",
			"lang_id": 1,
			"name": "John Doe",
			"email": "john@example.com",
			...
		},
		{
			"employee_id": "EMP002",
			"lang_id": 1,
			"name": "Jane Doe",
			"email": "jane@example.com",
			...
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Staff members created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Staff Member
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"employee_id": "EMP001",
		"name": "John Doe",
		"email": "john@example.com",
		...
	}
}
```

### 4. Get All Staff Members
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"employee_id": "EMP001",
			"name": "John Doe",
			...
		},
		{
			"id": 2,
			"employee_id": "EMP002",
			"name": "Jane Doe",
			...
		}
	]
}
```

### 5. Update Staff Member
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:** Same as Create Staff Member
- **Success Response:**
```json
{
	"message": "Staff member updated successfully"
}
```

### 6. Bulk Update Staff Members
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"staff": [
		{
			"id": 1,
			"name": "Updated John Doe",
			...
		},
		{
			"id": 2,
			"name": "Updated Jane Doe",
			...
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Staff members updated successfully"
}
```

### 7. Delete Staff Member
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Staff member deleted successfully"
}
```

### 8. Bulk Delete Staff Members
- **URL:** `/bulk/delete`
- **Method:** `DELETE`
- **Payload Example:**
```json
{
	"ids": [1, 2, 3]
}
```
- **Success Response:**
```json
{
	"message": "Staff members deleted successfully"
}
```

## Error Response Format
All endpoints return the following format for errors:
```json
{
	"error": "Error message description"
}
```

## Common Error Responses
- **404 Not Found:**
```json
{
	"error": "Staff member not found"
}
```
- **500 Server Error:**
```json
{
	"error": "Internal server error message"
}
```
- **400 Bad Request:**
```json
{
	"error": "Invalid request parameters"
}
```

## Setup Instructions
1. Ensure XAMPP MySQL service is running
2. Database and table will be created automatically through migrations
3. Access the API endpoints as documented above
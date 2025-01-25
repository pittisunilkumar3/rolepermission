# Staff Role API Documentation

## Database Structure
The staff_roles table has the following structure:

```sql
CREATE TABLE staff_roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
	role_id INT(11) DEFAULT NULL,
	staff_id INT(11) DEFAULT NULL,
	is_active INT(11) DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	updated_at DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```

## Base URL
`http://localhost:5000/api/staff-roles`

## Endpoints

### 1. Create Staff Role
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"role_id": 1,
	"staff_id": 1,
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"message": "Staff role created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Staff Roles
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"staffRoles": [
		{
			"role_id": 1,
			"staff_id": 1,
			"is_active": 1
		},
		{
			"role_id": 2,
			"staff_id": 1,
			"is_active": 1
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Staff roles created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Staff Role
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"role_id": 1,
		"staff_id": 1,
		"is_active": 1,
		"created_at": "2024-02-20T10:00:00.000Z",
		"updated_at": "2024-02-20"
	}
}
```

### 4. Get All Staff Roles
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"staff_id": 1,
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z",
			"updated_at": "2024-02-20"
		}
	]
}
```

### 5. Get Roles by Staff ID
- **URL:** `/by-staff/:staffId`
- **Method:** `GET`
- **Example:** `/by-staff/1`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"staff_id": 1,
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z",
			"updated_at": "2024-02-20"
		}
	]
}
```

### 6. Get Staff by Role ID
- **URL:** `/by-role/:roleId`
- **Method:** `GET`
- **Example:** `/by-role/1`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"staff_id": 1,
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z",
			"updated_at": "2024-02-20"
		}
	]
}
```

### 7. Update Staff Role
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"role_id": 1,
	"staff_id": 1,
	"is_active": 0
}
```
- **Success Response:**
```json
{
	"message": "Staff role updated successfully"
}
```

### 8. Bulk Update Staff Roles
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"staffRoles": [
		{
			"id": 1,
			"role_id": 1,
			"staff_id": 1,
			"is_active": 0
		},
		{
			"id": 2,
			"role_id": 2,
			"staff_id": 1,
			"is_active": 1
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Staff roles updated successfully"
}
```

### 9. Delete Staff Role
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Staff role deleted successfully"
}
```

### 10. Bulk Delete Staff Roles
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
	"message": "Staff roles deleted successfully"
}
```

### 11. Delete Roles by Staff ID
- **URL:** `/by-staff/:staffId`
- **Method:** `DELETE`
- **Example:** `/by-staff/1`
- **Success Response:**
```json
{
	"message": "Staff roles deleted successfully"
}
```

### 12. Delete Staff by Role ID
- **URL:** `/by-role/:roleId`
- **Method:** `DELETE`
- **Example:** `/by-role/1`
- **Success Response:**
```json
{
	"message": "Staff roles deleted successfully"
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
	"error": "Staff role not found"
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
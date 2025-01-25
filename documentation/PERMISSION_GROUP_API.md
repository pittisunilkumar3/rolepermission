# Permission Group API Documentation

## Database Structure
The permission_group table has the following structure:

```sql
CREATE TABLE permission_group (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	short_code VARCHAR(100) NOT NULL,
	is_active INT DEFAULT 0,
	system INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Base URL
`http://localhost:5000/api/permission-groups`

## Endpoints

### 1. Create Single Permission Group
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"name": "Admin Access",
	"short_code": "admin-access",
	"is_active": 1,
	"system": 1
}
```
- **Success Response:**
```json
{
	"message": "Permission group created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Permission Groups
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"groups": [
		{
			"name": "User Management",
			"short_code": "user-mgmt",
			"is_active": 1,
			"system": 1
		},
		{
			"name": "Content Access",
			"short_code": "content-access",
			"is_active": 1,
			"system": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Permission groups created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Single Permission Group
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"name": "Admin Access",
		"short_code": "admin-access",
		"is_active": 1,
		"system": 1,
		"created_at": "2024-02-20T10:00:00.000Z"
	}
}
```

### 4. Get All Permission Groups
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"name": "Admin Access",
			"short_code": "admin-access",
			"is_active": 1,
			"system": 1,
			"created_at": "2024-02-20T10:00:00.000Z"
		},
		{
			"id": 2,
			"name": "User Management",
			"short_code": "user-mgmt",
			"is_active": 1,
			"system": 1,
			"created_at": "2024-02-20T10:00:00.000Z"
		}
	]
}
```

### 5. Update Single Permission Group
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"name": "Updated Admin Access",
	"short_code": "updated-admin-access",
	"is_active": 1,
	"system": 1
}
```
- **Success Response:**
```json
{
	"message": "Permission group updated successfully"
}
```

### 6. Bulk Update Permission Groups
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"groups": [
		{
			"id": 1,
			"name": "Updated Admin Access",
			"short_code": "updated-admin-access",
			"is_active": 1,
			"system": 1
		},
		{
			"id": 2,
			"name": "Updated User Management",
			"short_code": "updated-user-mgmt",
			"is_active": 0,
			"system": 1
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Permission groups updated successfully"
}
```

### 7. Delete Single Permission Group
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Permission group deleted successfully"
}
```

### 8. Bulk Delete Permission Groups
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
	"message": "Permission groups deleted successfully"
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
	"error": "Permission group not found"
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
# Permission Category API Documentation

## Database Structure
The permission_category table has the following structure:

```sql
CREATE TABLE permission_category (
	id INT PRIMARY KEY AUTO_INCREMENT,
	perm_group_id INT DEFAULT NULL,
	name VARCHAR(100) DEFAULT NULL,
	short_code VARCHAR(100) DEFAULT NULL,
	enable_view INT DEFAULT 0,
	enable_add INT DEFAULT 0,
	enable_edit INT DEFAULT 0,
	enable_delete INT DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## Base URL
`http://localhost:5000/api/permission-categories`

## Endpoints

### 1. Create Permission Category
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"perm_group_id": 1,
	"name": "User Management",
	"short_code": "user-mgmt",
	"enable_view": 1,
	"enable_add": 1,
	"enable_edit": 1,
	"enable_delete": 0
}
```
- **Success Response:**
```json
{
	"message": "Permission category created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Permission Categories
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"categories": [
		{
			"perm_group_id": 1,
			"name": "User Management",
			"short_code": "user-mgmt",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 1,
			"enable_delete": 0
		},
		{
			"perm_group_id": 1,
			"name": "Content Management",
			"short_code": "content-mgmt",
			"enable_view": 1,
			"enable_add": 0,
			"enable_edit": 0,
			"enable_delete": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Permission categories created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Permission Category
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"perm_group_id": 1,
		"name": "User Management",
		"short_code": "user-mgmt",
		"enable_view": 1,
		"enable_add": 1,
		"enable_edit": 1,
		"enable_delete": 0,
		"created_at": "2024-02-20T10:00:00.000Z"
	}
}
```

### 4. Get All Permission Categories
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"perm_group_id": 1,
			"name": "User Management",
			"short_code": "user-mgmt",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 1,
			"enable_delete": 0,
			"created_at": "2024-02-20T10:00:00.000Z"
		},
		{
			"id": 2,
			"perm_group_id": 1,
			"name": "Content Management",
			"short_code": "content-mgmt",
			"enable_view": 1,
			"enable_add": 0,
			"enable_edit": 0,
			"enable_delete": 0,
			"created_at": "2024-02-20T10:00:00.000Z"
		}
	]
}
```

### 5. Update Permission Category
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"perm_group_id": 1,
	"name": "Updated User Management",
	"short_code": "updated-user-mgmt",
	"enable_view": 1,
	"enable_add": 1,
	"enable_edit": 1,
	"enable_delete": 1
}
```
- **Success Response:**
```json
{
	"message": "Permission category updated successfully"
}
```

### 6. Bulk Update Permission Categories
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"categories": [
		{
			"id": 1,
			"name": "Updated User Management",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 1,
			"enable_delete": 1
		},
		{
			"id": 2,
			"name": "Updated Content Management",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 0,
			"enable_delete": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Permission categories updated successfully"
}
```

### 7. Delete Permission Category
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Permission category deleted successfully"
}
```

### 8. Bulk Delete Permission Categories
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
	"message": "Permission categories deleted successfully"
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
	"error": "Permission category not found"
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
# Role Permissions API Documentation

## Database Structure
The roles_permissions table has the following structure:

```sql
CREATE TABLE roles_permissions (
	id INT PRIMARY KEY AUTO_INCREMENT,
	role_id INT DEFAULT NULL,
	perm_cat_id INT DEFAULT NULL,
	can_view INT DEFAULT NULL,
	can_add INT DEFAULT NULL,
	can_edit INT DEFAULT NULL,
	can_delete INT DEFAULT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```

## Base URL
`http://localhost:5000/api/role-permissions`

## Endpoints

### 1. Create Role Permission
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"role_id": 1,
	"perm_cat_id": 1,
	"can_view": 1,
	"can_add": 1,
	"can_edit": 1,
	"can_delete": 0
}
```
- **Success Response:**
```json
{
	"message": "Role permission created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Role Permissions
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"permissions": [
		{
			"role_id": 1,
			"perm_cat_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 0
		},
		{
			"role_id": 1,
			"perm_cat_id": 2,
			"can_view": 1,
			"can_add": 0,
			"can_edit": 0,
			"can_delete": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Role permissions created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Role Permission
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"role_id": 1,
		"perm_cat_id": 1,
		"can_view": 1,
		"can_add": 1,
		"can_edit": 1,
		"can_delete": 0,
		"created_at": "2024-02-20T10:00:00.000Z"
	}
}
```

### 4. Get All Role Permissions
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"perm_cat_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 0,
			"created_at": "2024-02-20T10:00:00.000Z"
		},
		{
			"id": 2,
			"role_id": 1,
			"perm_cat_id": 2,
			"can_view": 1,
			"can_add": 0,
			"can_edit": 0,
			"can_delete": 0,
			"created_at": "2024-02-20T10:00:00.000Z"
		}
	]
}
```

### 5. Update Role Permission
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"role_id": 1,
	"perm_cat_id": 1,
	"can_view": 1,
	"can_add": 1,
	"can_edit": 1,
	"can_delete": 1
}
```
- **Success Response:**
```json
{
	"message": "Role permission updated successfully"
}
```

### 6. Bulk Update Role Permissions
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"permissions": [
		{
			"id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1
		},
		{
			"id": 2,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 0,
			"can_delete": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Role permissions updated successfully"
}
```

### 7. Delete Role Permission
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Role permission deleted successfully"
}
```

### 8. Bulk Delete Role Permissions
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
	"message": "Role permissions deleted successfully"
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
	"error": "Role permission not found"
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
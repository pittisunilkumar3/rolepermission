# Role Management API Documentation

## Database Migrations
The project includes a migration system in the `/src/migrations` directory:

1. Migration Files:
   - `001_create_roles_table.js`: Creates the roles table with all required fields
   - Migration runner automatically executes migrations in order

2. Migration Structure:
   - Each migration has `up()` and `down()` functions
   - `up()`: Creates or modifies database structures
   - `down()`: Reverts the changes made by `up()`

3. Automatic Execution:
   - Migrations run automatically when the server starts
   - Ensures database schema is always up to date

## Database Setup
The database table will be automatically created when you start the server. The following table structure will be created:

```sql
CREATE TABLE roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	slug VARCHAR(150) NOT NULL UNIQUE,
	is_active INT DEFAULT 0,
	is_system INT DEFAULT 0,
	is_superadmin INT DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at DATE
)
```

## Base URL
`http://localhost:5000/api`

## Endpoints

### 1. Create Single Role
- **URL:** `/roles`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"name": "Admin",
	"slug": "admin",
	"is_active": 1,
	"is_system": 1,
	"is_superadmin": 0
}
```
- **Success Response:**
```json
{
	"message": "Role created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Roles
- **URL:** `/roles/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"roles": [
		{
			"name": "Super Admin",
			"slug": "super-admin",
			"is_active": 1,
			"is_system": 1,
			"is_superadmin": 1
		},
		{
			"name": "User",
			"slug": "user",
			"is_active": 1,
			"is_system": 0,
			"is_superadmin": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Roles created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Single Role
- **URL:** `/roles/:id`
- **Method:** `GET`
- **Example:** `/roles/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"name": "Admin",
		"slug": "admin",
		"is_active": 1,
		"is_system": 1,
		"is_superadmin": 0,
		"created_at": "2024-02-20T10:00:00.000Z",
		"updated_at": "2024-02-20"
	}
}
```

### 4. Get All Roles
- **URL:** `/roles`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"name": "Admin",
			"slug": "admin",
			"is_active": 1,
			"is_system": 1,
			"is_superadmin": 0,
			"created_at": "2024-02-20T10:00:00.000Z",
			"updated_at": "2024-02-20"
		},
		{
			"id": 2,
			"name": "User",
			"slug": "user",
			"is_active": 1,
			"is_system": 0,
			"is_superadmin": 0,
			"created_at": "2024-02-20T10:00:00.000Z",
			"updated_at": "2024-02-20"
		}
	]
}
```

### 5. Get Super Admin Role
- **URL:** `/roles/super-admin/details`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"name": "Super Admin",
		"slug": "super-admin",
		"is_active": 1,
		"is_system": 1,
		"is_superadmin": 1,
		"created_at": "2024-02-20T10:00:00.000Z",
		"updated_at": "2024-02-20"
	}
}
```

### 6. Update Single Role
- **URL:** `/roles/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"name": "Updated Admin",
	"slug": "updated-admin",
	"is_active": 1,
	"is_system": 1,
	"is_superadmin": 0
}
```
- **Success Response:**
```json
{
	"message": "Role updated successfully"
}
```

### 7. Bulk Update Roles
- **URL:** `/roles/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"roles": [
		{
			"id": 1,
			"name": "Updated Super Admin",
			"slug": "updated-super-admin",
			"is_active": 1,
			"is_system": 1,
			"is_superadmin": 1
		},
		{
			"id": 2,
			"name": "Updated User",
			"slug": "updated-user",
			"is_active": 0,
			"is_system": 0,
			"is_superadmin": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Roles updated successfully"
}
```

### 8. Delete Single Role
- **URL:** `/roles/:id`
- **Method:** `DELETE`
- **Example:** `/roles/1`
- **Success Response:**
```json
{
	"message": "Role deleted successfully"
}
```

### 9. Bulk Delete Roles
- **URL:** `/roles/bulk/delete`
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
	"message": "Roles deleted successfully"
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
	"error": "Role not found"
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
2. Create a database named 'test_db' in MySQL
3. Start the server using `npm start`
4. The roles table will be automatically created on server start
5. Use the API endpoints as documented above
# Sidebar Menu API Documentation

## Database Structure
The sidebar_menus table has the following structure:

```sql
CREATE TABLE sidebar_menus (
	id INT PRIMARY KEY AUTO_INCREMENT,
	permission_group_id INT(10) DEFAULT NULL,
	icon VARCHAR(100) DEFAULT NULL,
	menu VARCHAR(500) DEFAULT NULL,
	activate_menu VARCHAR(100) DEFAULT NULL,
	lang_key VARCHAR(250) NOT NULL,
	system_level INT(3) DEFAULT 0,
	level INT(5) DEFAULT NULL,
	sidebar_display INT(1) DEFAULT 0,
	access_permissions TEXT DEFAULT NULL,
	is_active INT(1) NOT NULL DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```

## Base URL
`http://localhost:5000/api/sidebar-menus`

## Endpoints

### 1. Create Sidebar Menu
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"permission_group_id": 1,
	"icon": "fa fa-dashboard",
	"menu": "Dashboard",
	"activate_menu": "dashboard",
	"lang_key": "dashboard",
	"system_level": 1,
	"level": 1,
	"sidebar_display": 1,
	"access_permissions": "view_dashboard",
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"message": "Sidebar menu created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Sidebar Menus
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"menus": [
		{
			"permission_group_id": 1,
			"icon": "fa fa-dashboard",
			"menu": "Dashboard",
			"activate_menu": "dashboard",
			"lang_key": "dashboard",
			"system_level": 1,
			"level": 1,
			"sidebar_display": 1,
			"access_permissions": "view_dashboard",
			"is_active": 1
		},
		{
			"permission_group_id": 2,
			"icon": "fa fa-users",
			"menu": "Users",
			"activate_menu": "users",
			"lang_key": "users",
			"system_level": 1,
			"level": 2,
			"sidebar_display": 1,
			"access_permissions": "view_users",
			"is_active": 1
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Sidebar menus created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Sidebar Menu
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"permission_group_id": 1,
		"icon": "fa fa-dashboard",
		"menu": "Dashboard",
		"activate_menu": "dashboard",
		"lang_key": "dashboard",
		"system_level": 1,
		"level": 1,
		"sidebar_display": 1,
		"access_permissions": "view_dashboard",
		"is_active": 1,
		"created_at": "2024-02-20T10:00:00.000Z"
	}
}
```

### 4. Get All Sidebar Menus
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"permission_group_id": 1,
			"icon": "fa fa-dashboard",
			"menu": "Dashboard",
			"activate_menu": "dashboard",
			"lang_key": "dashboard",
			"system_level": 1,
			"level": 1,
			"sidebar_display": 1,
			"access_permissions": "view_dashboard",
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z"
		},
		{
			"id": 2,
			"permission_group_id": 2,
			"icon": "fa fa-users",
			"menu": "Users",
			"activate_menu": "users",
			"lang_key": "users",
			"system_level": 1,
			"level": 2,
			"sidebar_display": 1,
			"access_permissions": "view_users",
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z"
		}
	]
}
```

### 5. Update Sidebar Menu
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"permission_group_id": 1,
	"icon": "fa fa-home",
	"menu": "Home Dashboard",
	"activate_menu": "home-dashboard",
	"lang_key": "home_dashboard",
	"system_level": 1,
	"level": 1,
	"sidebar_display": 1,
	"access_permissions": "view_home_dashboard",
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"message": "Sidebar menu updated successfully"
}
```

### 6. Bulk Update Sidebar Menus
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"menus": [
		{
			"id": 1,
			"icon": "fa fa-home",
			"menu": "Home",
			"is_active": 1
		},
		{
			"id": 2,
			"icon": "fa fa-user",
			"menu": "User Management",
			"is_active": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Sidebar menus updated successfully"
}
```

### 7. Delete Sidebar Menu
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Sidebar menu deleted successfully"
}
```

### 8. Bulk Delete Sidebar Menus
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
	"message": "Sidebar menus deleted successfully"
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
	"error": "Sidebar menu not found"
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
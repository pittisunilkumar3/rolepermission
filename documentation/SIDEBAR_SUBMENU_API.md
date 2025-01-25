# Sidebar Sub-Menu API Documentation

## Database Structure
The sidebar_sub_menus table has the following structure:

```sql
CREATE TABLE sidebar_sub_menus (
	id INT PRIMARY KEY AUTO_INCREMENT,
	sidebar_menu_id INT(10) DEFAULT NULL,
	menu VARCHAR(500) DEFAULT NULL,
	`key` VARCHAR(500) DEFAULT NULL,
	lang_key VARCHAR(250) DEFAULT NULL,
	url TEXT DEFAULT NULL,
	level INT(5) DEFAULT NULL,
	access_permissions VARCHAR(500) DEFAULT NULL,
	permission_group_id INT(11) DEFAULT NULL,
	activate_controller VARCHAR(100) DEFAULT NULL COMMENT 'income',
	activate_methods VARCHAR(500) DEFAULT NULL COMMENT 'index,edit',
	addon_permission VARCHAR(100) DEFAULT NULL,
	is_active INT(1) DEFAULT 1,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
```

## Base URL
`http://localhost:5000/api/sidebar-sub-menus`

## Endpoints

### 1. Create Sidebar Sub-Menu
- **URL:** `/`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"sidebar_menu_id": 1,
	"menu": "User List",
	"key": "user_list",
	"lang_key": "user_list",
	"url": "/users/list",
	"level": 1,
	"access_permissions": "view_users",
	"permission_group_id": 1,
	"activate_controller": "users",
	"activate_methods": "list,view",
	"addon_permission": null,
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"message": "Sidebar sub-menu created successfully",
	"data": {
		"insertId": 1,
		"affectedRows": 1
	}
}
```

### 2. Bulk Create Sidebar Sub-Menus
- **URL:** `/bulk`
- **Method:** `POST`
- **Payload Example:**
```json
{
	"subMenus": [
		{
			"sidebar_menu_id": 1,
			"menu": "User List",
			"key": "user_list",
			"lang_key": "user_list",
			"url": "/users/list",
			"level": 1,
			"access_permissions": "view_users",
			"permission_group_id": 1,
			"activate_controller": "users",
			"activate_methods": "list,view",
			"is_active": 1
		},
		{
			"sidebar_menu_id": 1,
			"menu": "Add User",
			"key": "add_user",
			"lang_key": "add_user",
			"url": "/users/add",
			"level": 2,
			"access_permissions": "add_users",
			"permission_group_id": 1,
			"activate_controller": "users",
			"activate_methods": "add,create",
			"is_active": 1
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Sidebar sub-menus created successfully",
	"data": {
		"affectedRows": 2
	}
}
```

### 3. Get Sidebar Sub-Menu
- **URL:** `/:id`
- **Method:** `GET`
- **Example:** `/1`
- **Success Response:**
```json
{
	"data": {
		"id": 1,
		"sidebar_menu_id": 1,
		"menu": "User List",
		"key": "user_list",
		"lang_key": "user_list",
		"url": "/users/list",
		"level": 1,
		"access_permissions": "view_users",
		"permission_group_id": 1,
		"activate_controller": "users",
		"activate_methods": "list,view",
		"addon_permission": null,
		"is_active": 1,
		"created_at": "2024-02-20T10:00:00.000Z"
	}
}
```

### 4. Get All Sidebar Sub-Menus
- **URL:** `/`
- **Method:** `GET`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"sidebar_menu_id": 1,
			"menu": "User List",
			"key": "user_list",
			"lang_key": "user_list",
			"url": "/users/list",
			"level": 1,
			"access_permissions": "view_users",
			"permission_group_id": 1,
			"activate_controller": "users",
			"activate_methods": "list,view",
			"addon_permission": null,
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z"
		}
	]
}
```

### 5. Get Sub-Menus by Menu ID
- **URL:** `/by-menu/:menuId`
- **Method:** `GET`
- **Example:** `/by-menu/1`
- **Success Response:**
```json
{
	"data": [
		{
			"id": 1,
			"sidebar_menu_id": 1,
			"menu": "User List",
			"key": "user_list",
			"lang_key": "user_list",
			"url": "/users/list",
			"level": 1,
			"access_permissions": "view_users",
			"permission_group_id": 1,
			"activate_controller": "users",
			"activate_methods": "list,view",
			"addon_permission": null,
			"is_active": 1,
			"created_at": "2024-02-20T10:00:00.000Z"
		}
	]
}
```

### 6. Update Sidebar Sub-Menu
- **URL:** `/:id`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"sidebar_menu_id": 1,
	"menu": "Updated User List",
	"key": "updated_user_list",
	"lang_key": "updated_user_list",
	"url": "/users/updated-list",
	"level": 1,
	"access_permissions": "view_users",
	"permission_group_id": 1,
	"activate_controller": "users",
	"activate_methods": "list,view,export",
	"is_active": 1
}
```
- **Success Response:**
```json
{
	"message": "Sidebar sub-menu updated successfully"
}
```

### 7. Bulk Update Sidebar Sub-Menus
- **URL:** `/bulk/update`
- **Method:** `PUT`
- **Payload Example:**
```json
{
	"subMenus": [
		{
			"id": 1,
			"menu": "Updated User List",
			"url": "/users/updated-list",
			"is_active": 1
		},
		{
			"id": 2,
			"menu": "Updated Add User",
			"url": "/users/new",
			"is_active": 0
		}
	]
}
```
- **Success Response:**
```json
{
	"message": "Sidebar sub-menus updated successfully"
}
```

### 8. Delete Sidebar Sub-Menu
- **URL:** `/:id`
- **Method:** `DELETE`
- **Example:** `/1`
- **Success Response:**
```json
{
	"message": "Sidebar sub-menu deleted successfully"
}
```

### 9. Bulk Delete Sidebar Sub-Menus
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
	"message": "Sidebar sub-menus deleted successfully"
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
	"error": "Sidebar sub-menu not found"
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
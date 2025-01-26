# Permission Group, Category and Roles API Documentation

## Overview
This API provides endpoints to manage permissions across roles, permission groups, and categories.

## Endpoints

### Permission Groups and Categories

#### Get All Permission Categories by Group ID
- **URL**: `/api/group/:groupId/categories`
- **Method**: `GET`
- **URL Params**: 
	- Required: `groupId=[integer]`

### Get Single Permission Category
- **URL**: `/api/group/:groupId/categories/:catId`
- **Method**: `GET`
- **URL Params**:
	- Required: 
		- `groupId=[integer]`
		- `catId=[integer]`

### Delete All Permission Categories by Group ID
- **URL**: `/api/group/:groupId/categories`
- **Method**: `DELETE`
- **URL Params**:
	- Required: `groupId=[integer]`

### Delete Single Permission Category
- **URL**: `/api/group/:groupId/categories/:catId`
- **Method**: `DELETE`
- **URL Params**:
	- Required:
		- `groupId=[integer]`
		- `catId=[integer]`

### Create Single Permission Category
- **URL**: `/api/group/:groupId/categories`
- **Method**: `POST`
- **URL Params**:
	- Required: `groupId=[integer]`
- **Payload Example**:
```json
{
	"name": "User Management",
	"short_code": "user-mgmt",
	"enable_view": 1,
	"enable_add": 1,
	"enable_edit": 1,
	"enable_delete": 0
}
```

### Create Multiple Permission Categories
- **URL**: `/api/group/:groupId/categories/bulk`
- **Method**: `POST`
- **URL Params**:
	- Required: `groupId=[integer]`
- **Payload Example**:
```json
{
	"categories": [
		{
			"name": "User Management",
			"short_code": "user-mgmt",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 1,
			"enable_delete": 0
		}
	]
}
```

### Update All Permission Categories by Group ID
- **URL**: `/api/group/:groupId/categories`
- **Method**: `PUT`
- **URL Params**:
	- Required: `groupId=[integer]`
- **Payload Example**:
```json
{
	"name": "Updated Management",
	"short_code": "updated-mgmt",
	"enable_view": 1,
	"enable_add": 1,
	"enable_edit": 1,
	"enable_delete": 1
}
```

### Update Single Permission Category
- **URL**: `/api/group/:groupId/categories/:catId`
- **Method**: `PUT`
- **URL Params**:
	- Required:
		- `groupId=[integer]`
		- `catId=[integer]`
- **Payload Example**:
```json
{
	"name": "Updated Management",
	"short_code": "updated-mgmt",
	"enable_view": 1,
	"enable_add": 1,
	"enable_edit": 1,
	"enable_delete": 1
}
```

### Combined Permissions

#### Get All Combined Permissions
- **URL**: `/api/combined-permissions`
- **Method**: `GET`
- **Description**: Returns all permissions data across roles, categories and groups.
- **Response Example**:
```json
{
    "data": [
        {
            "role_id": 1,
            "role_name": "Admin",
            "role_permission_id": 1,
            "can_view": true,
            "can_add": true,
            "can_edit": true,
            "can_delete": true,
            "permission_category_id": 1,
            "permission_category_name": "Users",
            "permission_category_code": "USR",
            "permission_group_id": 1,
            "permission_group_name": "User Management",
            "permission_group_code": "UM"
        }
    ]
}
```

#### Get Permissions by Role ID
- **URL**: `/api/combined-permissions/role/:roleId`
- **Method**: `GET`
- **URL Params**:
    - Required: `roleId=[integer]`
- **Description**: Returns permissions data for a specific role
- **Response**: Same structure as Get All Combined Permissions but filtered for specific role

#### Bulk Update Role Permissions
- **URL**: `/api/combined-permissions/bulk-update`
- **Method**: `PUT`
- **Description**: Update permissions for multiple roles at once
- **Payload Example**:
```json
{
    "rolePermissions": [
        {
            "role_id": 1,
            "permission_category_id": 1,
            "can_view": true,
            "can_add": false,
            "can_edit": true,
            "can_delete": false
        }
    ]
}
```

#### Clone Role Permissions
- **URL**: `/api/combined-permissions/clone`
- **Method**: `POST`
- **Description**: Clone permissions from one role to another
- **Payload Example**:
```json
{
    "sourceRoleId": 1,
    "targetRoleId": 2,
    "permissionsToClone": "all" // or ["can_view", "can_edit"]
}
```

#### Get Permission Matrix
- **URL**: `/api/combined-permissions/matrix`
- **Method**: `GET`
- **Description**: Get a matrix of permissions across all roles and categories
- **Response Example**:
```json
{
    "roles": ["Admin", "User", "Manager"],
    "permission_categories": [
        {
            "id": 1,
            "name": "Users",
            "permissions": {
                "Admin": {"can_view": true, "can_add": true},
                "User": {"can_view": true, "can_add": false}
            }
        }
    ]
}
```

#### Get Permission Statistics
- **URL**: `/api/combined-permissions/statistics`
- **Method**: `GET`
- **Description**: Get statistics about roles, groups, categories and permissions
- **Response Example**:
```json
{
    "total_roles": 10,
    "total_permission_groups": 5,
    "total_permission_categories": 20,
    "permissions_per_role": {
        "Admin": 15,
        "User": 8
    },
    "most_used_permissions": [
        {"name": "View Users", "count": 8},
        {"name": "Edit Profile", "count": 7}
    ]
}
```

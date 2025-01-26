# System API Documentation

## Overview
This document provides comprehensive documentation for the role-based permission system APIs.

## Base URL
All endpoints are prefixed with `/api/system`

## Authentication
All endpoints require authentication. Include the authentication token in the request header:
```http
Authorization: Bearer <your_token>
```

## Core APIs

### Role Management

#### Get All Roles
```http
GET /roles
```
Returns a list of all system roles.

**Response**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Admin",
			"description": "System Administrator",
			"is_active": true
		}
	]
}
```

#### Get Role by ID
```http
GET /roles/:id
```
Returns details of a specific role.

#### Get Role Details
```http
GET /roles/:id/details
```
Returns comprehensive details of a role including permissions, menus, and sub-menus.

**Response**
```json
{
	"success": true,
	"data": {
		"role": {
			"id": 1,
			"name": "Admin",
			"description": "System Administrator",
			"is_active": true
		},
		"permissions_by_group": [
			{
				"group_id": 1,
				"group_name": "User Management",
				"group_code": "USR_MGT",
				"categories": [
					{
						"id": 1,
						"name": "Users",
						"code": "USERS",
						"permissions": {
							"can_view": true,
							"can_add": true,
							"can_edit": true,
							"can_delete": true
						}
					}
				]
			}
		],
		"menus": [
			{
				"id": 1,
				"name": "Dashboard",
				"icon": "dashboard",
				"route_path": "/dashboard",
				"display_order": 1,
				"permission_category_name": "Dashboard",
				"sub_menus": [
					{
						"id": 1,
						"menu_id": 1,
						"name": "Analytics",
						"route_path": "/dashboard/analytics",
						"display_order": 1,
						"permission_category_name": "Dashboard Analytics"
					}
				]
			}
		]
	}
}
```

This endpoint provides:
- Basic role information
- Grouped permissions by permission groups and categories
- Accessible menus and sub-menus based on role permissions
- Permission category details for each menu item

#### Create Role
```http
POST /roles
```
Create a new role.

**Request Body**
```json
{
	"name": "Editor",
	"description": "Content Editor",
	"is_active": true
}
```

### Role Permission Management

#### Get Role Permissions
```http
GET /role-permissions/role/:roleId
```
Returns all permissions for a specific role.

**Response**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"role_id": 1,
			"permission_category_id": 1,
			"can_view": true,
			"can_add": true,
			"can_edit": true,
			"can_delete": false
		}
	]
}
```

#### Update Role Permissions
```http
PUT /role-permissions/:id
```
Update specific permission settings.

**Request Body**
```json
{
	"can_view": true,
	"can_add": true,
	"can_edit": false,
	"can_delete": false
}
```

### Permission Categories

#### Get All Categories
```http
GET /permission-categories
```
Returns all permission categories.

**Response**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "User Management",
			"short_code": "USR_MGT",
			"perm_group_id": 1,
			"enable_view": true,
			"enable_add": true,
			"enable_edit": true,
			"enable_delete": true
		}
	]
}
```

#### Create Category
```http
POST /permission-categories
```
Create a new permission category.

**Request Body**
```json
{
	"name": "User Management",
	"short_code": "USR_MGT",
	"perm_group_id": 1,
	"enable_view": true,
	"enable_add": true,
	"enable_edit": true,
	"enable_delete": true
}
```

### Permission Groups

#### Get All Groups
```http
GET /permission-groups
```
Returns all permission groups.

#### Get Group with Categories
```http
GET /permission-groups/:id/with-categories
```
Returns a permission group with its associated categories.

### Analytics and Statistics

#### Get Role Statistics
```http
GET /role-permissions/stats/:roleId
```
Returns statistics about role permissions.

**Response**
```json
{
	"success": true,
	"data": {
		"total_permissions": 25,
		"active_categories": 10,
		"total_groups": 5,
		"full_access_categories": 8
	}
}
```

## Error Handling

All endpoints return error responses in the following format:

```json
{
	"success": false,
	"error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Data Models

### Role
```json
{
	"id": "integer",
	"name": "string",
	"description": "string",
	"is_active": "boolean"
}
```

### Permission Category
```json
{
	"id": "integer",
	"name": "string",
	"short_code": "string",
	"perm_group_id": "integer",
	"enable_view": "boolean",
	"enable_add": "boolean",
	"enable_edit": "boolean",
	"enable_delete": "boolean"
}
```

### Role Permission
```json
{
	"id": "integer",
	"role_id": "integer",
	"permission_category_id": "integer",
	"can_view": "boolean",
	"can_add": "boolean",
	"can_edit": "boolean",
	"can_delete": "boolean"
}
```

### Permission Group
```json
{
	"id": "integer",
	"name": "string",
	"short_code": "string",
	"description": "string",
	"is_active": "boolean"
}
```
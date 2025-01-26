# Staff, Roles, and Permissions API Documentation

## Overview
This API provides endpoints for managing staff members, roles, and permission groups in the system.

## Base URL
```
/api/v1
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```http
Authorization: Bearer <token>
```

## Endpoints

### Staff Management

#### Get All Staff
```http
GET /staff
```
Returns a list of all staff members with their assigned roles.

**Response**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "John Doe",
			"email": "john@example.com",
			"is_active": true,
			"role_names": "Admin,Manager",
			"role_ids": "1,2"
		}
	]
}
```

#### Get Staff by ID
```http
GET /staff/:id
```
Returns details of a specific staff member.

#### Get Staff with Roles
```http
GET /staff/:id/roles
```
Returns staff member details with complete role information.

### Role Management

#### Get All Roles
```http
GET /roles
```
Returns a list of all roles with statistics.

**Response**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Admin",
			"description": "System Administrator",
			"is_active": true,
			"staff_count": 5,
			"permission_count": 20
		}
	]
}
```

#### Get Role Details
```http
GET /roles/:id
```
Returns complete role details including permissions and assigned staff.

### Permission Groups

#### Get All Permission Groups
```http
GET /permission-groups
```
Returns all permission groups with category counts.

**Response**
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "User Management",
			"short_code": "USR_MGT",
			"is_active": true,
			"category_count": 5
		}
	]
}
```

#### Get Group with Details
```http
GET /permission-groups/:id/details
```
Returns group details with categories and roles using these permissions.

## Data Models

### Staff Model
```json
{
	"id": "integer",
	"name": "string",
	"email": "string",
	"is_active": "boolean",
	"roles": [
		{
			"id": "integer",
			"name": "string"
		}
	]
}
```

### Role Model
```json
{
	"id": "integer",
	"name": "string",
	"description": "string",
	"is_active": "boolean",
	"permissions": [
		{
			"category_id": "integer",
			"can_view": "boolean",
			"can_add": "boolean",
			"can_edit": "boolean",
			"can_delete": "boolean"
		}
	]
}
```

### Permission Group Model
```json
{
	"id": "integer",
	"name": "string",
	"short_code": "string",
	"description": "string",
	"is_active": "boolean",
	"categories": [
		{
			"id": "integer",
			"name": "string",
			"short_code": "string"
		}
	]
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

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Database Schema

### staff
- id (PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR)
- is_active (BOOLEAN)

### roles
- id (PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- is_active (BOOLEAN)

### staff_roles
- id (PRIMARY KEY)
- staff_id (FOREIGN KEY)
- role_id (FOREIGN KEY)

### permission_group
- id (PRIMARY KEY)
- name (VARCHAR)
- short_code (VARCHAR)
- description (TEXT)
- is_active (BOOLEAN)

### permission_category
- id (PRIMARY KEY)
- name (VARCHAR)
- short_code (VARCHAR)
- perm_group_id (FOREIGN KEY)
- enable_view (BOOLEAN)
- enable_add (BOOLEAN)
- enable_edit (BOOLEAN)
- enable_delete (BOOLEAN)

### roles_permissions
- id (PRIMARY KEY)
- role_id (FOREIGN KEY)
- perm_cat_id (FOREIGN KEY)
- can_view (BOOLEAN)
- can_add (BOOLEAN)
- can_edit (BOOLEAN)
- can_delete (BOOLEAN)
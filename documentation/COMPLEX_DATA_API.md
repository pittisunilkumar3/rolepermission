# Complex Data Retrieval APIs

## Overview
These APIs provide endpoints for retrieving complex, joined data across multiple tables in the system.

## Base URL
```http
/api/complex-data
```

## Endpoints

### Get Staff Full Details
```http
GET /staff/:id/full-details
```
Retrieves comprehensive staff information including roles, permissions, and accessible menus.

**Parameters**
- `id` (path) - Staff member ID

**Response**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"name": "John Doe",
		"email": "john@example.com",
		"roles": [
			{
				"id": 1,
				"name": "Admin",
				"description": "System Administrator",
				"permissions": [
					{
						"category_id": 1,
						"category_name": "User Management",
						"category_code": "USR_MGT",
						"group_id": 1,
						"group_name": "System Administration",
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
				"route_path": "/dashboard",
				"sub_menus": [
					{
						"id": 1,
						"name": "Analytics",
						"route_path": "/dashboard/analytics"
					}
				]
			}
		]
	}
}
```

### Get Role Full Details
```http
GET /roles/:id/full-details
```
Retrieves comprehensive role information including permissions, groups, and assigned staff count.

**Parameters**
- `id` (path) - Role ID

**Response**
```json
{
	"success": true,
	"data": {
		"id": 1,
		"name": "Admin",
		"description": "System Administrator",
		"assigned_staff_count": 5,
		"permission_groups": [
			{
				"id": 1,
				"name": "System Administration",
				"code": "SYS_ADMIN",
				"categories": [
					{
						"id": 1,
						"name": "User Management",
						"code": "USR_MGT",
						"permissions": {
							"can_view": true,
							"can_add": true,
							"can_edit": true,
							"can_delete": true
						}
					}
				]
			}
		]
	}
}
```

## Error Responses

### Not Found (404)
```json
{
	"success": false,
	"error": "Staff not found"
}
```

### Server Error (500)
```json
{
	"success": false,
	"error": "Error message description"
}
```

## Database Relationships

The APIs utilize the following table relationships:

```
staff
  ├── staff_roles
  │     └── roles
  │           └── roles_permissions
  │                 └── permission_category
  │                       └── permission_group
  └── sidebar_menus
		└── sidebar_sub_menus
```

## Implementation Notes

1. The APIs use LEFT JOINs to ensure all related data is retrieved even if some relationships are missing.
2. Results are transformed from flat database rows into nested JSON structures.
3. Duplicate data is removed during the transformation process.
4. Performance is optimized through proper indexing of foreign keys.
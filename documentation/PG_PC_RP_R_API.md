# Permission Management API Reference

## Models

### PermGroupCatRolesPerm
Main class handling permission operations across roles, groups, and categories.

#### Methods

##### getStatistics()
Get statistics about roles, groups, categories and permissions.

**Returns**: Promise<Object>
```js
{
	total_roles: number,
	total_permission_groups: number,
	total_permission_categories: number,
	permissions_per_role: Object,
	most_used_permissions: Array
}
```

##### validateRolePermissions(roleId, requiredPermissions)
Validate if a role has all required permissions.

**Parameters**:
- roleId: number - The ID of the role to validate
- requiredPermissions: Array<Object> - Array of required permission objects
  - permission_category_id: number
  - required_actions: Array<string>

**Returns**: Promise<boolean>

##### cloneRolePermissions(sourceRoleId, targetRoleId, permissionsToClone)
Clone permissions from one role to another.

**Parameters**:
- sourceRoleId: number - The ID of the source role
- targetRoleId: number - The ID of the target role
- permissionsToClone: string|Array<string> - 'all' or array of permission types

**Returns**: Promise<Object>

##### getPermissionMatrix()
Get a matrix of permissions across all roles and categories.

**Returns**: Promise<Object>
```js
{
	roles: Array<string>,
	permission_categories: Array<Object>
}
```

## Database Schema

### Tables

#### roles
- id (PRIMARY KEY)
- name (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

#### roles_permissions
- id (PRIMARY KEY)
- role_id (FOREIGN KEY)
- perm_cat_id (FOREIGN KEY)
- can_view (BOOLEAN)
- can_add (BOOLEAN)
- can_edit (BOOLEAN)
- can_delete (BOOLEAN)

#### permission_category
- id (PRIMARY KEY)
- name (VARCHAR)
- code (VARCHAR)
- perm_group_id (FOREIGN KEY)
- enable_view (BOOLEAN)
- enable_add (BOOLEAN)
- enable_edit (BOOLEAN)
- enable_delete (BOOLEAN)

#### permission_group
- id (PRIMARY KEY)
- name (VARCHAR)
- code (VARCHAR)
- is_active (BOOLEAN)

## API Endpoints

### Statistics
GET `/api/combined-permissions/statistics`
Returns statistics about roles, groups, categories and permissions.

### Role Validation
POST `/api/combined-permissions/validate/role/:roleId`
Validate if a role has specific permissions.

### Permission Cloning
POST `/api/combined-permissions/clone`
Clone permissions from one role to another.

### Permission Matrix
GET `/api/combined-permissions/matrix`
Get a matrix view of roles and their permissions.

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

### Error Response Format
```json
{
	"error": string,
	"message": string,
	"details": Object (optional)
}
```

## Best Practices

1. Always validate role IDs before operations
2. Use bulk operations for multiple permission updates
3. Check permission dependencies before deletion
4. Maintain audit logs for permission changes
5. Regular backup of permission configurations

## Security Considerations

1. Validate all input parameters
2. Implement rate limiting
3. Use proper authentication and authorization
4. Sanitize database queries
5. Log security-sensitive operations

## Examples

### Validating Role Permissions
```javascript
const required = [
	{ 
		permission_category_id: 1, 
		required_actions: ['can_view', 'can_edit'] 
	}
];
const isValid = await PermGroupCatRolesPerm.validateRolePermissions(1, required);
```

### Cloning Permissions
```javascript
// Clone all permissions
await PermGroupCatRolesPerm.cloneRolePermissions(1, 2, 'all');

// Clone specific permissions
await PermGroupCatRolesPerm.cloneRolePermissions(1, 2, ['can_view', 'can_edit']);
```

## Database Tables
- roles
- roles_permissions
- permission_category
- permission_group

## Table Relationships
- roles.id = roles_permissions.role_id
- roles_permissions.perm_cat_id = permission_category.id
- permission_category.perm_group_id = permission_group.id

## Endpoints

### 1. Get All Combined Permissions
- **URL**: `/api/combined-permissions`
- **Method**: `GET`
- **Description**: Retrieves all roles permissions with their associated permission categories and permission groups
- **Response Example**:
```json
{
	"data": [
		{
			"role_id": 1,
			"role_name": "Admin",
			"role_permission_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1,
			"permission_category_id": 1,
			"permission_category_name": "User Management",
			"permission_category_code": "user-mgmt",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 1,
			"enable_delete": 1,
			"permission_group_id": 1,
			"permission_group_name": "System",
			"permission_group_code": "system",
			"permission_group_active": 1
		}
	]
}
```

### 2. Get Combined Permissions by Role
- **URL**: `/api/combined-permissions/role/:roleId`
- **Method**: `GET`
- **URL Params**:
	- Required: `roleId=[integer]`
- **Description**: Retrieves all permissions for a specific role with associated permission categories and permission groups
- **Response Example**:
```json
{
	"data": [
		{
			"role_id": 1,
			"role_name": "Admin",
			"role_permission_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 1,
			"permission_category_id": 1,
			"permission_category_name": "User Management",
			"permission_category_code": "user-mgmt",
			"enable_view": 1,
			"enable_add": 1,
			"enable_edit": 1,
			"enable_delete": 1,
			"permission_group_id": 1,
			"permission_group_name": "System",
			"permission_group_code": "system",
			"permission_group_active": 1
		}
	]
}
```

### 3. Get Combined Permissions by Group
- **URL**: `/api/combined-permissions/group/:groupId`
- **Method**: `GET`
- **URL Params**:
	- Required: `groupId=[integer]`
- **Description**: Retrieves all permissions for a specific permission group
- **Response Example**: Same structure as above

### 4. Get Combined Permissions by Category
- **URL**: `/api/combined-permissions/category/:categoryId`
- **Method**: `GET`
- **URL Params**:
	- Required: `categoryId=[integer]`
- **Description**: Retrieves all permissions for a specific permission category
- **Response Example**: Same structure as above

### 5. Update Role Permissions
- **URL**: `/api/combined-permissions/role/:roleId`
- **Method**: `PUT`
- **URL Params**:
	- Required: `roleId=[integer]`
- **Payload Example**:
```json
{
	"permissions": [
		{
			"permission_category_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 0
		}
	]
}
```

### 6. Bulk Update Role Permissions
- **URL**: `/api/combined-permissions/bulk-update`
- **Method**: `PUT`
- **Payload Example**:
```json
{
	"role_permissions": [
		{
			"role_id": 1,
			"permission_category_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 1,
			"can_delete": 0
		}
	]
}
```

### Error Responses
All endpoints may return the following errors:

- **404 Not Found**:
```json
{
	"message": "Resource not found"
}
```

- **500 Server Error**:
```json
{
	"error": "Internal server error message"
}
```

### 7. Search Combined Permissions
- **URL**: `/api/combined-permissions/search`
- **Method**: `POST`
- **Description**: Search permissions across all tables with filters
- **Payload Example**:
```json
{
    "filters": {
        "role_name": "Admin",
        "permission_group_code": "system",
        "permission_category_code": "user-mgmt",
        "has_permissions": {
            "can_view": true,
            "can_add": true
        }
    },
    "sort": {
        "field": "role_name",
        "order": "asc"
    }
}
```

### 8. Get Permission Statistics
- **URL**: `/api/combined-permissions/statistics`
- **Method**: `GET`
- **Description**: Get statistics about permissions distribution
- **Response Example**:
```json
{
    "data": {
        "total_roles": 5,
        "total_permission_groups": 3,
        "total_permission_categories": 10,
        "permissions_per_role": {
            "Admin": 15,
            "Manager": 10,
            "User": 5
        },
        "most_used_permissions": [
            {
                "category": "User Management",
                "count": 20
            }
        ]
    }
}
```

### 9. Validate Role Permissions
- **URL**: `/api/combined-permissions/validate/role/:roleId`
- **Method**: `POST`
- **Description**: Validate if a role has specific permissions
- **Payload Example**:
```json
{
    "required_permissions": [
        {
            "permission_category_id": 1,
            "required_actions": ["can_view", "can_edit"]
        }
    ]
}
```

### 10. Clone Role Permissions
- **URL**: `/api/combined-permissions/clone`
- **Method**: `POST`
- **Description**: Clone permissions from one role to another
- **Payload Example**:
```json
{
    "source_role_id": 1,
    "target_role_id": 2,
    "permissions_to_clone": ["all"] // or ["can_view", "can_edit"]
}
```

### 11. Get Permission Changes History
- **URL**: `/api/combined-permissions/history`
- **Method**: `GET`
- **URL Params**:
    - Optional: 
        - `role_id=[integer]`
        - `from_date=[date]`
        - `to_date=[date]`
- **Response Example**:
```json
{
    "data": [
        {
            "change_id": 1,
            "role_id": 1,
            "role_name": "Admin",
            "permission_category": "User Management",
            "changed_field": "can_delete",
            "old_value": 0,
            "new_value": 1,
            "changed_at": "2024-02-20T10:00:00.000Z",
            "changed_by": "system"
        }
    ]
}
```

### 12. Batch Permission Check
- **URL**: `/api/combined-permissions/check-batch`
- **Method**: `POST`
- **Description**: Check multiple permission combinations in one request
- **Payload Example**:
```json
{
    "checks": [
        {
            "role_id": 1,
            "permission_category_id": 1,
            "actions": ["can_view", "can_edit"]
        }
    ]
}
```

### 13. Get Permission Matrix
- **URL**: `/api/combined-permissions/matrix`
- **Method**: `GET`
- **Description**: Get a matrix view of roles and their permissions
- **Response Example**:
```json
{
    "data": {
        "roles": ["Admin", "Manager", "User"],
        "permission_categories": [
            {
                "id": 1,
                "name": "User Management",
                "permissions": {
                    "Admin": ["view", "add", "edit", "delete"],
                    "Manager": ["view", "edit"],
                    "User": ["view"]
                }
            }
        ]
    }
}
```

### 14. Sync Role Permissions
- **URL**: `/api/combined-permissions/sync`
- **Method**: `POST`
- **Description**: Synchronize permissions between roles or update to a template
- **Payload Example**:
```json
{
    "template": "default_admin",
    "roles": [1, 2, 3],
"sync_options": {
	"override_existing": true,
	"sync_only_missing": false
}

"data": {
	"role": {
		"id": 1,
		"name": "Admin",
		"created_at": "2024-02-20T10:00:00.000Z"
	},
	"permissions_by_group": [
		{
			"group_id": 1,
			"group_name": "System",
			"group_code": "system",
			"categories": [
				{
					"category_id": 1,
					"category_name": "User Management",
					"category_code": "user-mgmt",
					"permissions": {
						"can_view": 1,
						"can_add": 1,
						"can_edit": 1,
						"can_delete": 1
					}
				}
			]
		}
	],
	"permission_summary": {
		"total_permissions": 15,
		"groups_with_access": 3,
		"categories_with_access": 10,
		"full_access_categories": 5
	}
}

"data": {
	"role_name": "Admin",
	"permission_tree": [
		{
			"group": {
				"id": 1,
				"name": "System",
				"code": "system"
			},
			"categories": [
				{
					"id": 1,
					"name": "User Management",
					"code": "user-mgmt",
					"access_level": "full",
					"permissions": ["view", "add", "edit", "delete"]
				}
			]
		}
	]
}

"role_ids": [1, 2]
"data": {
	"common_permissions": {
		"User Management": ["view"],
		"Content Management": ["view", "edit"]
	},
	"differences": {
		"role_1": {
			"unique_permissions": {
				"User Management": ["add", "delete"],
				"System Settings": ["all"]
			}
		},
		"role_2": {
			"unique_permissions": {
				"Content Management": ["delete"]
			}
		}
	}
}

# Permission Group Combined with Permission Category API Documentation

## Database Tables
- roles
- roles_permissions
- permission_category
- permission_group

## Table Relationships
- roles.id = roles_permissions.role_id
- roles_permissions.perm_cat_id = permission_category.id
- permission_category.perm_group_id = permission_group.id

## Endpoints

### 1. Get All Combined Permissions
[Previous endpoints 1-14 content remains the same...]

### 15. Get Role Permission Dependencies
- **URL**: `/api/combined-permissions/role/:roleId/dependencies/:categoryId`
- **Method**: `GET`
- **Description**: Get hierarchical dependencies for a specific permission category within a role
- **Response Example**:
```json
{
	"data": {
		"category_id": 1,
		"category_name": "User Management",
		"dependencies": [
			{
				"id": 2,
				"name": "Group Management",
				"type": "required"
			}
		]
	}
}
```

### 16. Get Role Permission Inheritance
- **URL**: `/api/combined-permissions/role/:roleId/inheritance`
- **Method**: `GET`
- **Description**: Get inherited permissions from parent roles
- **Response Example**:
```json
{
	"data": {
		"inherited_from": [
			{
				"role_id": 2,
				"role_name": "Parent Role",
				"permissions": [
					{
						"category": "User Management",
						"permissions": ["view", "edit"]
					}
				]
			}
		]
	}
}
```

### 17. Get Role Permission Conflicts
- **URL**: `/api/combined-permissions/role/:roleId/conflicts`
- **Method**: `GET`
- **Description**: Get any conflicting permissions within the role
- **Response Example**:
```json
{
	"data": {
		"conflicts": [
			{
				"category1": "User Management",
				"category2": "System Settings",
				"conflict_type": "mutual_exclusion"
			}
		]
	}
}
```

### 18. Get Role Permission Usage Analytics
- **URL**: `/api/combined-permissions/role/:roleId/analytics`
- **Method**: `GET`
- **Description**: Get detailed analytics about permission usage
- **Response Example**:
```json
{
	"data": {
		"most_used_permissions": [
			{
				"category": "User Management",
				"usage_count": 150
			}
		],
		"unused_permissions": [
			{
				"category": "Archive Management",
				"last_used": null
			}
		]
	}
}
```

### 19. Get Role Permission Audit Trail
- **URL**: `/api/combined-permissions/role/:roleId/audit`
- **Method**: `GET`
- **URL Params**:
	- Optional:
		- `from_date=[date]`
		- `to_date=[date]`
- **Description**: Get audit trail of permission changes
- **Response Example**:
```json
{
	"data": {
		"audit_trail": [
			{
				"timestamp": "2024-02-20T10:00:00Z",
				"user": "admin",
				"action": "modified",
				"category": "User Management",
				"changes": {
					"can_delete": true
				}
			}
		]
	}
}
```

### 20. Get Role Permission Recommendations
- **URL**: `/api/combined-permissions/role/:roleId/recommendations`
- **Method**: `GET`
- **Description**: Get recommendations for permission improvements
- **Response Example**:
```json
{
	"data": {
		"recommendations": [
			{
				"category": "User Management",
				"suggestion": "Add delete permission based on usage patterns",
				"impact": "medium"
			}
		]
	}
}
```

### 21. Bulk Permission Assignment
- **URL**: `/api/combined-permissions/bulk-assign`
- **Method**: `POST`
- **Description**: Assign multiple permissions to multiple roles

### 22. Permission Template Management
- **URL**: `/api/combined-permissions/templates`
- **Method**: `POST`
- **Description**: Create or update permission templates

### 23. Role Permission Export
- **URL**: `/api/combined-permissions/role/:roleId/export`
- **Method**: `GET`
- **Description**: Export role permissions in various formats

### 24. Role Permission Import
- **URL**: `/api/combined-permissions/role/:roleId/import`
- **Method**: `POST`
- **Description**: Import role permissions from external source

### 25. Role Permission Backup
- **URL**: `/api/combined-permissions/role/:roleId/backup`
- **Method**: `POST`
- **Description**: Create a backup of current role permissions

### 26. Role Permission Restore
- **URL**: `/api/combined-permissions/role/:roleId/restore`
- **Method**: `POST`
- **Description**: Restore permissions from a backup

### 27. Role Permission Batch Validation
- **URL**: `/api/combined-permissions/validate/batch`
- **Method**: `POST`
- **Description**: Validate multiple role permissions in one request

### 28. Role Permission Health Check
- **URL**: `/api/combined-permissions/role/:roleId/health`
- **Method**: `GET`
- **Description**: Check for permission inconsistencies and issues

### 29. Role Permission Cleanup
- **URL**: `/api/combined-permissions/role/:roleId/cleanup`
- **Method**: `POST`
- **Description**: Remove unused or invalid permissions

### 30. Role Permission Migration
- **URL**: `/api/combined-permissions/role/:roleId/migrate`
- **Method**: `POST`
- **Description**: Migrate permissions to a new structure

### 31. Create Permission Template
- **URL**: `/api/templates`
- **Method**: `POST`
- **Description**: Create a new permission template
- **Payload Example**:
```json
{
	"name": "basic_user",
	"permissions": [
		{
			"category_id": 1,
			"can_view": 1,
			"can_add": 0,
			"can_edit": 0,
			"can_delete": 0
		}
	]
}
```

### 32. Get All Templates
- **URL**: `/api/templates`
- **Method**: `GET`
- **Description**: Retrieve all permission templates

### 33. Get Template by Name
- **URL**: `/api/templates/:name`
- **Method**: `GET`
- **Description**: Retrieve a specific template by name

### 34. Update Template
- **URL**: `/api/templates/:name`
- **Method**: `PUT`
- **Description**: Update an existing template
- **Payload Example**:
```json
{
	"permissions": [
		{
			"category_id": 1,
			"can_view": 1,
			"can_add": 1,
			"can_edit": 0,
			"can_delete": 0
		}
	]
}
```

### 35. Delete Template
- **URL**: `/api/templates/:name`
- **Method**: `DELETE`
- **Description**: Delete a template

### 36. Apply Template to Role
- **URL**: `/api/templates/:name/apply/:roleId`
- **Method**: `POST`
- **Description**: Apply a template to a role, replacing existing permissions

### 37. Export Template to Role
- **URL**: `/api/templates/:name/export/:roleId`
- **Method**: `POST`
- **Description**: Export a template to a role, merging with existing permissions

### 38. Import Role Permissions as Template
- **URL**: `/api/templates/import/role/:roleId`
- **Method**: `POST`
- **Description**: Create a new template from existing role permissions
- **Payload Example**:
```json
{
	"template_name": "custom_template",
	"include_categories": ["user-mgmt", "content-mgmt"]
}
```

### 39. Clone Template
- **URL**: `/api/templates/:name/clone`
- **Method**: `POST`
- **Description**: Create a copy of an existing template
- **Payload Example**:
```json
{
	"new_name": "custom_template_v2",
	"modify_permissions": {
		"add_categories": [1, 2],
		"remove_categories": [3]
	}
}
```

### 40. Template Version Control
- **URL**: `/api/templates/:name/versions`
- **Method**: `GET`
- **Description**: Get version history of a template

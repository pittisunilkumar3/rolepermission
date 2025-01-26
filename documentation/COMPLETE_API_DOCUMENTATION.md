# Complete Role-Based Permission System Documentation

## System Overview

### Architecture
The system implements a hierarchical role-based access control (RBAC) with the following components:
- Staff Management
- Role Management
- Permission Groups & Categories
- Menu Access Control
- Audit Logging

### Database Schema
```sql
-- Staff table
CREATE TABLE staff (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	is_active BOOLEAN DEFAULT true,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	description TEXT,
	is_active BOOLEAN DEFAULT true,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);

-- Permission Groups
CREATE TABLE permission_group (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	short_code VARCHAR(50) UNIQUE NOT NULL,
	description TEXT,
	is_active BOOLEAN DEFAULT true,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP
);

-- Permission Categories
CREATE TABLE permission_category (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	short_code VARCHAR(50) NOT NULL,
	perm_group_id INT,
	enable_view BOOLEAN DEFAULT true,
	enable_add BOOLEAN DEFAULT true,
	enable_edit BOOLEAN DEFAULT true,
	enable_delete BOOLEAN DEFAULT true,
	FOREIGN KEY (perm_group_id) REFERENCES permission_group(id)
);

-- Role Permissions
CREATE TABLE roles_permissions (
	id INT PRIMARY KEY AUTO_INCREMENT,
	role_id INT,
	perm_cat_id INT,
	can_view BOOLEAN DEFAULT false,
	can_add BOOLEAN DEFAULT false,
	can_edit BOOLEAN DEFAULT false,
	can_delete BOOLEAN DEFAULT false,
	FOREIGN KEY (role_id) REFERENCES roles(id),
	FOREIGN KEY (perm_cat_id) REFERENCES permission_category(id)
);
```

## API Endpoints

### Staff Management

#### Get All Staff
```http
GET /api/staff
Authorization: Bearer <token>
```

Response:
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "John Doe",
			"email": "john@example.com",
			"is_active": true,
			"roles": ["Admin", "Manager"]
		}
	]
}
```

#### Get Staff with Roles
```http
GET /api/staff/:id/roles
Authorization: Bearer <token>
```

Response:
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
				"permissions": [...]
			}
		]
	}
}
```

### Role Management

#### Get Role Details
```http
GET /api/roles/:id/details
Authorization: Bearer <token>
```

Response:
```json
{
	"success": true,
	"data": {
		"role": {
			"id": 1,
			"name": "Admin",
			"description": "System Administrator"
		},
		"permissions_by_group": [
			{
				"group_id": 1,
				"group_name": "User Management",
				"categories": [
					{
						"id": 1,
						"name": "Users",
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

### Permission Management

#### Get Permission Groups
```http
GET /api/permission-groups
Authorization: Bearer <token>
```

Response:
```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "User Management",
			"short_code": "USR_MGT",
			"categories": [...]
		}
	]
}
```

## Implementation Examples

### Authentication
```javascript
const headers = {
	'Authorization': `Bearer ${token}`,
	'Content-Type': 'application/json'
};

// Make authenticated request
const response = await fetch('/api/roles', {
	headers,
	method: 'GET'
});
```

### Permission Check
```javascript
const checkPermission = async (staffId, permission) => {
	const response = await fetch(`/api/staff/${staffId}/permissions/${permission}`);
	const { data } = await response.json();
	return data.has_permission;
};
```

## Error Handling

### Standard Error Response
```json
{
	"success": false,
	"error": {
		"code": "ERROR_CODE",
		"message": "Error description"
	}
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Guidelines

### Authentication
- Use JWT tokens for authentication
- Implement token refresh mechanism
- Set appropriate token expiration
- Store tokens securely

### Authorization
- Validate permissions for each request
- Implement role hierarchy
- Use principle of least privilege
- Regular permission audits

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## Best Practices

1. Role Management
   - Create roles with minimal required permissions
   - Regular role audits
   - Document role changes
   - Implement role hierarchy

2. Permission Assignment
   - Group related permissions
   - Regular permission reviews
   - Maintain audit trails
   - Follow least privilege principle

3. API Usage
   - Proper error handling
   - Input validation
   - Rate limiting
   - Response caching

4. Security
   - Regular security audits
   - Token rotation
   - Permission validation
   - Access logging
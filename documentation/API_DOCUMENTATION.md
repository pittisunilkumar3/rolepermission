# Role-Based Permission System Documentation

## System Architecture

### Overview
The role-based permission system provides a comprehensive solution for managing user roles, permissions, and access control within the application.

### Core Components
1. Staff Management
2. Role Management
3. Permission Groups
4. Permission Categories
5. Menu Access Control

## Database Schema

### Tables Relationship
```
staff ─┬─── staff_roles ───┬── roles
       │                   └── roles_permissions ── permission_category ── permission_group
       └─── sidebar_menus ─── sidebar_sub_menus
```

### Table Definitions

#### staff
```sql
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true
);
```

#### roles
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);
```

#### permission_group
```sql
CREATE TABLE permission_group (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    short_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);
```

## API Endpoints

### Staff Management

#### Get All Staff
- **Endpoint**: `GET /api/staff`
- **Description**: Retrieves all staff members with their roles
- **Authentication**: Required
- **Response**:
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

### Role Management

#### Get Role Details
- **Endpoint**: `GET /api/roles/:id/details`
- **Description**: Retrieves comprehensive role information
- **Authentication**: Required
- **Response**:
```json
{
    "success": true,
    "data": {
        "role": {
            "id": 1,
            "name": "Admin",
            "description": "System Administrator"
        },
        "permissions": [...],
        "staff": [...]
    }
}
```

### Permission Management

#### Get Permission Groups
- **Endpoint**: `GET /api/permission-groups`
- **Description**: Retrieves all permission groups
- **Authentication**: Required
- **Response**:
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

## Implementation Guide

### Authentication
```javascript
// Include JWT token in headers
const headers = {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
};
```

### Role Assignment
```javascript
// Assign role to staff
const assignRole = async (staffId, roleId) => {
    const response = await fetch(`/api/staff/${staffId}/roles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ role_id: roleId })
    });
    return response.json();
};
```

### Permission Validation
```javascript
// Check permission
const hasPermission = async (staffId, permission) => {
    const response = await fetch(`/api/staff/${staffId}/permissions/${permission}`);
    const { data } = await response.json();
    return data.has_permission;
};
```

## Error Handling

### Error Response Format
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "Error description",
        "details": {}
    }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data

## Security Considerations

### Authentication
- JWT-based authentication
- Token expiration and refresh mechanism
- Secure token storage

### Authorization
- Role-based access control
- Permission validation per request
- Menu access filtering

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Best Practices

### Role Management
1. Always assign default role to new staff
2. Implement role hierarchy
3. Regular permission audit
4. Document role changes

### Permission Assignment
1. Follow principle of least privilege
2. Group related permissions
3. Regular permission review
4. Audit trail for changes

### API Usage
1. Use proper HTTP methods
2. Implement rate limiting
3. Version API endpoints
4. Comprehensive error handling

## Deployment Considerations

### Environment Setup
1. Database configuration
2. JWT secret management
3. CORS configuration
4. Rate limiting setup

### Performance Optimization
1. Permission caching
2. Database indexing
3. Query optimization
4. Response compression

## Monitoring and Maintenance

### Logging
1. Authentication attempts
2. Permission changes
3. Role modifications
4. Access patterns

### Auditing
1. Permission changes
2. Role assignments
3. Access violations
4. System modifications

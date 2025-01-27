# Permission Group Combined with Permission Category API Documentation

## Endpoints

### Get All Permission Categories by Group ID
- **URL**: `/api/group/:groupId/categories`
- **Method**: `GET`
- **URL Params**: 
	- Required: `groupId=[integer]`
- **Success Response**:
	- Code: 200
	- Content: Array of permission category objects
- **Error Response**:
	- Code: 500
	- Content: `{ error: "Error message" }`

### Get Single Permission Category
- **URL**: `/api/group/:groupId/categories/:catId`
- **Method**: `GET`
- **URL Params**:
	- Required: 
		- `groupId=[integer]`
		- `catId=[integer]`
- **Success Response**:
	- Code: 200
	- Content: Permission category object
- **Error Response**:
	- Code: 404
	- Content: `{ message: "Category not found" }`
	- OR
	- Code: 500
	- Content: `{ error: "Error message" }`

### Delete All Permission Categories by Group ID
- **URL**: `/api/group/:groupId/categories`
- **Method**: `DELETE`
- **URL Params**:
	- Required: `groupId=[integer]`
- **Success Response**:
	- Code: 200
	- Content: `{ message: "Categories deleted successfully" }`
- **Error Response**:
	- Code: 500
	- Content: `{ error: "Error message" }`

### Delete Single Permission Category
- **URL**: `/api/group/:groupId/categories/:catId`
- **Method**: `DELETE`
- **URL Params**:
	- Required:
		- `groupId=[integer]`
		- `catId=[integer]`
- **Success Response**:
	- Code: 200
	- Content: `{ message: "Category deleted successfully" }`
- **Error Response**:
	- Code: 500
	- Content: `{ error: "Error message" }`

### Create Single Permission Category
- **URL**: `/api/group/:groupId/categories`
- **Method**: `POST`
- **URL Params**:
    - Required: `groupId=[integer]`
- **Data Params**:
    ```json
    {
        "name": "string",
        "short_code": "string",
        "enable_view": 0|1,
        "enable_add": 0|1,
        "enable_edit": 0|1,
        "enable_delete": 0|1
    }
    ```
- **Success Response**:
    - Code: 201
    - Content: `{ message: "Category created successfully" }`
- **Error Response**:
    - Code: 500
    - Content: `{ error: "Error message" }`

### Create Multiple Permission Categories
- **URL**: `/api/group/:groupId/categories/bulk`
- **Method**: `POST`
- **URL Params**:
    - Required: `groupId=[integer]`
- **Data Params**:
    ```json
    {
        "categories": [
            {
                "name": "string",
                "short_code": "string",
                "enable_view": 0|1,
                "enable_add": 0|1,
                "enable_edit": 0|1,
                "enable_delete": 0|1
            }
        ]
    }
    ```
- **Success Response**:
    - Code: 201
    - Content: `{ message: "Categories created successfully" }`
- **Error Response**:
    - Code: 500
    - Content: `{ error: "Error message" }`

### Update All Permission Categories by Group ID
- **URL**: `/api/group/:groupId/categories`
- **Method**: `PUT`
- **URL Params**:
	- Required: `groupId=[integer]`
- **Data Params**:
	```json
	{
		"name": "string",
		"short_code": "string",
		"enable_view": 0|1,
		"enable_add": 0|1,
		"enable_edit": 0|1,
		"enable_delete": 0|1
	}
	```
- **Success Response**:
	- Code: 200
	- Content: `{ message: "Categories updated successfully" }`
- **Error Response**:
	- Code: 500
	- Content: `{ error: "Error message" }`

### Update Single Permission Category
- **URL**: `/api/group/:groupId/categories/:catId`
- **Method**: `PUT`
- **URL Params**:
	- Required:
		- `groupId=[integer]`
		- `catId=[integer]`
- **Data Params**:
	```json
	{
		"name": "string",
		"short_code": "string",
		"enable_view": 0|1,
		"enable_add": 0|1,
		"enable_edit": 0|1,
		"enable_delete": 0|1
	}
	```
- **Success Response**:
	- Code: 200
	- Content: `{ message: "Category updated successfully" }`
- **Error Response**:
	- Code: 500
	- Content: `{ error: "Error message" }`
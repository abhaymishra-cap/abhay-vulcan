# JSON Server Mock API Setup

This project uses JSON Server to mock the backend API for development.

## Quick Start

### 1. Start the Mock API Server

```bash
npm run mock-api
```

This will start the JSON Server on `http://localhost:3001`

### 2. Start the Frontend with Mock API

In a separate terminal:

```bash
REACT_APP_USE_MOCK_API=true npm start
```

Or use the combined command:

```bash
npm run start:mock
```

## Available Endpoints

The mock API provides the following endpoints:

- **GET** `/api/v1/categories` - Get all categories (supports query params: `page`, `limit`, `search`, `status`, `parentCategoryId`)
- **GET** `/api/v1/categories/:id` - Get single category by ID
- **POST** `/api/v1/categories` - Create new category
- **PUT** `/api/v1/categories/:id` - Update category
- **DELETE** `/api/v1/categories/:id` - Delete category

## Database File

The mock data is stored in `mock-api/db.json`. This file will be automatically updated when you create, update, or delete categories through the API.

## Switching Between Mock and Real API

### Use Mock API (Development)
Set environment variable:
```bash
REACT_APP_USE_MOCK_API=true npm start
```

### Use Real API (Production)
Don't set the environment variable, or set it to false:
```bash
REACT_APP_USE_MOCK_API=false npm start
```

## Response Format

All endpoints return responses in this format:

**Success:**
```json
{
  "success": true,
  "data": [...]
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Custom Features

The mock server includes:
- Search functionality (searches name, id, and description)
- Pagination support
- Status filtering
- Parent category filtering
- Automatic ID generation
- Initials generation from category name
- Validation (prevents deleting categories with children)

## Troubleshooting

### Port Already in Use
If port 3001 is already in use, you can change it:
```bash
MOCK_API_PORT=3002 npm run mock-api
```

### CORS Issues
The mock server is configured to allow CORS from all origins. If you encounter CORS issues, check that the server is running and accessible.

### Data Not Persisting
The `db.json` file is updated automatically. If changes aren't persisting, check file permissions.



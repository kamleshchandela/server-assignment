# Notes Management REST API

A production-ready REST API for managing notes built with Node.js, Express.js, MongoDB, and Mongoose following MVC architecture.

## Features

- CRUD operations for notes
- Bulk create and delete operations
- Full and partial updates (PUT and PATCH)
- Proper validation and error handling
- Consistent response format
- MongoDB timestamps

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI

## Usage

1. Start the server:
```bash
npm start
```

2. For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/notes | Create a note |
| POST | /api/notes/bulk | Create multiple notes |
| GET | /api/notes | Get all notes |
| GET | /api/notes/:id | Get note by ID |
| PUT | /api/notes/:id | Full update a note |
| PATCH | /api/notes/:id | Partial update a note |
| DELETE | /api/notes/:id | Delete a note |
| DELETE | /api/notes/bulk | Delete multiple notes |

## Note Schema

```javascript
{
  title: String (required),
  content: String (required),
  category: Enum ['work', 'personal', 'study'] (default: 'personal'),
  isPinned: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Response Format

```javascript
{
  success: Boolean,
  message: String,
  data: Object/Array
}
```

## Testing

See `POSTMAN_TESTING.txt` for detailed testing instructions using Postman.

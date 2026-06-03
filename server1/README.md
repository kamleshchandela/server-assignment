# Server 1 — Basic Notes CRUD API

A foundational REST API for managing notes, built with **Node.js**, **Express 4.x**, and **MongoDB (Mongoose 8.x)** following the **MVC (Model-View-Controller)** architectural pattern. This is the first of three progressively enhanced servers in the assignment suite.

---

## Overview

Server 1 provides complete **CRUD (Create, Read, Update, Delete)** operations for a notes resource, including bulk operations and both full and partial updates. It serves as the baseline implementation upon which Servers 2 and 3 build additional capabilities like filtering, sorting, pagination, and advanced query combinations.

| Attribute | Value |
|-----------|-------|
| **Port** | `3000` |
| **Total Endpoints** | 8 |
| **Module System** | CommonJS (`require` / `module.exports`) |
| **Template Engine** | None (pure REST JSON API) |
| **Database** | MongoDB (via Mongoose ODM) |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime environment |
| Express | 4.18.x | Web framework / router |
| Mongoose | 8.0.x | MongoDB ODM (schema modeling, validation, querying) |
| dotenv | 16.3.x | Environment variable management |
| nodemon | 3.0.x | Development auto-reload |

---

## Project Structure

```
server1/
└── notes-app/
    ├── .env.example              # Environment variable template
    ├── .gitignore                # Git ignore rules
    ├── package.json              # Dependencies and scripts
    ├── package-lock.json         # Dependency lock file
    ├── README.md                 # Detailed API documentation
    └── src/
        ├── index.js              # Entry point — starts server & connects DB
        ├── app.js                # Express app configuration & middleware
        ├── config/
        │   └── db.js             # MongoDB connection logic
        ├── controllers/
        │   └── note.controller.js  # Request handlers (business logic)
        ├── models/
        │   └── note.model.js     # Mongoose schema & model
        └── routes/
            └── note.routes.js    # Route definitions
```

---

## API Endpoints

### Notes CRUD

| Method | Endpoint | Description | Controller |
|--------|----------|-------------|------------|
| `POST` | `/api/notes` | Create a single note | `createNote` |
| `POST` | `/api/notes/bulk` | Create multiple notes at once | `createBulkNotes` |
| `GET` | `/api/notes` | Retrieve all notes | `getAllNotes` |
| `GET` | `/api/notes/:id` | Retrieve a note by its MongoDB ObjectId | `getNoteById` |
| `PUT` | `/api/notes/:id` | Fully replace a note (all fields required) | `updateNote` |
| `PATCH` | `/api/notes/:id` | Partially update a note (only provided fields) | `patchNote` |
| `DELETE` | `/api/notes/:id` | Delete a single note | `deleteNote` |
| `DELETE` | `/api/notes/bulk` | Delete multiple notes by IDs | `deleteBulkNotes` |

---

## Note Schema

```javascript
{
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true, trim: true },
  category:  { type: String, enum: ["work", "personal", "study"], default: "personal" },
  isPinned:  { type: Boolean, default: false },
  createdAt: { type: Date, auto-generated via timestamps: true },
  updatedAt: { type: Date, auto-generated via timestamps: true }
}
```

---

## Response Format

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "656a1b2c3d4e5f6a7b8c9d0e",
    "title": "Meeting Notes",
    "content": "Discuss Q4 roadmap",
    "category": "work",
    "isPinned": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

Error responses follow the same structure with `success: false`:

```json
{
  "success": false,
  "message": "Note not found"
}
```

---

## Key Implementation Details

### Middleware & Configuration (`src/app.js`)
- **Body parsing**: `express.json()` and `express.urlencoded({ extended: true })`
- **Root route**: `GET /` returns a JSON listing of all available endpoints with their methods and descriptions
- **Error handling**: A 404 catch-all middleware returns `{ success: false, message: "Route not found" }`

### Database Connection (`src/config/db.js`)
- Connects to MongoDB using `process.env.MONGODB_URI`
- Logs connection success or exits with an error message on failure

### Controller Logic (`src/controllers/note.controller.js`)
- Each controller function wraps its logic in `try/catch` blocks
- `createNote`: Validates required fields, returns 201 on success, 400 on validation failure
- `getAllNotes`: Returns all notes (no filtering/pagination — baseline behavior)
- `getNoteById`: Validates ObjectId format before querying, returns 400 for invalid IDs, 404 if not found
- `updateNote` (PUT): Uses `findByIdAndUpdate` with `{ overwrite: true, runValidators: true, new: true }`
- `patchNote` (PATCH): Uses `findByIdAndUpdate` with `{ new: true, runValidators: true }`
- `deleteBulkNotes`: Accepts an array of IDs in the request body, uses `deleteMany({ _id: { $in: ids } })`

### Route Configuration (`src/routes/note.routes.js`)
- All routes are mounted under `/api/notes`
- Bulk routes (`/bulk`) are defined before parameterized routes (`/:id`) to prevent route conflicts

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- MongoDB instance (local or MongoDB Atlas)

### Installation

```bash
# 1. Navigate to the project
cd server1/notes-app

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your MongoDB connection string
#    PORT=3000
#    MONGODB_URI=mongodb://localhost:27017/notesdb
```

### Running the Server

```bash
# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode
npm start
```

---

## Testing with Postman

Comprehensive Postman testing documentation is available in `notes-app/POSTMAN_TESTING.txt`. The collection covers all 8 endpoints with example request bodies and expected responses.

**Postman Documentation (Online):** [View Server 1 Docs](https://documenter.getpostman.com/view/50841270/2sBXqJL1jf)

---

## Assignment Context

Server 1 is part of a three-server progressive assignment:

| Server | Focus Area | Endpoints |
|--------|-----------|:---------:|
| **Server 1** | Basic CRUD Operations | 8 |
| **Server 2** | Filtering, Sorting & Pagination | 16 |
| **Server 3** | Advanced Query Combinations | 18 |

---

## License

ISC

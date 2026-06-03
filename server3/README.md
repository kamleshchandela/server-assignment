# Server 3 — Advanced Query Combinations API

The most feature-rich REST API in the assignment suite, built with **Node.js**, **Express 5.x**, and **MongoDB (Mongoose 9.x)** using **ES Modules**. Server 3 combines all capabilities from Servers 1 and 2 with advanced **search**, **combined query pipelines**, and a powerful **master query endpoint** that consolidates search, filter, sort, and pagination into a single request.

---

## Overview

Server 3 delivers 18 endpoints that demonstrate advanced MongoDB query composition. It introduces text search across title and content fields, combined operations (filter + sort, sort + paginate, search + filter, etc.), and a unified `/api/notes/query` endpoint that accepts all parameters in one request. The codebase is built with **Express 5**, **Mongoose 9**, and uses **ES Modules** (`import`/`export`) for modern JavaScript development.

| Attribute | Value |
|-----------|-------|
| **Port** | `5000` |
| **Total Endpoints** | 18 |
| **Module System** | ES Modules (`import` / `export`, `"type": "module"`) |
| **Express Version** | 5.x |
| **Mongoose Version** | 9.x |
| **Database** | MongoDB (via Mongoose ODM) |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime environment |
| Express | 5.x | Web framework / router |
| Mongoose | 9.x | MongoDB ODM |
| dotenv | 17.4.x | Environment variable management |
| nodemon | 3.1.x | Development auto-reload |

---

## Project Structure

```
server3/
└── notes-app/
    ├── .gitignore                # Git ignore rules
    ├── package.json              # Dependencies and scripts (type: "module")
    ├── package-lock.json         # Dependency lock file
    ├── README.md                 # API documentation
    └── src/
        ├── index.js              # Entry point — ES module imports
        ├── app.js                # Express 5 app configuration
        ├── config/
        │   └── db.js             # MongoDB connection logic
        ├── controllers/
        │   └── note.controller.js  # 18 request handlers with helper utilities
        ├── models/
        │   └── note.model.js     # Mongoose schema (ES module export)
        └── routes/
            └── note.routes.js    # Route definitions (ES module export)
```

---

## API Endpoints

### Core CRUD Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/notes` | Create a single note |
| `POST` | `/api/notes/bulk` | Create multiple notes at once |
| `GET` | `/api/notes` | Retrieve all notes |
| `GET` | `/api/notes/:id` | Retrieve a note by ID |
| `PUT` | `/api/notes/:id` | Fully replace a note (uses `findOneAndReplace`) |
| `PATCH` | `/api/notes/:id` | Partially update a note |
| `DELETE` | `/api/notes/:id` | Delete a single note |
| `DELETE` | `/api/notes/bulk` | Delete multiple notes by IDs |

### Search Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/notes/search` | Search notes by title | `?q=keyword` (case-insensitive regex) |
| `GET` | `/api/notes/search/content` | Search notes by content | `?q=keyword` (case-insensitive regex) |
| `GET` | `/api/notes/search/all` | Search title OR content | `?q=keyword` (regex on both fields) |

### Combined Query Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/notes/filter-sort` | Filter + sort | `?category=work&isPinned=true&sortBy=title&order=asc` |
| `GET` | `/api/notes/filter-paginate` | Filter + paginate | `?category=work&isPinned=true&page=1&limit=10` |
| `GET` | `/api/notes/sort-paginate` | Sort + paginate | `?sortBy=createdAt&order=desc&page=1&limit=10` |
| `GET` | `/api/notes/search-filter` | Search + filter | `?q=keyword&category=work&isPinned=true` |
| `GET` | `/api/notes/search-sort-paginate` | Search + sort + paginate | `?q=keyword&category=work&isPinned=true&sortBy=title&order=asc&page=1&limit=10` |
| `GET` | `/api/notes/filter-sort-paginate` | Filter + sort + paginate | `?category=work&isPinned=true&sortBy=title&order=asc&page=1&limit=10` |

### Master Query Endpoint

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/notes/query` | All-in-one combined query | `?q=keyword&category=work&isPinned=true&sortBy=createdAt&order=desc&page=1&limit=10` |

---

## Note Schema

```javascript
{
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true, trim: true },
  category:  { type: String, enum: ["work", "personal", "study"], default: "personal" },
  isPinned:  { type: Boolean, default: false },
  createdAt: { type: Date, auto-generated },
  updatedAt: { type: Date, auto-generated }
}
```

---

## Response Format

```json
{
  "success": true,
  "message": "Notes retrieved successfully",
  "data": [ /* array or object */ ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Key Implementation Details

### DRY Architecture with Helper Utilities

The controller (`note.controller.js`) uses reusable helper functions to eliminate code duplication:

#### `buildFilter(query)`
Constructs a MongoDB filter object from request query parameters:
- **`q`**: Adds a `$or` condition with case-insensitive regex on `title` and/or `content`
- **`category`**: Direct equality match
- **`isPinned`**: Boolean match (converts string `"true"`/`"false"` to boolean)

```javascript
// Example: ?q=meeting&category=work&isPinned=true
// Produces: { $or: [{ title: /meeting/i }, { content: /meeting/i }], category: "work", isPinned: true }
```

#### `buildSort(query)`
Constructs a MongoDB sort object:
```javascript
// ?sortBy=createdAt&order=desc  =>  { createdAt: -1 }
```

#### `buildPagination(query)`
Computes pagination parameters:
```javascript
// ?page=2&limit=10  =>  { page: 2, limit: 10, skip: 10 }
```

#### `getPaginationData(total, page, limit)`
Returns pagination metadata:
```javascript
{
  total: 50,
  page: 2,
  limit: 10,
  totalPages: 5,
  hasNextPage: true,
  hasPrevPage: true
}
```

### Search Implementation
- Uses MongoDB's `$regex` operator with the `i` flag for case-insensitive matching
- **Title search**: `{ title: { $regex: q, $options: 'i' } }`
- **Content search**: `{ content: { $regex: q, $options: 'i' } }`
- **All search**: `{ $or: [{ title: { $regex: q, $options: 'i' } }, { content: { $regex: q, $options: 'i' } }] }`

### PUT vs PATCH
- **PUT** (`replaceNote`): Uses `findOneAndReplace` with `{ returnDocument: 'after', runValidators: true }` — completely replaces the document
- **PATCH** (`updateNote`): Uses `findByIdAndUpdate` with `{ new: true, runValidators: true }` — only updates provided fields

### Express 5 Features
- Uses Express 5's updated routing and middleware APIs
- Supports `async` error handling natively
- Updated `req.query` parsing behavior

### Module System
- **ES Modules** throughout with `"type": "module"` in `package.json`
- Uses `import`/`export default` syntax
- No CommonJS `require()` calls

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- MongoDB instance (local or MongoDB Atlas)

### Installation

```bash
# 1. Navigate to the project
cd server3/notes-app

# 2. Install dependencies
npm install

# 3. Create .env file with your configuration
#    PORT=5000
#    MONGO_URI=mongodb://localhost:27017/notes-db
```

### Running the Server

```bash
# Development mode (with auto-reload via nodemon)
npm run dev

# Production mode (no auto-reload — use pm2 or similar)
node src/index.js
```

---

## Testing with Postman

**Postman Documentation (Online):** [View Server 3 Docs](https://documenter.getpostman.com/view/50841270/2sBXqJL1fG)

---

## Assignment Context

Server 3 is the final and most advanced server in the progressive assignment suite:

| Server | Focus Area | Endpoints |
|--------|-----------|:---------:|
| Server 1 | Basic CRUD Operations | 8 |
| Server 2 | Filtering, Sorting & Pagination | 16 |
| **Server 3** | **Advanced Query Combinations** | **18** |

### Complete Feature Matrix

| Feature | Server 1 | Server 2 | Server 3 |
|---------|:--------:|:--------:|:--------:|
| Basic CRUD | ✅ | ✅ | ✅ |
| Bulk Create / Delete | ✅ | ✅ | ✅ |
| PUT / PATCH | ✅ | ✅ | ✅ |
| Category Filtering | ❌ | ✅ | ✅ |
| Pinned-Status Filtering | ❌ | ✅ | ✅ |
| Date-Range Filtering | ❌ | ✅ | ❌ |
| Sorting | ❌ | ✅ | ✅ |
| Pagination | ❌ | ✅ | ✅ |
| Search by Title | ❌ | ❌ | ✅ |
| Search by Content | ❌ | ❌ | ✅ |
| Search All (title+content) | ❌ | ❌ | ✅ |
| Filter + Sort Combo | ❌ | ❌ | ✅ |
| Sort + Paginate Combo | ❌ | ❌ | ✅ |
| Filter + Sort + Paginate | ❌ | ❌ | ✅ |
| Master Query Endpoint | ❌ | ❌ | ✅ |
| Express 5 / Mongoose 9 | ❌ | ❌ | ✅ |
| ES Modules | ❌ | ❌ | ✅ |

---

## License

ISC

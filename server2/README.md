# Server 2 — Filtering, Sorting & Pagination API

An enhanced REST API for managing notes, extending the basic CRUD operations from Server 1 with powerful **filtering, sorting, pagination, and data summarization** capabilities. Built with **Node.js**, **Express 4.x**, and **MongoDB (Mongoose 8.x)** following the MVC pattern.

---

## Overview

Server 2 introduces 16 endpoints that provide fine-grained control over data retrieval. In addition to full CRUD operations, clients can filter notes by category, pinned status, or date range; sort by any field in ascending or descending order; paginate through results; and retrieve summarized note data excluding content bodies.

| Attribute | Value |
|-----------|-------|
| **Port** | `5000` |
| **Total Endpoints** | 16+ |
| **Module System** | CommonJS (`require` / `exports.*`) |
| **Database** | MongoDB (via Mongoose ODM) |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime environment |
| Express | 4.18.x | Web framework / router |
| Mongoose | 8.0.x | MongoDB ODM |
| dotenv | 16.3.x | Environment variable management |
| nodemon | 3.0.x | Development auto-reload |

---

## Project Structure

```
server2/
└── notes-app/
    ├── .env                      # Environment variables
    ├── .gitignore                # Git ignore rules
    ├── package.json              # Dependencies and scripts
    └── src/
        ├── index.js              # Entry point — starts server & connects DB
        ├── app.js                # Express app configuration
        ├── config/
        │   └── db.js             # MongoDB connection logic
        ├── controllers/
        │   └── note.controller.js  # 17 request handlers
        ├── models/
        │   └── note.model.js     # Mongoose schema & model
        └── routes/
            └── note.routes.js    # Route definitions
```

---

## API Endpoints

### Core CRUD Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/notes` | Create a single note |
| `POST` | `/api/notes/bulk` | Create multiple notes at once |
| `GET` | `/api/notes` | Get all notes |
| `GET` | `/api/notes/:id` | Get note by ID |
| `PUT` | `/api/notes/:id` | Fully replace a note |
| `PATCH` | `/api/notes/:id` | Partially update a note |
| `DELETE` | `/api/notes/:id` | Delete a single note |
| `DELETE` | `/api/notes/bulk` | Delete multiple notes by IDs |

### Filtering Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/notes/category/:category` | Get notes by category | Path param: `work`, `personal`, or `study` |
| `GET` | `/api/notes/status/:isPinned` | Get notes by pinned status | Path param: `true` or `false` |
| `GET` | `/api/notes/filter` | Filter by category and/or pinned status | `?category=work&isPinned=true` |
| `GET` | `/api/notes/filter/pinned` | Get all pinned notes | — |
| `GET` | `/api/notes/filter/category` | Filter by category name | `?name=work` |
| `GET` | `/api/notes/filter/date-range` | Filter by date range | `?from=2025-01-01&to=2025-12-31` |

### Sorting Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/notes/sort` | Sort notes by any field | `?sortBy=createdAt&order=desc` |
| `GET` | `/api/notes/sort/pinned` | Sort pinned notes | `?sortBy=title&order=asc` |

### Pagination Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|-----------------|
| `GET` | `/api/notes/paginate` | Paginate through all notes | `?page=1&limit=10` |
| `GET` | `/api/notes/paginate/category/:category` | Paginate notes by category | Path + `?page=1&limit=10` |

### Summary Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes/:id/summary` | Get note metadata (excludes `content` field) |

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

All endpoints return a consistent JSON envelope:

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

### Route Ordering
Routes are carefully ordered to prevent parameter conflicts. Specific routes like `/category/:category`, `/status/:isPinned`, `/filter`, `/sort`, and `/paginate` are defined before the generic `/:id` route so they are matched correctly.

### Filtering Logic
- **Category filter**: Direct `{ category }` query match against the enum values
- **Pinned status filter**: Boolean match against `{ isPinned }`
- **Date range filter**: Uses MongoDB's `$gte` and `$lte` operators on `createdAt`
- **Combined filter**: Accepts both `category` and `isPinned` as optional query parameters

### Sorting Logic
- Accepts `sortBy` (any schema field) and `order` (`asc` or `desc`) query parameters
- Constructs a MongoDB sort object: `{ [sortBy]: order === 'desc' ? -1 : 1 }`

### Pagination Logic
- Computes `skip = (page - 1) * limit`
- Queries with `.skip(skip).limit(limit)`
- Returns pagination metadata including `total`, `totalPages`, `hasNextPage`, `hasPrevPage`

### Note Summary
- Uses Mongoose's `.select()` with field exclusion: `.select('-content')`
- Returns all note fields except the potentially large `content` body

### ObjectId Validation
- Uses a regex pattern (`/^[0-9a-fA-F]{24}$/`) to validate MongoDB ObjectIds before querying
- Returns 400 for invalid IDs, 404 if the ID format is valid but no document is found

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- MongoDB instance (local or MongoDB Atlas)

### Installation

```bash
# 1. Navigate to the project
cd server2/notes-app

# 2. Install dependencies
npm install

# 3. Configure .env (already present, or create with your values)
#    PORT=5000
#    MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/notes-db
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

**Postman Documentation (Online):** [View Server 2 Docs](https://documenter.getpostman.com/view/50841270/2sBXqJL1fN)

The Postman collection covers all 16+ endpoints with example request bodies, query parameters, and expected responses.

---

## Assignment Context

Server 2 is the second of three progressively enhanced servers:

| Server | Focus Area | Endpoints |
|--------|-----------|:---------:|
| Server 1 | Basic CRUD Operations | 8 |
| **Server 2** | **Filtering, Sorting & Pagination** | **16** |
| Server 3 | Advanced Query Combinations | 18 |

### Feature Comparison with Server 1

| Feature | Server 1 | Server 2 |
|---------|:--------:|:--------:|
| Basic CRUD | ✅ | ✅ |
| Bulk Create / Delete | ✅ | ✅ |
| PUT / PATCH | ✅ | ✅ |
| Category Filtering | ❌ | ✅ |
| Pinned-Status Filtering | ❌ | ✅ |
| Date-Range Filtering | ❌ | ✅ |
| Sorting | ❌ | ✅ |
| Pagination | ❌ | ✅ |
| Note Summary (exclude content) | ❌ | ✅ |

---

## License

ISC

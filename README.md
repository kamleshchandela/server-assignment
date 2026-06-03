# 📝 Notes Management API — Assignment Suite

A collection of **three progressively enhanced REST API servers** built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for managing notes with full CRUD, filtering, sorting, pagination, and advanced query capabilities.

---

## 📂 Project Structure

```
server-assignment/
├── server1/              # Basic CRUD Operations
│   └── notes-app/
└── server2/              # Filtering, Sorting & Pagination
    └── notes-app/
└── server3/              # Advanced Query Combinations
    └── src/
```

---

## 🚀 Servers Overview

### 🟢 Server 1 — Basic Notes CRUD
| Detail | Description |
|--------|-------------|
| **Folder** | `server1/notes-app/` |
| **Port** | `3000` |
| **Endpoints** | 8 |
| **Features** | Create, Read, Update, Delete notes — single & bulk operations, full (PUT) & partial (PATCH) updates |
| **Key Controllers** | `createNote`, `createBulkNotes`, `getAllNotes`, `getNoteById`, `updateNote`, `patchNote`, `deleteNote`, `deleteBulkNotes` |

> **Postman Documentation:** [View Server 1 Docs](https://documenter.getpostman.com/view/50841270/2sBXqJL1jf)

---

### 🔵 Server 2 — Filtering, Sorting & Pagination
| Detail | Description |
|--------|-------------|
| **Folder** | `server2/notes-app/` |
| **Port** | `5000` |
| **Endpoints** | 16 |
| **Features** | Everything in Server 1 + category filtering, pinned-status filtering, date-range filtering, pagination, sorting, note-summary endpoint |
| **Key Controllers** | `filterNotes`, `filterByCategoryQuery`, `filterByDateRange`, `paginateNotes`, `sortNotes`, `sortPinnedNotes`, `getNoteSummary`, and more (17 total) |

> **Postman Documentation:** [View Server 2 Docs](https://documenter.getpostman.com/view/50841270/2sBXqJL1fN)

---

### 🟣 Server 3 — Advanced Query Combinations
| Detail | Description |
|--------|-------------|
| **Folder** | `server3/` |
| **Port** | `5000` |
| **Endpoints** | 18 |
| **Features** | Everything in Server 1 & 2 + combined query pipelines: search+sort+paginate, filter+sort+paginate, master query endpoint — all in a single powerful controller |
| **Key Controllers** | `searchByTitle`, `searchByContent`, `searchAll`, `filterAndSort`, `filterAndPaginate`, `sortAndPaginate`, `searchAndFilter`, `searchSortPaginate`, `filterSortPaginate`, `masterQuery`, and more (18 total) |

> **Postman Documentation:** [View Server 3 Docs](https://documenter.getpostman.com/view/50841270/2sBXqJL1fG)

---

## 🧩 Common Note Schema

All three servers share the same base schema:

```javascript
{
  title:       String,     // Required — note heading
  content:     String,     // Required — note body
  category:    String,     // Enum: "work" | "personal" | "study" (default: "personal")
  isPinned:    Boolean,    // Default: false
  createdAt:   Date,       // Auto-generated
  updatedAt:   Date        // Auto-generated
}
```

---

## 🔧 Common Response Format

Every endpoint returns a consistent JSON structure:

```json
{
  "success": true,
  "message": "Operation status message",
  "data": { ... },
  "pagination": {              // Included for paginated responses
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

## 🛠️ How to Run

Each server is independent. Navigate into its directory and follow the steps below:

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** (local or Atlas URI)

### Installation & Start

```bash
# 1. Navigate to the desired server
cd server1/notes-app        # or server2/notes-app  or  server3

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Copy .env.example to .env (Server 1) or edit .env (Servers 2 & 3)
#    Set your MONGO_URI / MONGODB_URI and PORT

# 4. Start the server
npm run dev                 # Development (with nodemon auto-reload)
# OR
npm start                   # Production
```

---

## 📊 Feature Comparison

| Feature | Server 1 | Server 2 | Server 3 |
|---------|:--------:|:--------:|:--------:|
| Basic CRUD | ✅ | ✅ | ✅ |
| Bulk Create / Delete | ✅ | ✅ | ✅ |
| PUT (full replace) | ✅ | ✅ | ✅ |
| PATCH (partial update) | ✅ | ✅ | ✅ |
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
| Note Summary (exclude content) | ❌ | ✅ | ❌ |
| **Total Endpoints** | **8** | **16** | **18** |

---

## 📬 Postman Documentation (Quick Links)

| Server | Link |
|--------|------|
| **Server 1 — Basic CRUD** | [https://documenter.getpostman.com/view/50841270/2sBXqJL1jf](https://documenter.getpostman.com/view/50841270/2sBXqJL1jf) |
| **Server 2 — Filtering, Sorting & Pagination** | [https://documenter.getpostman.com/view/50841270/2sBXqJL1fN](https://documenter.getpostman.com/view/50841270/2sBXqJL1fN) |
| **Server 3 — Advanced Query Combinations** | [https://documenter.getpostman.com/view/50841270/2sBXqJL1fG](https://documenter.getpostman.com/view/50841270/2sBXqJL1fG) |

---

Built with ❤️ using Express.js & MongoDB

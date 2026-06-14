# Architecture Overview

## High‑Level Diagram

```
+-------------------+        +-------------------+
|   Frontend (Next) | <----> |  Backend (Elysia) |
|  http://3000      |        |  http://8000      |
+-------------------+        +-------------------+
          ^                         ^
          |                         |
          v                         v
   Browser (User)          Turso / SQLite DB
```
*(Replace the ASCII art with an actual diagram in future updates.)*

## Components
- **Frontend** – Next.js App Router, Tailwind CSS, Mantis Light‑Green design system. Communicates with the backend via REST endpoints.
- **Backend** – Elysia server on Bun, handles API routes, file uploads, and persistence.
- **Persistence** – Turso (remote SQLite) with a local SQLite fallback (`mantis.db`). Configured via `TURSO_URL` and `TURSO_AUTH_TOKEN`.
- **MOSS Indexing** – After a successful manual upload, the backend forwards the file to the MOSS service for indexing.

## Data Flow
1. User selects a product and uploads a manual in the Dashboard.
2. Frontend `POST /api/upload-manual` sends multipart data to the backend.
3. Backend stores metadata in Turso/SQLite and triggers MOSS indexing.
4. Frontend fetches the updated manual list via `GET /api/manuals` and displays it.

## Development Environment
- Run **backend** with `bun run dev` (port 8000).
- Run **frontend** with `bun dev` (port 3000).
- Ensure both services are up before using the dashboard.

---

*For detailed agent guidelines, see `docs/AGENTS.md`.*

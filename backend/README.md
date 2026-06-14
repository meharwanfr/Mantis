# Backend Documentation

## 📂 Project Structure
```
backend/
├─ src/
│  ├─ index.ts           # Server entry point (Elysia API)
│  ├─ config/
│  │   └─ db.ts          # Database client (Turso with SQLite fallback)
│  └─ routes/
│      └─ product.ts     # Manual upload & retrieval endpoints
├─ package.json
└─ bun.lockb
```

## 🛠️ Persistence Layer
The backend stores manual metadata in **Turso**, a server‑less SQLite service. Configuration is driven by two environment variables:

```bash
TURSO_URL="<your-turso-database-url>"
TURSO_AUTH_TOKEN="<your-auth-token>"
```

If these variables are **missing** or the connection fails (e.g., unauthorized), the server automatically falls back to a **local SQLite file** located at `mantis.db` in the project root. This fallback enables seamless local development and testing.

### What is stored?
- `productId`: Identifier for the product.
- `filePath`: Relative path to the uploaded manual.
- `uploadedAt`: Timestamp of the upload.

## 🚀 Development Setup
```bash
cd backend
bun install          # Install dependencies
bun run dev           # Starts Elysia on http://localhost:8000
```
The server automatically calls `initDb()` on startup to ensure the required tables exist.

## 🧪 Testing
```bash
bun test              # Runs unit & integration tests (uses SQLite fallback in test mode)
```
Tests are configured to skip remote Turso calls when `NODE_ENV=test`.

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload-manual` | Upload a manual (multipart `productId` + `file`). Stores metadata and triggers MOSS indexing. |
| `GET`  | `/api/manuals` | Retrieve a list of manuals with `productId`, `filePath`, and `uploadedAt`. |
| `GET`  | `/diagnostics` | Health‑check used by the frontend diagnostics chat. |

## 📦 Build & Deploy
The backend is designed to run on **Bun**. For production, you can compile a single binary or deploy the source to a serverless platform that supports Bun.

---

*For any further questions, refer to `docs/AGENTS.md` for agent‑specific guidelines.*

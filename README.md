# Mantis - AI-Powered Support for Every Product You Own

## 📖 Project Overview

Mantis is a **full‑stack AI‑driven support portal** for product manuals and diagnostics. The architecture is split into two independent services:

- **Backend (Elysia)** – runs on Bun at `http://localhost:8000`. Handles API endpoints, manual storage, and persistence via **Turso** (remote SQLite) with a **local SQLite fallback**.
- **Frontend (Next.js 16)** – runs on `http://localhost:3000`. Provides a modern UI built with the **Mantis Light‑Green design system**.

> **Architecture diagram** – *(placeholder, see `docs/ARCHITECTURE.md` for a high‑level diagram)*

---

## 🗂️ Technical Stack

- **Frontend:** Next.js 16.2.9 (App Router, TypeScript, React 19)
- **Styling:** Tailwind CSS v4.3, custom design tokens for the Mantis Light‑Green theme.
- **Backend:** Elysia 1.4.28 (Bun runtime)
- **Persistence:** Turso client (`@libsql/client`) with SQLite fallback (`mantis.db`).
- **Runtime & Package Manager:** Bun v1.3.14.

---

## 📦 Backend Persistence

The backend now stores manual metadata in a Turbosql database. Configuration is driven by two environment variables:

```bash
TURSO_URL="<your-turso-database-url>"
TURSO_AUTH_TOKEN="<your-auth-token>"
```

If these variables are missing or the Turso connection fails (e.g., unauthorized), the server automatically falls back to a local SQLite file located at `mantis.db` in the project root.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload-manual` | Upload a product manual (multipart `productId` + `file`). Stores metadata in the DB and triggers MOSS indexing. |
| `GET`  | `/api/manuals` | Retrieve a list of uploaded manuals with their `productId` and file info. |
| `GET`  | `/diagnostics` | Health‑check endpoint used by the frontend diagnostics chat. |

---

## ⚙️ Development Setup

### Backend
```bash
cd backend
bun install
bun run dev   # starts Elysia on http://localhost:8000
```

### Frontend
```bash
cd frontend
bun install
bun dev        # starts Next.js on http://localhost:3000
```

Both services use hot‑reloading – changes are reflected instantly.

---

## 🎨 Design System

Mantis follows the **Mantis Light‑Green** design system:

- **Background:** `bg-slate-50` (`#f8fafc`)
- **Surfaces:** `bg-white` with `border-slate-200/80` and rounded corners (`rounded-2xl`, `rounded-3xl`).
- **Primary Accent:** `#16a34a` (`bg-mantis-green`).
- **Hover Accent:** `#15803d` (`bg-mantis-green-dark`).
- **Active Tint:** `#f0fdf4` (`bg-mantis-green-light`).
- **Typography:** `Plus Jakarta Sans` for headings, `Manrope` for body text.

---

## 🧪 Testing

```bash
# Backend tests
cd backend
bun test

# Frontend lint & tests (if added later)
cd frontend
bun lint
```

---

## 📚 Additional Docs

- **Architecture Overview:** `docs/ARCHITECTURE.md`
- **Agent Guidelines:** `docs/AGENTS.md`

---

## 🚀 Quick Start

1. Set `TURSO_URL` and `TURSO_AUTH_TOKEN` (optional – development falls back to SQLite).
2. Run the backend and frontend as described above.
3. Open `http://localhost:3000` and start uploading manuals via the Dashboard.

Enjoy building with Mantis!

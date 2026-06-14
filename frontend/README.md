# Frontend Documentation

## 📂 Project Structure
```
frontend/
├─ src/
│  ├─ app/
│  │   ├─ layout.tsx            # Global layout with Google Fonts and Navbar
│  │   ├─ globals.css            # Tailwind imports & design tokens
│  │   ├─ dashboard/
│  │   │   └─ page.tsx          # Manual upload UI (handles file upload, product selection)
│  │   ├─ diagnostics/
│  │   │   └─ page.tsx          # AI Diagnostic Assistant chat UI
│  │   └─ products/
│  │       └─ page.tsx          # Marketplace product catalog
│  └─ components/
│      ├─ Navbar.tsx           # Header navigation component
│      └─ DiagnosticAssistant.tsx # Chat widget component
├─ public/                     # Static assets (logos, images)
├─ package.json
└─ bun.lockb
```

## 🎨 Design System
The UI follows the **Mantis Light‑Green** design system (see `docs/AGENTS.md` for token definitions):
- **Background:** `bg-slate-50` (`#f8fafc`)
- **Cards:** `bg-white` with `border-slate-200/80` and rounded corners (`rounded-2xl` / `rounded-3xl`).
- **Primary Accent:** `#16a34a` (`bg-mantis-green`).
- **Hover Accent:** `#15803d` (`bg-mantis-green-dark`).
- **Active Tint:** `#f0fdf4` (`bg-mantis-green-light`).
- **Typography:** `Plus Jakarta Sans` for headings, `Manrope` for body text.

## ⚙️ Development Setup
```bash
cd frontend
bun install          # Install dependencies (Next.js, Tailwind, React, etc.)
bun dev               # Starts the dev server at http://localhost:3000
```
The frontend proxies API calls to the backend (`http://localhost:8000`). Ensure the backend is running before using the dashboard.

## 📡 API Integration
- `POST /api/upload-manual` – Used by the dashboard to upload product manuals.
- `GET /api/manuals` – Fetches the list of uploaded manuals and displays them on the dashboard.
- `GET /diagnostics` – Health‑check endpoint for the AI diagnostic chat.

## 🧪 Testing & Linting
```bash
bun lint               # Runs ESLint (includes custom rule for requestAnimationFrame usage)
# Frontend tests can be added with your preferred framework (e.g., Vitest, Jest)
```
All lint errors must be resolved before committing.

## 📚 Additional Docs
- **Architecture Overview:** `docs/ARCHITECTURE.md`
- **Agent Guidelines:** `docs/AGENTS.md`

---

## 🚀 Quick Start
1. Set up the backend (see `backend/README.md`).
2. Run the frontend dev server.
3. Open `http://localhost:3000` and use the Dashboard to upload manuals.

Enjoy building with the sleek Mantis Light‑Green UI!

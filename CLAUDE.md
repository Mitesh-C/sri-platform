# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sri by Mahakali Tribunal** — a governed SAFE investment infrastructure platform. It is explicitly NOT a trading platform, stock exchange, or wallet system. All UI and feature decisions must reinforce long-term, governance-first ownership — no urgency tactics, no charts/tickers, no live prices.

## Development Commands

### Backend (FastAPI + Python)
```bash
cd backend
pip install -r requirements.txt          # Install dependencies
uvicorn server:app --host 0.0.0.0 --port 8001 --reload  # Start dev server
python seed.py                            # Seed test data into MongoDB
```

### Frontend (React + Tailwind)
```bash
cd frontend
yarn install        # Install dependencies
yarn start          # Start dev server on port 3000
yarn build          # Production build
yarn test           # Run tests
```

> Frontend uses **CRACO** (not react-scripts directly) — all scripts go through `craco`.

## Architecture

### Request Flow
```
Browser → React (port 3000) → Axios (src/lib/api.js) → FastAPI (port 8001/api) → MongoDB Atlas
```

- `REACT_APP_BACKEND_URL` in `frontend/.env` controls the API base URL.
- All API calls are prefixed `/api` — set in `src/lib/api.js` and matched by the FastAPI `APIRouter(prefix="/api")`.
- JWT token stored in `localStorage`, injected by an Axios request interceptor.

### Backend Structure (`backend/`)
| File | Purpose |
|------|---------|
| `server.py` | All FastAPI routes (single file — all endpoints live here) |
| `models.py` | Pydantic v2 models for every entity |
| `auth.py` | JWT creation/verification, `get_current_user` dependency |
| `email_service.py` | Resend-based email (disabled unless `RESEND_API_KEY` is set) |
| `notification_models.py` | Notification Pydantic models |
| `seed.py` | Seeds test accounts and sample data |

- MongoDB accessed via Motor (async). Documents use UUID strings as `id` (not ObjectId). `_id` and `password_hash` are always stripped from responses via `serialize_doc()`.
- Rate limiting via `slowapi` — signup is capped at 5/minute.
- JWT tokens expire in 30 days (`ACCESS_TOKEN_EXPIRE_MINUTES = 43200`).

### Frontend Structure (`frontend/src/`)
| Path | Purpose |
|------|---------|
| `contexts/AuthContext.js` | Global auth state — `user`, `loading`, `login`, `logout` |
| `lib/api.js` | Axios instance with auth interceptor |
| `App.js` | Route definitions with `ProtectedRoute` (role-based) |
| `pages/` | One file per page/route |
| `components/ui/` | Shadcn/UI component library (Radix primitives) |

### Role-Based Access
User roles: `investor`, `business`, `both`, `admin`. Protected routes check `user.role` via `ProtectedRoute` in `App.js`. Backend also enforces roles on endpoints (check `current_user["role"]` in each route handler).

## Environment Variables

**`backend/.env`**
```
MONGO_URL=           # MongoDB connection string
DB_NAME=             # Database name (sri_database)
SECRET_KEY=          # JWT signing secret
CORS_ORIGINS=        # Allowed frontend origin
EMAIL_ENABLED=       # Set to false for local dev
RESEND_API_KEY=      # Required to enable email sending
FRONTEND_URL=        # Used in email verification links
```

**`frontend/.env`**
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Test Accounts (after seeding)
```
investor@sri.com / password123   — Investor role
founder@sri.com  / password123   — Business role
both@sri.com     / password123   — Both roles
```

## Design System Constraints

- **Fonts**: Fraunces (headings), Outfit (body), JetBrains Mono (data)
- **Primary color**: Deep Purple `#5B21B6`
- **No**: countdown timers, urgency cues, gradient text/buttons, trading charts, live price widgets, wallet UI patterns
- Card layouts with `rounded-2xl`, generous whitespace, soft shadows

## Key Patterns

- New pages are added as files in `frontend/src/pages/` and registered as routes in `App.js`.
- New API endpoints go in `backend/server.py` under the `api_router`.
- New data models go in `backend/models.py` (Pydantic v2 — use `model_config = ConfigDict(extra="ignore")`).
- All entities use `uuid.uuid4()` as their `id` field (not MongoDB ObjectId).
- Datetime fields use `datetime.now(timezone.utc)` and are stored as ISO strings.

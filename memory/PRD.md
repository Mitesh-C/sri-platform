# Sri by Mahakali Tribunal - PRD

## Original Problem Statement
Build a production-grade web platform named "Sri by Mahakali Tribunal" for governed startup ownership and SAFE investments. The platform provides global, round-the-clock access to both Investors and Businesses. UX should be calm, ledger-like, focused on long-term governance.

## Tech Stack (Current)
- **Frontend:** React, JavaScript, Tailwind CSS, Shadcn UI, React Router, Axios
- **Backend:** FastAPI, Python, Pydantic
- **Database:** MongoDB
- **Auth:** JWT (JSON Web Tokens)

## User Roles
- Investor
- Founder / Businessman

## What's Been Implemented

### Core Infrastructure
- Full-stack application with React frontend + FastAPI backend + MongoDB
- JWT authentication (signup/login) with SECRET_KEY from environment
- Role-based access control (investor, business)
- Protected routes with role checking
- Email verification system (Resend-ready, dev mode logs to console)
- Razorpay payment gateway architecture (needs test keys)

### Branding & UI
- Primary color: #464AAC
- Font: Futura/Inter
- Custom logo
- Page title: "SRI | Mahakali Tribunal"
- Landing page: "World's First Capital Formation Tool for Entrepreneurs..."
- Custom footer with email (hello@mahakalitribunal.com) + phone (+91 9916912450)
- "How It Works" (renamed from Governance Charter)
- "Thesis" (renamed from "Theses") throughout

### Pages
- Landing page
- Auth (Sign In / Sign Up) with role dropdown (Investor, Founder/Businessman)
- Explore Investment Thesis (with filters, Create Thesis/Company buttons for founders)
- Thesis Detail (video embed, pitch deck link, bank account check, Copy Link button)
- How It Works
- Pricing (Founder & Investor tabs with CHF fee tables, "Liquidity Windows Fee")
- Investor Dashboard
- Business Dashboard
- Thesis Editor (Industry dropdown with 10 categories, Company name text field, stages: Pre-seed/Seed/Series A/B/C+, status: Draft/Active/Pending/Funded, Video URL, Pitch Deck URL)
- Company Create (redirected to if no company exists)
- Bank Accounts, Profile, Email Verification pages

### Backend Features
- Full CRUD for theses, companies, investments
- Recurring investments (SIP), Reference prices, Liquidity windows
- Bank account linking (required for transactions)
- Email verification (token-based, Resend integration ready)
- Razorpay payment gateway (architecture ready, needs keys)
- Deployment-ready (SECRET_KEY from env, no hardcoded values)

### Pricing (Display Only)
**Founder:**
- Account Opening: Free
- Listing: CHF 260 (Idea) / CHF 525 (Seed) / CHF 1,575 (Series A+)
- Success Fee: 3% (up to 650K) / 2% (650K-3.25M) / 1.5% (3.25M-13M) / 1% (13M+)
- Annual: CHF 1,050 (Seed) / CHF 3,150 (Series A) / CHF 7,350 (Growth)

**Investor:**
- Account Opening: Free
- Trading: 0.25% Buy / 0.25% Sell
- Tools: Free Basic / CHF 25/yr Pro / Custom Institutional

## MOCKED Integrations
- **Email (Resend):** Architecture ready, logs to console in dev mode. Needs RESEND_API_KEY in backend/.env
- **Payments (Razorpay):** Architecture ready, disabled without keys. Needs RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env

## Backlog (P0-P2)

### P0
- Razorpay test keys integration (user to provide)
- Resend API key integration (user to provide)
- Mobile/tablet responsiveness across all pages

### P1
- Full Thesis Editor with rich text
- Investor features (SIP management, liquidity window participation)
- Admin dashboard
- File upload for pitch deck PDFs

### P2
- Compliance & Safety UX (risk acknowledgements, illiquidity warnings)
- Nation-specific iSafe generation
- Backend modularization (break server.py into routers)
- Tech stack migration discussion (React+MongoDB vs Next.js+PostgreSQL)

## Demo Credentials
- Investor: investor@sri.com / password123
- Founder: founder@sri.com / password123

## Key API Endpoints
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/send-verification
- GET /api/auth/verify-email/{token}
- GET/POST /api/theses
- GET /api/theses/{id}
- POST /api/investments
- GET /api/investments/my
- POST /api/recurring-investments
- GET /api/payments/config
- POST /api/payments/create-order
- POST /api/payments/verify
- GET /api/dashboard/investor
- GET /api/dashboard/business
- GET /api/pricing (display only, frontend-driven)

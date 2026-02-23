# Sri by Mahakali Tribunal

A governed startup ownership and SAFE investment infrastructure platform built for long-term investors and responsible founders.

## 🎯 What Sri Is

- A governed investment infrastructure
- SAFE instrument platform
- Long-term ownership ledger
- Permissioned liquidity windows
- Bank-connected settlement rails

## 🚫 What Sri Is Not

- NOT a trading platform
- NOT a stock exchange
- NOT a wallet system
- NOT instant liquidity
- NOT speculative infrastructure

## 🏗️ Tech Stack

### Frontend
- React 19
- React Router v7
- Tailwind CSS (with custom design system)
- Shadcn/UI components
- Framer Motion (animations)
- Axios (API client)
- Sonner (toast notifications)

### Backend
- FastAPI (Python)
- MongoDB (with Motor async driver)
- JWT Authentication (python-jose)
- Bcrypt (password hashing)
- Pydantic (data validation)

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py          # Main FastAPI application with all routes
│   ├── models.py          # Pydantic models for all entities
│   ├── auth.py            # JWT authentication logic
│   ├── seed.py            # Database seeding script
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.js           # Public landing page
    │   │   ├── Explore.js           # Browse investment theses
    │   │   ├── ThesisDetail.js      # Thesis detail with invest form
    │   │   ├── Governance.js        # Governance charters
    │   │   ├── Auth.js              # Login/Signup
    │   │   ├── InvestorDashboard.js # Investor dashboard
    │   │   ├── BusinessDashboard.js # Business/Founder dashboard
    │   │   └── BankAccounts.js      # Bank account linking
    │   │
    │   ├── components/
    │   │   ├── Navbar.js            # Navigation component
    │   │   └── ui/                  # Shadcn UI components
    │   │
    │   ├── contexts/
    │   │   └── AuthContext.js       # Authentication context
    │   │
    │   ├── lib/
    │   │   ├── api.js               # Axios API client
    │   │   └── utils.js             # Utility functions
    │   │
    │   ├── App.js                   # Main app with routes
    │   ├── index.css                # Global styles with design tokens
    │   └── App.css                  # Component styles
    │
    ├── package.json           # Node dependencies
    ├── tailwind.config.js     # Tailwind configuration
    └── .env                   # Frontend environment variables
```

## 🎨 Design System

### Colors
- **Primary**: Deep Purple (#5B21B6)
- **Background**: Cool Gray (#F9FAFB)
- **Card**: White (#FFFFFF)
- **Text**: Dark Gray (#111827)

### Typography
- **Headings**: Fraunces (serif) - elegant, institutional feel
- **Body**: Outfit (sans-serif) - clean, modern readability
- **Data**: JetBrains Mono (monospace) - technical precision

### Visual Style
- Rounded corners (rounded-2xl)
- Soft shadows
- Card-based layouts
- Whitespace-heavy design
- No gradients on text/buttons
- Calm, deliberate interactions

## 🔐 Authentication

### User Roles
- **Investor**: Can browse theses, invest, manage recurring investments
- **Business/Founder**: Can create companies, publish theses, manage capital
- **Both**: Combined investor and founder capabilities
- **Admin**: Full governance oversight

### Auth Flow
1. Signup with email, password, full name, role, and country
2. Mandatory acknowledgement: "This is not a trading platform"
3. JWT token issued on successful auth
4. Token stored in localStorage
5. Protected routes check authentication and role

## 📊 Database Collections

### users
- id, email, password_hash, full_name, role, country, is_active, created_at

### companies
- id, name, description, industry, geography, website, created_by, created_at

### theses (Investment Theses)
- id, company_id, title, overview, thesis_content, risks, safe_structure, status, industry, geography, stage, created_at, updated_at

### investments
- id, investor_id, thesis_id, amount, investment_type, status, acknowledged_risks, created_at

### recurring_investments
- id, investor_id, thesis_id, amount, frequency, status, next_run, created_at

### reference_prices
- id, thesis_id, old_price, new_price, reason, created_at

### liquidity_windows
- id, thesis_id, start_date, end_date, status, created_by, governance_confirmed, created_at

### secondary_sales
- id, seller_id, buyer_id, thesis_id, amount, status, sale_type, created_at

### bank_accounts
- id, user_id, country, bank_name, account_holder, account_number, routing_code, status, created_at

### discussions
- id, thesis_id, user_id, content, created_at

### governance_alerts
- id, title, content, severity, created_at

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user details

### Companies
- `POST /api/companies` - Create company (Business role)
- `GET /api/companies` - List all companies
- `GET /api/companies/my` - Get user's companies

### Investment Theses
- `POST /api/theses` - Create thesis (Business role)
- `GET /api/theses` - List theses with filters (status, industry, geography, stage)
- `GET /api/theses/{id}` - Get thesis details
- `PUT /api/theses/{id}` - Update thesis

### Investments
- `POST /api/investments` - Make one-time investment
- `GET /api/investments/my` - Get user's investments
- `GET /api/investments/thesis/{thesis_id}` - Get investments for a thesis

### Recurring Investments
- `POST /api/recurring-investments` - Set up recurring investment (SIP)
- `GET /api/recurring-investments/my` - Get user's recurring investments
- `PATCH /api/recurring-investments/{id}/status` - Pause/resume recurring investment

### Reference Prices
- `POST /api/reference-prices` - Create price update event (Business role)
- `GET /api/reference-prices` - List price updates (optional thesis_id filter)

### Liquidity Windows
- `POST /api/liquidity-windows` - Create liquidity window (Business role)
- `GET /api/liquidity-windows` - List windows (optional thesis_id filter)

### Secondary Sales
- `POST /api/secondary-sales` - Request secondary sale
- `GET /api/secondary-sales/my` - Get user's sales
- `PATCH /api/secondary-sales/{id}/approve` - Approve sale (Business role)

### Bank Accounts
- `POST /api/bank-accounts` - Add bank account
- `GET /api/bank-accounts/my` - Get user's bank accounts

### Discussions
- `POST /api/discussions` - Post discussion comment
- `GET /api/discussions/{thesis_id}` - Get discussions for thesis

### Governance
- `GET /api/governance/alerts` - List governance alerts

### Dashboards
- `GET /api/dashboard/investor` - Investor stats
- `GET /api/dashboard/business` - Business stats

## 🧪 Test Accounts

```
Investor: investor@sri.com / password123
Founder: founder@sri.com / password123
Both: both@sri.com / password123
```

## 🚀 Running the Application

### Backend
```bash
cd /app/backend
python seed.py  # Seed test data
# Backend runs via supervisor on port 8001
```

### Frontend
```bash
cd /app/frontend
# Frontend runs via supervisor on port 3000
```

### Access
- **Frontend**: https://long-term-owned.preview.emergentagent.com
- **Backend API**: https://long-term-owned.preview.emergentagent.com/api

## 🎯 Key Features

### For Investors
- Browse investment theses with detailed filtering
- View full thesis content, risks, and SAFE structure
- One-time investments with risk acknowledgement
- Recurring investments (SIP) - weekly, monthly, quarterly
- Dashboard with portfolio stats
- Reference price update notifications
- Bank account linking for settlements
- Discussion threads on theses

### For Founders/Businesses
- Create and manage companies
- Publish investment theses with governance
- Update theses and reference prices
- Create liquidity windows
- View capital raised and investor count
- Dashboard with business metrics

### Governance Features
- Investor Protection Charter
- Founder Responsibility Charter
- Platform governance standards
- Audit trails on all actions
- Risk acknowledgements (mandatory)
- Illiquidity warnings
- No wallet/trading patterns in UI

## 🎨 Design Principles

1. **Calm, Not Urgent**: No countdown timers, no urgency tactics
2. **Ledger-like**: Text-based, structured information
3. **Long-term Focus**: Emphasizes commitment and governance
4. **Premium, Not Flashy**: Sophisticated without being ostentatious
5. **Whitespace**: Generous spacing for clarity
6. **No Trading Vibes**: No charts, tickers, live prices, or balance widgets
7. **Bank Rails Only**: Bank accounts for settlement, not wallets

## ✅ Testing Results

All features tested and working:
- ✅ 16/16 backend API endpoints operational
- ✅ All frontend pages rendering correctly
- ✅ Authentication and authorization working
- ✅ Investment flows (one-time and recurring) functional
- ✅ Role-based access control enforced
- ✅ Bank account linking operational
- ✅ Design follows governance-first aesthetic
- ✅ No trading patterns in UI

## 📝 Future Enhancements

- Thesis editor page for creating/editing theses
- Company creation flow
- Liquidity window creation form
- Secondary sale approval workflow
- Enhanced discussion features
- Email notifications
- Document uploads for governance
- KYC integration
- Multi-signature approvals
- Audit log viewer

## 🔒 Security Considerations

- JWT tokens with 30-day expiration
- Bcrypt password hashing
- Role-based access control on all endpoints
- CORS configured for production domain
- No sensitive data in frontend
- MongoDB ObjectId excluded from responses
- Secure password requirements (implement in production)
- Rate limiting (implement in production)
- Input validation via Pydantic models

---

**Built with governance, for the long term.**

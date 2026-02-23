# Sri Platform - Testing Checklist

Use this checklist to verify all features are working after setup.

## Prerequisites
- [ ] Docker and Docker Compose installed
- [ ] All services running (`docker-compose ps` shows all UP)
- [ ] Database seeded (`docker-compose exec backend python seed.py`)

---

## 1. Landing Page Tests

### Access Landing Page
- [ ] Navigate to http://localhost:3000
- [ ] Page loads without errors
- [ ] Hero displays: "Sit with the future."
- [ ] Description mentions "Not a trading app. Not a wallet."
- [ ] "Explore Investment Theses" button visible
- [ ] "Read Governance Charter" button visible

### UI/UX Verification
- [ ] Deep purple (#5B21B6) accent color visible
- [ ] Fraunces font used for headings
- [ ] Calm, whitespace-heavy design
- [ ] No trading charts or wallet UI
- [ ] Features section displays 3 cards
- [ ] "What Sri Is / Is Not" section visible

---

## 2. Authentication Tests

### Sign Up Flow
- [ ] Click "Sign In" button
- [ ] Toggle to "Sign up"
- [ ] Fill form:
  - Full Name: Test User
  - Email: test@example.com
  - Password: testpass123
  - Role: Investor
  - Country: US
- [ ] Check acknowledgement checkbox
- [ ] Submit successfully
- [ ] Redirects to Investor Dashboard

### Login Flow
- [ ] Navigate to /auth
- [ ] Enter: investor@sri.com / password123
- [ ] Click "Sign In"
- [ ] Redirects to Investor Dashboard
- [ ] Navbar shows "Dashboard" link
- [ ] Profile icon visible

### Role-Based Access
- [ ] Login as investor@sri.com
  - [ ] Can access /investor/dashboard
  - [ ] Cannot access /business/dashboard (redirects)
- [ ] Login as founder@sri.com
  - [ ] Can access /business/dashboard
  - [ ] Cannot access /investor/dashboard (redirects)
- [ ] Login as both@sri.com
  - [ ] Can access both dashboards

### Logout
- [ ] Click logout icon
- [ ] Redirects to landing page
- [ ] Cannot access protected routes
- [ ] Login state cleared

---

## 3. Explore & Browse Tests

### Explore Page
- [ ] Navigate to /explore
- [ ] 3 theses visible (Energy, Biotech, Agriculture)
- [ ] Each card shows:
  - Industry badge
  - Status badge (active/draft/closed)
  - Title
  - Overview
  - Geography and Stage
  - "View Thesis" button

### Filtering
- [ ] Search box filters by title/overview
- [ ] Status filter (All/Active/Draft/Closed)
- [ ] Industry filter shows all industries
- [ ] Geography filter shows all geographies
- [ ] Filters update results dynamically

---

## 4. Investment Thesis Detail Tests

### Thesis Detail Page
- [ ] Click "View Thesis" on any thesis
- [ ] Page loads with thesis ID in URL
- [ ] All sections visible:
  - [ ] Overview
  - [ ] Investment Thesis (full content)
  - [ ] Risks & Disclosures (yellow warning card)
  - [ ] SAFE Structure (with all fields)
  - [ ] Discussion section

### Investment Flow (One-Time)
- [ ] Scroll to "Ready to invest?" section
- [ ] Click "Invest Now"
- [ ] Form appears with:
  - [ ] Investment Type (One-time selected)
  - [ ] Amount field
  - [ ] Risk acknowledgement checkbox
- [ ] Fill amount: 1000
- [ ] Check acknowledgement
- [ ] Click "Submit Investment"
- [ ] Success toast appears
- [ ] Redirects to investor dashboard

### Investment Flow (Recurring - SIP)
- [ ] Click "Invest Now" on thesis
- [ ] Select "Recurring Investment (SIP)"
- [ ] Fill amount: 500
- [ ] Select frequency: Monthly
- [ ] Check acknowledgement
- [ ] Submit
- [ ] Success toast: "Recurring investment set up"
- [ ] Redirects to dashboard

---

## 5. Investor Dashboard Tests

### Dashboard Access
- [ ] Login as investor@sri.com
- [ ] Navigate to /investor/dashboard
- [ ] Page loads successfully

### Stats Cards
- [ ] "Total Invested" card displays $0 (or total)
- [ ] "Active Investments" card shows count
- [ ] "Recurring Plans" card shows count

### Tabs
- [ ] "Investments" tab active by default
- [ ] "Recurring" tab switches content
- [ ] "Reference Prices" tab switches content

### Investment History
- [ ] If investments exist, they appear as cards
- [ ] Each card shows:
  - Investment ID
  - Date and type
  - Amount
  - Status badge
- [ ] If empty, shows "No investments yet" with CTA

### Recurring Investments
- [ ] Switch to "Recurring" tab
- [ ] Recurring investments listed
- [ ] Each shows:
  - Frequency
  - Next run date
  - Amount
  - Status
  - Pause/Resume button
- [ ] Click Pause/Resume - status updates

### Reference Prices
- [ ] Switch to "Reference Prices" tab
- [ ] Price update events listed
- [ ] Each shows:
  - Date
  - Old price → New price
  - Reason

---

## 6. Governance Page Tests

### Governance Access
- [ ] Navigate to /governance (or click in navbar)
- [ ] Page loads successfully

### Charter Sections
- [ ] Investor Protection Charter visible
  - [ ] 5 numbered points
  - [ ] Shield icon
- [ ] Founder Responsibility Charter visible
  - [ ] 5 numbered points
  - [ ] Users icon
- [ ] Sri Internal Standards visible
  - [ ] 4 standards listed
- [ ] Governance Alert card (yellow warning)
  - [ ] Important notice visible

---

## 7. Business Dashboard Tests

### Dashboard Access
- [ ] Login as founder@sri.com
- [ ] Navigate to /business/dashboard
- [ ] Page loads successfully

### Stats Cards
- [ ] "Capital Raised" shows total
- [ ] "Active Investors" shows count
- [ ] "Active Theses" shows count

### Quick Actions
- [ ] "Create Investment Thesis" button
- [ ] "Create Liquidity Window" button
- [ ] "Update Reference Price" button
- [ ] "Create Company Profile" button (if added)
- [ ] All buttons navigate correctly

---

## 8. Company Creation Tests

### Create Company
- [ ] Login as founder@sri.com
- [ ] Navigate to /business/company/new
- [ ] Form displays with fields:
  - [ ] Company Name
  - [ ] Description (textarea)
  - [ ] Industry
  - [ ] Geography
  - [ ] Website (optional)
- [ ] Fill all required fields
- [ ] Click "Create Company"
- [ ] Success toast appears
- [ ] Redirects to business dashboard

---

## 9. Thesis Editor Tests

### Create New Thesis
- [ ] Login as founder@sri.com
- [ ] Navigate to /business/thesis/new
- [ ] Page loads with heading "Create Investment Thesis"

### Basic Information Section
- [ ] Company dropdown shows created companies
- [ ] Thesis Title field
- [ ] Industry field
- [ ] Geography field
- [ ] Stage dropdown (Pre-seed, Seed, Series A, B, C+)
- [ ] Status dropdown (Draft, Active, Closed)

### Thesis Content Section
- [ ] Overview textarea (brief overview)
- [ ] Full Thesis textarea (detailed content)
- [ ] Risks textarea (risk disclosures)

### SAFE Structure Section
- [ ] Default fields appear (valuation_cap, discount_rate, type)
- [ ] "Add Field" button adds new field
- [ ] Can remove fields with trash icon
- [ ] Key-value pairs editable

### Submit
- [ ] Fill all required fields
- [ ] Click "Create Thesis"
- [ ] Success toast appears
- [ ] Redirects to business dashboard

### Edit Existing Thesis
- [ ] Navigate to /business/thesis/:id/edit (use existing thesis ID)
- [ ] Form pre-filled with thesis data
- [ ] Can edit all fields
- [ ] Click "Update Thesis"
- [ ] Success toast appears

---

## 10. Liquidity Window Tests

### Create Liquidity Window
- [ ] Login as founder@sri.com
- [ ] Navigate to /business/liquidity-window/new
- [ ] Form displays with:
  - [ ] Thesis dropdown
  - [ ] Start Date (datetime picker)
  - [ ] End Date (datetime picker)
  - [ ] Governance confirmation checkbox
- [ ] Select thesis
- [ ] Set future start/end dates
- [ ] Check governance confirmation
- [ ] Click "Create Liquidity Window"
- [ ] Success toast appears
- [ ] Redirects to business dashboard

### Validation
- [ ] Try to submit without governance confirmation
- [ ] Error appears: "Must confirm governance"

---

## 11. Reference Price Update Tests

### Submit Price Update
- [ ] Login as founder@sri.com
- [ ] Navigate to /business/reference-price/new
- [ ] Form displays with:
  - [ ] Thesis dropdown
  - [ ] Previous Reference Price (optional)
  - [ ] New Reference Price (required)
  - [ ] Reason textarea (required)
- [ ] Select thesis
- [ ] Enter old price: 100
- [ ] Enter new price: 150
- [ ] Enter reason: "Completed Series A funding of $5M"
- [ ] Click "Submit Price Update"
- [ ] Success toast appears
- [ ] Redirects to business dashboard

### Investor Notification
- [ ] Login as investor who invested in thesis
- [ ] Check notifications (if implemented)
- [ ] Reference price update should appear

---

## 12. Bank Account Tests

### Add Bank Account
- [ ] Login as any user
- [ ] Navigate to /settings/bank-accounts
- [ ] Page displays "Settlement rails only" message
- [ ] Click "Add Bank" button
- [ ] Form appears with fields:
  - [ ] Country
  - [ ] Bank Name
  - [ ] Account Holder Name
  - [ ] Account Number
  - [ ] Routing Code/SWIFT
- [ ] Fill all fields
- [ ] Click "Add Bank Account"
- [ ] Success toast appears
- [ ] Account appears in list with "pending" status

### Bank Account List
- [ ] Added account visible
- [ ] Shows bank name, holder, country
- [ ] Last 4 digits of account number
- [ ] Status badge (pending/verified/failed)
- [ ] No balance shown (not a wallet!)

---

## 13. API Tests

### Test with cURL

#### Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"investor@sri.com","password":"password123"}'
```
- [ ] Returns access_token
- [ ] Returns user object

#### Get Theses (Public)
```bash
curl http://localhost:8001/api/theses
```
- [ ] Returns array of 3 theses
- [ ] Each has all required fields

#### Get Dashboard (Authenticated)
```bash
TOKEN="<your-token>"
curl http://localhost:8001/api/dashboard/investor \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns stats object
- [ ] Shows total_invested, active_investments, recurring_count

#### Create Investment (Authenticated)
```bash
TOKEN="<your-token>"
curl -X POST http://localhost:8001/api/investments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "thesis_id":"thesis-1",
    "amount":1000,
    "investment_type":"one_time",
    "acknowledged_risks":true
  }'
```
- [ ] Returns investment object
- [ ] Status code 200

### API Documentation
- [ ] Navigate to http://localhost:8001/docs
- [ ] Swagger UI loads
- [ ] All endpoints listed
- [ ] Can test endpoints directly

---

## 14. Database Tests

### Access MongoDB
```bash
docker-compose exec mongodb mongosh sri_database
```

#### Check Collections
- [ ] `show collections` displays:
  - users
  - companies
  - theses
  - investments
  - recurring_investments
  - reference_prices
  - liquidity_windows
  - bank_accounts
  - discussions
  - governance_alerts

#### Query Data
- [ ] `db.users.countDocuments()` returns 3
- [ ] `db.theses.countDocuments()` returns 3
- [ ] `db.users.findOne({email:"investor@sri.com"})` returns user

---

## 15. Design & UX Tests

### Design Guidelines Compliance
- [ ] Deep purple primary color (#5B21B6)
- [ ] Cool gray backgrounds (#F9FAFB)
- [ ] Fraunces serif font for headings
- [ ] Outfit sans-serif for body text
- [ ] Rounded corners (rounded-2xl)
- [ ] Soft shadows on cards
- [ ] Whitespace-heavy layout

### NO Trading Patterns (Critical)
- [ ] No live price tickers
- [ ] No candlestick charts
- [ ] No "Buy/Sell" buttons (only "Invest")
- [ ] No wallet balance displays
- [ ] No "Add Funds" buttons
- [ ] No urgency timers
- [ ] No gamification elements

### Bank Account UI
- [ ] Clearly states "Settlement rails only"
- [ ] No balance shown
- [ ] No transfer buttons
- [ ] Text-only forms
- [ ] Warning message visible

---

## 16. Performance Tests

### Page Load Times
- [ ] Landing page loads < 2s
- [ ] Explore page loads < 2s
- [ ] Dashboard loads < 2s
- [ ] No console errors in browser

### API Response Times
- [ ] GET /api/theses < 500ms
- [ ] POST /api/auth/login < 500ms
- [ ] GET /api/dashboard/investor < 500ms

---

## 17. Error Handling Tests

### Invalid Login
- [ ] Enter wrong password
- [ ] Error toast appears: "Invalid credentials"
- [ ] Form doesn't clear

### Missing Required Fields
- [ ] Try to create thesis without title
- [ ] Form validation prevents submission
- [ ] Required fields highlighted

### Network Errors
- [ ] Stop backend: `docker-compose stop backend`
- [ ] Try to login
- [ ] Error toast appears
- [ ] Start backend: `docker-compose start backend`

---

## 18. Notifications Tests (Backend)

### Check Email Logs
```bash
docker-compose logs backend | grep EMAIL
```
- [ ] Investment confirmation logged
- [ ] Recurring investment logged
- [ ] Price update logged

### Notification API
```bash
TOKEN="<your-token>"
curl http://localhost:8001/api/notifications/my \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns notifications array
- [ ] Each has type, title, message, created_at

---

## 19. Analytics Tests

### Investor Timeline
```bash
TOKEN="<your-token>"
curl http://localhost:8001/api/analytics/investor/timeline \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns array of monthly data
- [ ] Each has month and amount

### Business Timeline
```bash
TOKEN="<your-token>"
curl http://localhost:8001/api/analytics/business/timeline \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Returns capital raised by month
- [ ] Ready for chart visualization

---

## 20. Docker Tests

### Container Status
```bash
docker-compose ps
```
- [ ] 3 services running (mongodb, backend, frontend)
- [ ] All show "Up" status

### Logs
```bash
docker-compose logs backend | tail -20
```
- [ ] No errors
- [ ] "Application startup complete" visible

### Restart
```bash
docker-compose restart backend
```
- [ ] Backend restarts successfully
- [ ] API still accessible

### Clean Restart
```bash
docker-compose down -v
docker-compose up -d
docker-compose exec backend python seed.py
```
- [ ] All services start fresh
- [ ] Database reseeded
- [ ] Application works

---

## Final Checklist

- [ ] All 20 test sections completed
- [ ] No critical bugs found
- [ ] Design matches requirements (calm, governance-first)
- [ ] All roles work (investor, business, both)
- [ ] Docker setup works smoothly
- [ ] Documentation is clear

---

## Test Results Template

```
Test Date: _______________
Tester Name: _______________

Passed: ___ / 20 sections
Failed: ___ / 20 sections

Issues Found:
1. 
2. 
3. 

Notes:


```

---

**If all tests pass, your Sri platform is ready!**

For any issues, check:
1. Docker logs: `docker-compose logs -f`
2. Browser console for frontend errors
3. SETUP.md troubleshooting section

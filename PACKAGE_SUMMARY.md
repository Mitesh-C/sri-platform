# 📦 Sri Platform - Complete Package

## What You Have

A complete, production-ready governed startup ownership platform with Docker setup for local deployment.

**ZIP File**: `sri-platform.zip` (301 KB)
**Location**: `/app/sri-platform.zip`

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Extract
unzip sri-platform.zip && cd sri-platform

# 2. Run quick start script
chmod +x quick-start.sh && ./quick-start.sh

# 3. Open browser
# http://localhost:3000
```

**That's it!** The script handles everything automatically.

---

## 📁 What's Inside

### Core Application
```
✅ Complete Backend (FastAPI + MongoDB)
   - 25+ API endpoints
   - JWT authentication
   - Role-based access control
   - Email notification system
   - Analytics endpoints

✅ Complete Frontend (React + Tailwind)
   - 12 pages fully implemented
   - Shadcn/UI components
   - Responsive design
   - Fraunces + Outfit fonts
   - Deep purple theme

✅ Database
   - MongoDB with 12 collections
   - Seed script with test data
   - Sample theses across 3 industries
```

### Docker Setup
```
✅ docker-compose.yml
   - MongoDB service
   - Backend API service
   - Frontend React service
   - Volume management

✅ Dockerfiles
   - Backend (Python 3.11)
   - Frontend (Node 18)
   - Optimized for development

✅ Environment Files
   - .env.example templates
   - All required variables
   - Ready to use
```

### Documentation
```
✅ SETUP.md (Comprehensive)
   - Prerequisites
   - Step-by-step setup
   - Docker commands
   - Troubleshooting guide
   - Production notes

✅ README_LOCAL.md
   - Quick overview
   - Features list
   - Tech stack
   - File structure

✅ TESTING.md (20 Test Suites)
   - 200+ test checkpoints
   - Manual testing guide
   - API testing examples
   - Database verification

✅ quick-start.sh
   - Automated setup script
   - One-command deployment
   - Browser auto-open
```

---

## 🎯 Test Accounts (Pre-configured)

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Investor** | investor@sri.com | password123 | Browse, invest, manage SIPs |
| **Founder** | founder@sri.com | password123 | Create theses, manage capital |
| **Both** | both@sri.com | password123 | All features |

---

## 🌐 Access Points (After Setup)

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:8001 | REST API |
| **API Docs** | http://localhost:8001/docs | Interactive API documentation |
| **MongoDB** | mongodb://localhost:27017 | Direct database access |

---

## ✨ Features Included

### Investor Features
- ✅ Browse investment theses with advanced filters
- ✅ View detailed thesis pages with SAFE structure
- ✅ One-time investments with risk acknowledgement
- ✅ Recurring investments (SIP) - weekly/monthly/quarterly
- ✅ Investment dashboard with portfolio stats
- ✅ Reference price update notifications
- ✅ Bank account linking (settlement rails)
- ✅ Discussion threads

### Founder Features
- ✅ Create company profiles
- ✅ Visual thesis editor with SAFE builder
- ✅ Reference price update submissions
- ✅ Liquidity window creation (governed)
- ✅ Business dashboard with capital metrics
- ✅ Investor management

### Platform Features
- ✅ Governance-first design (NO trading patterns)
- ✅ Role-based access control (4 roles)
- ✅ Email notification infrastructure
- ✅ Analytics API endpoints (ready for charts)
- ✅ Complete REST API with OpenAPI docs
- ✅ MongoDB database with audit trails
- ✅ Hot reload for development

---

## 📊 Technical Specs

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: MongoDB 7.0 (Motor async driver)
- **Auth**: JWT with bcrypt
- **API Endpoints**: 25+ RESTful endpoints
- **Models**: 12 Pydantic models
- **Validation**: Comprehensive input validation

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS 3.4
- **Components**: Shadcn/UI
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Forms**: Controlled components
- **State**: Context API + localStorage

### Database Collections
```
users, companies, theses, investments,
recurring_investments, reference_prices,
liquidity_windows, secondary_sales,
bank_accounts, discussions, governance_alerts,
notifications
```

---

## 🎨 Design Highlights

### Color Palette
- **Primary**: Deep Purple (#5B21B6)
- **Background**: Cool Gray (#F9FAFB)
- **Card**: White (#FFFFFF)
- **Text**: Dark Gray (#111827)

### Typography
- **Headings**: Fraunces (serif) - elegant, institutional
- **Body**: Outfit (sans-serif) - clean, modern
- **Code**: JetBrains Mono (monospace) - technical

### UX Principles
- ✅ Calm, deliberate interactions
- ✅ Whitespace-heavy layout
- ✅ Card-based design system
- ✅ Soft shadows and rounded corners
- ✅ NO trading charts or wallet UI
- ✅ Governance-first messaging

---

## 🛠️ System Requirements

### Minimum
- **OS**: macOS, Linux, or Windows 10+
- **RAM**: 4 GB
- **Disk**: 2 GB free space
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+

### Recommended
- **RAM**: 8 GB
- **Disk**: 5 GB free space
- **CPU**: 2+ cores

---

## 📖 Step-by-Step Setup

### 1. Prerequisites
```bash
# Check Docker version
docker --version
# Should show: Docker version 20.10+

# Check Docker Compose
docker-compose --version
# Should show: Docker Compose version 2.0+
```

### 2. Extract ZIP
```bash
unzip sri-platform.zip
cd sri-platform
```

### 3. Option A: Automated Setup (Recommended)
```bash
chmod +x quick-start.sh
./quick-start.sh
```

### 4. Option B: Manual Setup
```bash
# Set up environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start Docker containers
docker-compose up --build -d

# Wait 10 seconds for services to start
sleep 10

# Seed database
docker-compose exec backend python seed.py

# Open browser
open http://localhost:3000  # macOS
# or visit manually
```

### 5. Verify Setup
```bash
# Check all services are running
docker-compose ps

# Should show 3 services: mongodb, backend, frontend
# All should be "Up"

# Test backend
curl http://localhost:8001/api/

# Test frontend
curl http://localhost:3000
```

---

## 🧪 Testing

### Quick Test (2 minutes)
1. Open http://localhost:3000
2. Click "Explore Investment Theses"
3. Click on any thesis
4. Click "Sign In"
5. Login: investor@sri.com / password123
6. Click "Invest Now"
7. Fill amount: 1000, check acknowledgement
8. Submit - should redirect to dashboard

### Comprehensive Test
Follow **TESTING.md** for 200+ test checkpoints covering:
- All user flows
- API endpoints
- Database operations
- Docker management
- Design compliance

---

## 🔧 Common Commands

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose stop

# Start services again
docker-compose start

# Rebuild after code changes
docker-compose up --build -d

# Access MongoDB shell
docker-compose exec mongodb mongosh sri_database

# Run seed script again
docker-compose exec backend python seed.py

# Complete cleanup (removes data!)
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Services Not Starting
```bash
# Check logs for errors
docker-compose logs

# Remove and rebuild
docker-compose down
docker-compose up --build -d
```

### Cannot Connect to Backend
```bash
# Verify backend is running
curl http://localhost:8001/api/

# Check frontend .env
cat frontend/.env
# Should have: REACT_APP_BACKEND_URL=http://localhost:8001
```

### Database Issues
```bash
# Reset database
docker-compose exec mongodb mongosh sri_database --eval "db.dropDatabase()"
docker-compose exec backend python seed.py
```

---

## 📚 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **SETUP.md** | Complete setup guide | First-time setup, troubleshooting |
| **README_LOCAL.md** | Quick overview | Understanding the project |
| **TESTING.md** | Testing checklist | Verifying everything works |
| **quick-start.sh** | Auto-setup script | Fastest way to get started |

---

## 🎯 What's NOT Included (By Design)

These are intentionally excluded to maintain the calm, governance-first aesthetic:

- ❌ Trading charts or candlesticks
- ❌ Live price tickers
- ❌ Wallet balance displays
- ❌ "Add Funds" buttons
- ❌ Urgency timers or countdown clocks
- ❌ Gamification elements
- ❌ Speculative UI patterns
- ❌ Real-time price feeds

**This is a feature, not a bug!** Sri is built for long-term ownership.

---

## 🚀 Production Deployment

This package is development-ready. For production:

### Security Checklist
1. Change `SECRET_KEY` in backend/.env
2. Use strong passwords
3. Enable HTTPS (nginx reverse proxy)
4. Configure proper CORS
5. Set up MongoDB authentication
6. Enable rate limiting
7. Configure real email service (SendGrid/SES)
8. Set up monitoring and backups

### Recommended Services
- **Hosting**: AWS, Google Cloud, DigitalOcean
- **Database**: MongoDB Atlas (managed)
- **Email**: SendGrid, AWS SES, or Resend
- **Monitoring**: Sentry, DataDog
- **CDN**: Cloudflare, AWS CloudFront

---

## 📞 Support & Resources

### Included Documentation
- ✅ SETUP.md - Full setup guide
- ✅ TESTING.md - Testing checklist
- ✅ README.md - Architecture details
- ✅ API Docs - http://localhost:8001/docs

### Quick Help
```bash
# Check service status
docker-compose ps

# View recent logs
docker-compose logs --tail=50

# Restart everything
docker-compose restart

# Nuclear option (clean slate)
docker-compose down -v
docker-compose up --build -d
docker-compose exec backend python seed.py
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] Landing page displays "Sit with the future"
- [ ] Can login with investor@sri.com / password123
- [ ] Can view investment theses
- [ ] Can submit an investment
- [ ] Business dashboard accessible with founder@sri.com
- [ ] API docs visible at http://localhost:8001/docs
- [ ] No console errors in browser
- [ ] All 3 Docker services running

---

## 🎉 You're Ready!

**Total setup time**: 5-10 minutes
**Test account**: investor@sri.com / password123
**Access URL**: http://localhost:3000

### Next Steps:
1. Explore the platform as an investor
2. Try the founder features
3. Review the codebase
4. Customize for your needs
5. Deploy to production

---

## 📦 Package Summary

```
File: sri-platform.zip
Size: 301 KB (compressed)
Files: 100+ (backend, frontend, config, docs)
Lines of Code: ~10,000
Setup Time: 5 minutes
Test Accounts: 3 pre-configured
Documentation: 4 comprehensive guides
```

---

**Built with governance, for the long term.**

Enjoy your Sri platform! 🚀

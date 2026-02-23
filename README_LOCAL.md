# Sri by Mahakali Tribunal

## 🚀 Quick Start

See **SETUP.md** for complete local setup instructions.

```bash
# 1. Extract and enter directory
unzip sri-platform.zip
cd sri-platform

# 2. Set up environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Start with Docker
docker-compose up -d

# 4. Seed database
docker-compose exec backend python seed.py

# 5. Access application
open http://localhost:3000
```

## Test Accounts

- **Investor**: investor@sri.com / password123
- **Founder**: founder@sri.com / password123
- **Both**: both@sri.com / password123

## What's Included

✅ Complete full-stack application
✅ Docker setup for local development
✅ Seeded test data
✅ All 5 major features implemented
✅ Comprehensive documentation

## Features

### For Investors
- Browse investment theses with filtering
- One-time and recurring investments (SIP)
- Investment dashboard with portfolio stats
- Reference price update notifications
- Bank account linking for settlements

### For Founders/Businesses
- Create companies and investment theses
- Visual thesis editor with SAFE structure builder
- Reference price update submissions
- Liquidity window creation
- Business dashboard with capital metrics

### Platform Features
- Governance-first design (no trading/wallet patterns)
- Role-based access control
- Email notification system (ready for integration)
- Analytics endpoints for charts
- Complete REST API

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI, MongoDB, JWT Auth
- **Design**: Deep purple theme, Fraunces + Outfit fonts
- **Deployment**: Docker + Docker Compose

## Documentation

- **SETUP.md** - Complete local setup guide
- **README.md** - Architecture and features (this file)
- **API Docs** - http://localhost:8001/docs (when running)

## File Structure

```
sri-platform/
├── backend/               # FastAPI application
│   ├── server.py          # Main API with all routes
│   ├── models.py          # Pydantic models
│   ├── auth.py            # JWT authentication
│   ├── seed.py            # Database seeding
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/         # All application pages
│   │   ├── components/    # Reusable components
│   │   └── contexts/      # React contexts
│   └── package.json       # Node dependencies
│
├── docker-compose.yml     # Docker orchestration
├── Dockerfile.backend     # Backend container
├── Dockerfile.frontend    # Frontend container
└── SETUP.md               # Setup instructions
```

## Next Steps After Setup

1. Explore the landing page
2. Sign in with test accounts
3. Test investment flow (investor role)
4. Create thesis (founder role)
5. Check API documentation
6. Review code structure

## Need Help?

Check SETUP.md for:
- Troubleshooting common issues
- Database management
- Development workflow
- Production deployment notes

---

**Built with governance, for the long term.**
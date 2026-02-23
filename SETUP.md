# Sri by Mahakali Tribunal - Local Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

### Installing Docker

#### macOS
```bash
# Install Docker Desktop from:
https://www.docker.com/products/docker-desktop/
```

#### Ubuntu/Linux
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

#### Windows
```bash
# Install Docker Desktop from:
https://www.docker.com/products/docker-desktop/
```

---

## Quick Start (5 minutes)

### Step 1: Extract the ZIP file

```bash
unzip sri-platform.zip
cd sri-platform
```

### Step 2: Set up environment variables

```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 3: Build and start all services

```bash
# Build Docker images and start containers
docker-compose up --build -d

# This will start:
# - MongoDB on port 27017
# - Backend API on port 8001
# - Frontend on port 3000
```

### Step 4: Wait for services to be ready

```bash
# Check if all services are running
docker-compose ps

# Watch backend logs to see when it's ready
docker-compose logs -f backend

# When you see "Application startup complete", press Ctrl+C
```

### Step 5: Seed the database with test data

```bash
# Run the seed script
docker-compose exec backend python seed.py

# You should see:
# Created 3 users
# Created 3 companies
# Created 3 theses
# Created 2 governance alerts
```

### Step 6: Access the application

Open your browser and navigate to:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/
- **API Docs**: http://localhost:8001/docs

---

## Test Accounts

Use these accounts to test different user roles:

### Investor Account
- **Email**: investor@sri.com
- **Password**: password123
- **Features**: Browse theses, invest, manage recurring investments

### Founder Account
- **Email**: founder@sri.com
- **Password**: password123
- **Features**: Create companies, publish theses, manage capital

### Both Roles Account
- **Email**: both@sri.com
- **Password**: password123
- **Features**: All investor + founder capabilities

---

## Testing the Platform

### 1. Test Landing Page
```bash
# Open browser
http://localhost:3000

# You should see:
# - Hero: "Sit with the future."
# - Features section
# - No trading/wallet UI patterns
```

### 2. Test Authentication
```bash
# Navigate to Sign In
http://localhost:3000/auth

# Login with: investor@sri.com / password123
# Should redirect to Investor Dashboard
```

### 3. Test Investment Flow
```bash
# 1. Go to Explore
http://localhost:3000/explore

# 2. Click on any thesis card
# 3. Scroll down and click "Invest Now"
# 4. Fill amount: 1000
# 5. Check risk acknowledgement
# 6. Submit
# 7. Should see success toast and redirect to dashboard
```

### 4. Test Business Features (Login as founder@sri.com)
```bash
# Create Company
http://localhost:3000/business/company/new

# Create Thesis
http://localhost:3000/business/thesis/new

# Update Reference Price
http://localhost:3000/business/reference-price/new

# Create Liquidity Window
http://localhost:3000/business/liquidity-window/new
```

### 5. Test API Endpoints
```bash
# Test login API
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"investor@sri.com","password":"password123"}'

# Should return: {"access_token": "...", "token_type": "bearer", ...}

# Test get theses
curl http://localhost:8001/api/theses

# Should return array of 3 theses
```

---

## Managing the Application

### View Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend

# View MongoDB logs
docker-compose logs -f mongodb
```

### Stop Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop backend
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart backend only
docker-compose restart backend
```

### Stop and Remove Containers

```bash
# Stop and remove all containers (keeps data)
docker-compose down

# Stop and remove containers + volumes (deletes all data)
docker-compose down -v
```

### Rebuild After Code Changes

```bash
# Rebuild backend
docker-compose up --build -d backend

# Rebuild frontend
docker-compose up --build -d frontend

# Rebuild everything
docker-compose up --build -d
```

---

## Development Workflow

### Making Code Changes

**Backend Changes** (Hot reload enabled):
1. Edit files in `backend/` directory
2. Changes auto-reload (watch backend logs)
3. No rebuild needed

**Frontend Changes** (Hot reload enabled):
1. Edit files in `frontend/src/` directory
2. Browser auto-refreshes
3. No rebuild needed

**Environment Variable Changes**:
1. Edit `backend/.env` or `frontend/.env`
2. Restart the service:
   ```bash
   docker-compose restart backend
   docker-compose restart frontend
   ```

### Installing New Dependencies

**Backend (Python)**:
```bash
# Add package to requirements.txt
echo "package-name==1.0.0" >> backend/requirements.txt

# Rebuild backend
docker-compose up --build -d backend
```

**Frontend (Node)**:
```bash
# Add package to package.json or use yarn
docker-compose exec frontend yarn add package-name

# Restart frontend
docker-compose restart frontend
```

---

## Database Management

### Access MongoDB

```bash
# Connect to MongoDB shell
docker-compose exec mongodb mongosh sri_database

# List all collections
show collections

# Query users
db.users.find({}).pretty()

# Query theses
db.theses.find({}).pretty()

# Exit
exit
```

### Reset Database

```bash
# Clear all data and reseed
docker-compose exec mongodb mongosh sri_database --eval "db.dropDatabase()"
docker-compose exec backend python seed.py
```

### Backup Database

```bash
# Export data
docker-compose exec mongodb mongodump --db sri_database --out /tmp/backup

# Copy to host
docker cp sri-mongodb:/tmp/backup ./mongodb_backup
```

### Restore Database

```bash
# Copy backup to container
docker cp ./mongodb_backup sri-mongodb:/tmp/backup

# Restore
docker-compose exec mongodb mongorestore --db sri_database /tmp/backup/sri_database
```

---

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Services Not Starting

```bash
# Check service status
docker-compose ps

# View error logs
docker-compose logs backend
docker-compose logs frontend

# Remove and recreate
docker-compose down
docker-compose up --build -d
```

### Frontend Can't Connect to Backend

```bash
# Check backend is running
curl http://localhost:8001/api/

# Check frontend env
cat frontend/.env
# Should have: REACT_APP_BACKEND_URL=http://localhost:8001

# Restart frontend
docker-compose restart frontend
```

### Database Connection Error

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check backend env
cat backend/.env
# Should have: MONGO_URL=mongodb://mongodb:27017

# Restart backend
docker-compose restart backend
```

### Clear Everything and Start Fresh

```bash
# Nuclear option: remove everything
docker-compose down -v
docker system prune -a

# Start from scratch
docker-compose up --build -d
docker-compose exec backend python seed.py
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Browser (localhost:3000)            │
│  React Frontend + Tailwind + Shadcn/UI     │
└──────────────────┬──────────────────────────┘
                   │ HTTP REST API
                   │
┌──────────────────▼──────────────────────────┐
│       Backend API (localhost:8001)          │
│      FastAPI + Pydantic + JWT Auth          │
└──────────────────┬──────────────────────────┘
                   │ Motor (async driver)
                   │
┌──────────────────▼──────────────────────────┐
│      MongoDB (localhost:27017)              │
│    Document Database + Collections          │
└─────────────────────────────────────────────┘
```

---

## Production Deployment Notes

### Security Checklist

- [ ] Change `SECRET_KEY` in backend/.env
- [ ] Use strong passwords for test accounts
- [ ] Enable HTTPS (use nginx reverse proxy)
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB authentication
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure email service (SendGrid/SES)
- [ ] Set up backups for MongoDB
- [ ] Use environment-specific configs

### Environment Variables for Production

```bash
# Backend
MONGO_URL=mongodb://user:password@production-host:27017
SECRET_KEY=<generate-strong-key>
CORS_ORIGINS=https://yourdomain.com
EMAIL_ENABLED=true
EMAIL_FROM=noreply@yourdomain.com
SENDGRID_API_KEY=<your-key>  # If using SendGrid

# Frontend
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

---

## Additional Resources

- **API Documentation**: http://localhost:8001/docs (when running)
- **MongoDB Compass**: Connect to `mongodb://localhost:27017`
- **Postman Collection**: Use API docs to generate requests

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify all services running: `docker-compose ps`
3. Review this SETUP.md guide
4. Check README.md for architecture details

---

## Quick Command Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Rebuild
docker-compose up --build -d

# Seed database
docker-compose exec backend python seed.py

# Access MongoDB
docker-compose exec mongodb mongosh sri_database

# Clear everything
docker-compose down -v
```

---

**Congratulations! You now have Sri platform running locally.**

Navigate to http://localhost:3000 and start exploring!
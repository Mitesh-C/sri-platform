#!/bin/bash

# Sri Platform - Quick Start Script
# This script sets up and runs the Sri platform locally

set -e

echo "=========================================="
echo "  Sri by Mahakali Tribunal - Quick Start"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker is installed"
echo ""

# Set up environment files
echo "📝 Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

echo ""

# Build and start services
echo "🚀 Building and starting Docker containers..."
echo "   This may take 3-5 minutes on first run..."
echo ""
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if backend is up
echo "🔍 Checking backend service..."
for i in {1..30}; do
    if curl -s http://localhost:8001/api/ > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start. Check logs with: docker-compose logs backend"
        exit 1
    fi
    sleep 2
done

echo ""

# Seed database
echo "🌱 Seeding database with test data..."
docker-compose exec -T backend python seed.py

echo ""
echo "=========================================="
echo "  ✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🌐 Access the application:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8001/api/"
echo "   API Docs:  http://localhost:8001/docs"
echo ""
echo "👤 Test Accounts:"
echo "   Investor:  investor@sri.com / password123"
echo "   Founder:   founder@sri.com / password123"
echo "   Both:      both@sri.com / password123"
echo ""
echo "📚 Useful Commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop:          docker-compose stop"
echo "   Restart:       docker-compose restart"
echo "   Clean up:      docker-compose down -v"
echo ""
echo "📖 For detailed instructions, see SETUP.md"
echo ""
echo "Opening application in browser..."
sleep 2

# Try to open browser (works on most systems)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v start &> /dev/null; then
    start http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo "Happy testing! 🎉"

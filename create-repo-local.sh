#!/bin/bash

# Sri Platform Repository Creator
# Run this script on your local machine to create the complete repository

set -e

echo "=========================================="
echo "  Creating Sri Platform Repository"
echo "=========================================="
echo ""

# Create project directory
PROJECT_DIR="sri-platform"
if [ -d "$PROJECT_DIR" ]; then
    echo "⚠️  Directory $PROJECT_DIR already exists!"
    read -p "Do you want to remove it and start fresh? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
    else
        echo "Exiting..."
        exit 1
    fi
fi

mkdir "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "📁 Creating project structure..."

# Initialize git
git init
git branch -M main

# Create backend directory structure
mkdir -p backend

echo "✅ Creating backend files..."

# Backend .env.example
cat > backend/.env.example << 'EOF'
MONGO_URL=mongodb://mongodb:27017
DB_NAME=sri_database
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=your-secret-key-change-in-production
EMAIL_ENABLED=false
EMAIL_FROM=noreply@sri.com
EOF

# I'll provide the remaining files in the next message due to length
# This is just to show you the approach

echo ""
echo "⚠️  IMPORTANT: This script is too large to display in one message."
echo ""
echo "I'll provide you with a better solution..."
echo ""

EOF

chmod +x create-repo.sh

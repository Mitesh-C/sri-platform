#!/bin/bash

# Sri Platform - Local Setup & GitHub Push
# Run this on your LOCAL MACHINE (not in Emergent)

set -e

echo "=========================================="
echo "  Sri Platform - GitHub Setup"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

echo "Step 1: Creating repository structure locally..."

# Create project directory
mkdir -p sri-platform
cd sri-platform

# Initialize git
git init
git branch -M main

echo ""
echo "Step 2: Please create a GitHub repository:"
echo ""
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: sri-platform"
echo "  3. DO NOT initialize with README"
echo "  4. Click 'Create repository'"
echo ""
read -p "Press ENTER after you've created the GitHub repository..."

echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME

echo ""
echo "Step 3: Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/sri-platform.git"

echo ""
echo "=========================================="
echo "  Repository created locally!"
echo "=========================================="
echo ""
echo "Next step: I'll provide you with the files to add."
echo ""
echo "Your repository is at:"
echo "  Local: $(pwd)"
echo "  Remote: https://github.com/$GITHUB_USERNAME/sri-platform"
echo ""

# Now we need to get the files from Emergent
echo "To get the files, you have two options:"
echo ""
echo "Option A: Download from Emergent"
echo "  - Ask Emergent support to help you download:"
echo "    /app/sri-platform-repo.tar.gz"
echo "  - Extract it: tar -xzf sri-platform-repo.tar.gz"
echo "  - Copy all files to this directory"
echo ""
echo "Option B: I'll provide a download link"
echo "  - I can create a hosted version you can download"
echo ""
read -p "Which option do you prefer? (A/B): " OPTION

if [ "$OPTION" = "B" ] || [ "$OPTION" = "b" ]; then
    echo ""
    echo "Please ask me to create a hosted version of the files."
    echo "I'll provide a download link you can use."
fi

echo ""
echo "After you have the files:"
echo "  git add -A"
echo "  git commit -m 'Initial commit'"
echo "  git push -u origin main"

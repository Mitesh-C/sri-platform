#!/bin/bash

# This script uses GitHub CLI to create and push the repository
# Install GitHub CLI first: https://cli.github.com/

echo "Creating Sri Platform repository on GitHub..."

# Login to GitHub (if not already)
gh auth login

# Create repository
gh repo create sri-platform \
  --public \
  --description "Governed startup ownership and SAFE investment infrastructure platform" \
  --homepage "http://localhost:3000"

echo "Repository created!"
echo "Now we'll add the files..."

# Clone the empty repo
git clone https://github.com/$(gh api user -q .login)/sri-platform.git
cd sri-platform

# Now you need to add all the files here
# I'll provide the files in the next step

echo "Repository ready at: https://github.com/$(gh api user -q .login)/sri-platform"

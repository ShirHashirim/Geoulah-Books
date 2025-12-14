#!/bin/bash

# GitHub Deployment Script for Geoulah Books
# This script helps you deploy to GitHub Pages

echo "═══════════════════════════════════════"
echo "  Geoulah Books - GitHub Deployment"
echo "═══════════════════════════════════════"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
    echo "✓ Git initialized"
    echo ""
fi

# Ask for GitHub username if not set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "GitHub repository not configured."
    read -p "Enter your GitHub username: " github_username
    read -p "Enter repository name (default: geoulah-books): " repo_name
    repo_name=${repo_name:-geoulah-books}
    
    git_url="https://github.com/${github_username}/${repo_name}.git"
    git remote add origin "$git_url"
    echo "✓ Remote repository configured: $git_url"
    echo ""
fi

# Stage all changes
echo "Staging files..."
git add .

# Ask for commit message
echo ""
read -p "Enter commit message (default: Update site): " commit_msg
commit_msg=${commit_msg:-"Update site"}

# Commit
echo "Committing changes..."
git commit -m "$commit_msg"

# Push
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "═══════════════════════════════════════"
echo "✓ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/YOUR-USERNAME/YOUR-REPO"
echo "2. Click Settings > Pages"
echo "3. Under Source, select 'main' branch"
echo "4. Click Save"
echo ""
echo "Your site will be live at:"
echo "https://YOUR-USERNAME.github.io/YOUR-REPO/"
echo "═══════════════════════════════════════"

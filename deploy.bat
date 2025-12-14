@echo off
REM GitHub Deployment Script for Geoulah Books (Windows)

echo =======================================
echo   Geoulah Books - GitHub Deployment
echo =======================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
    git branch -M main
    echo [OK] Git initialized
    echo.
)

REM Check if remote is configured
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo GitHub repository not configured.
    set /p github_username="Enter your GitHub username: "
    set /p repo_name="Enter repository name (default: geoulah-books): "
    if "%repo_name%"=="" set repo_name=geoulah-books
    
    git remote add origin https://github.com/%github_username%/%repo_name%.git
    echo [OK] Remote repository configured
    echo.
)

REM Stage all changes
echo Staging files...
git add .

REM Ask for commit message
echo.
set /p commit_msg="Enter commit message (default: Update site): "
if "%commit_msg%"=="" set commit_msg=Update site

REM Commit
echo Committing changes...
git commit -m "%commit_msg%"

REM Push
echo Pushing to GitHub...
git push -u origin main

echo.
echo =======================================
echo [OK] Deployment complete!
echo.
echo Next steps:
echo 1. Go to https://github.com/YOUR-USERNAME/YOUR-REPO
echo 2. Click Settings ^> Pages
echo 3. Under Source, select 'main' branch
echo 4. Click Save
echo.
echo Your site will be live at:
echo https://YOUR-USERNAME.github.io/YOUR-REPO/
echo =======================================
pause

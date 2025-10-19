@echo off
echo ========================================
echo   Workie.lk Deployment Setup Script
echo ========================================
echo.

REM Check if .env files exist
if exist backend\.env (
    echo [OK] Backend .env file exists
) else (
    echo [!] Creating backend .env from template...
    copy backend\.env.example backend\.env
    echo [WARNING] Please update backend\.env with your actual values
)

echo.

if exist frontend\.env (
    echo [OK] Frontend .env file exists
) else (
    echo [!] Creating frontend .env from template...
    copy frontend\.env.example frontend\.env
    echo [WARNING] Please update frontend\.env with your actual values
)

echo.
echo ========================================
echo   Environment Files Setup Complete
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Edit backend\.env with your values:
echo    - MongoDB connection string
echo    - JWT secret
echo    - Cloudinary credentials
echo    - Email credentials
echo.
echo 2. Edit frontend\.env with your values:
echo    - Backend API URL (after Railway deployment)
echo.
echo 3. Follow DEPLOYMENT_GUIDE.md for complete deployment steps
echo.
echo ========================================
pause

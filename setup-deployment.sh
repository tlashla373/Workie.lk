#!/bin/bash

echo "========================================"
echo "  Workie.lk Deployment Setup Script"
echo "========================================"
echo ""

# Check if .env files exist
if [ -f backend/.env ]; then
    echo "[OK] Backend .env file exists"
else
    echo "[!] Creating backend .env from template..."
    cp backend/.env.example backend/.env
    echo "[WARNING] Please update backend/.env with your actual values"
fi

echo ""

if [ -f frontend/.env ]; then
    echo "[OK] Frontend .env file exists"
else
    echo "[!] Creating frontend .env from template..."
    cp frontend/.env.example frontend/.env
    echo "[WARNING] Please update frontend/.env with your actual values"
fi

echo ""
echo "========================================"
echo "  Environment Files Setup Complete"
echo "========================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Edit backend/.env with your values:"
echo "   - MongoDB connection string"
echo "   - JWT secret"
echo "   - Cloudinary credentials"
echo "   - Email credentials"
echo ""
echo "2. Edit frontend/.env with your values:"
echo "   - Backend API URL (after Railway deployment)"
echo ""
echo "3. Follow DEPLOYMENT_GUIDE.md for complete deployment steps"
echo ""
echo "========================================"

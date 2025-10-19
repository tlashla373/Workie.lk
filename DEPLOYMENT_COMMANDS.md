# 🛠️ Deployment Commands & Helpers

Quick reference for common deployment tasks.

## 🔐 Generate Secure JWT Secret

### Windows (CMD):
```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Windows (PowerShell):
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Linux/Mac:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📧 Gmail App Password Setup

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select app: **Mail**
5. Select device: **Other** (enter "Workie.lk Backend")
6. Click **Generate**
7. Copy the 16-character password (use this for `EMAIL_PASSWORD`)

## 🗄️ MongoDB Atlas Setup Commands

### Connection String Format:
```
mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/<database_name>?retryWrites=true&w=majority
```

### Example:
```
mongodb+srv://workieadmin:MySecurePass123@cluster0.abc123.mongodb.net/workie_production?retryWrites=true&w=majority
```

## 🧪 Testing Deployment

### Test Backend Health:
```bash
# Replace with your Railway URL
curl https://your-backend.up.railway.app/api/health
```

### Test Backend API Endpoint:
```bash
# Test user registration endpoint
curl -X POST https://your-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User"}'
```

### Test Frontend Build Locally:
```bash
cd frontend
npm run build
npm run preview
```

## 📦 Git Commands for Deployment

### Initial Push to GitHub:
```bash
# If not already initialized
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/yourusername/workie.lk.git
git push -u origin main
```

### Deploy Updates:
```bash
# After making changes
git add .
git commit -m "Your descriptive commit message"
git push origin main

# Railway and Vercel will auto-deploy
```

### Create Feature Branch:
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# After changes, push branch
git push origin feature/new-feature

# Vercel will create preview deployment for this branch
```

## 🔄 Railway CLI (Optional)

### Install Railway CLI:
```bash
npm i -g @railway/cli
```

### Login:
```bash
railway login
```

### Link to Project:
```bash
railway link
```

### View Logs:
```bash
railway logs
```

### Run Commands in Railway Environment:
```bash
railway run npm start
```

## ⚡ Vercel CLI (Optional)

### Install Vercel CLI:
```bash
npm i -g vercel
```

### Login:
```bash
vercel login
```

### Deploy from Terminal:
```bash
cd frontend
vercel
```

### Deploy to Production:
```bash
vercel --prod
```

### View Logs:
```bash
vercel logs
```

## 🐛 Debugging Commands

### Check Node Version:
```bash
node --version
```

### Check NPM Version:
```bash
npm --version
```

### Clear NPM Cache:
```bash
npm cache clean --force
```

### Reinstall Dependencies:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Check for Security Vulnerabilities:
```bash
npm audit
npm audit fix
```

## 📊 Monitor Deployment

### Railway:
```bash
# View deployment status
railway status

# View environment variables
railway variables

# Open dashboard
railway open
```

### Vercel:
```bash
# List deployments
vercel ls

# View deployment info
vercel inspect [deployment-url]

# Open dashboard
vercel dashboard
```

## 🔧 Environment Variables Management

### Railway - Set Variable:
```bash
railway variables set KEY=value
```

### Railway - Unset Variable:
```bash
railway variables unset KEY
```

### Vercel - Set Variable:
```bash
vercel env add VITE_API_URL
# Then enter the value
```

### Vercel - List Variables:
```bash
vercel env ls
```

## 🚀 Quick Deployment Script

Create this file as `deploy.sh` (Linux/Mac) or `deploy.bat` (Windows):

### deploy.bat (Windows):
```batch
@echo off
echo Starting deployment process...

echo.
echo 1. Running tests...
cd backend
call npm test
if errorlevel 1 (
    echo Tests failed! Aborting deployment.
    exit /b 1
)

echo.
echo 2. Committing changes...
cd ..
git add .
git commit -m "Deploy: %date% %time%"

echo.
echo 3. Pushing to GitHub...
git push origin main

echo.
echo 4. Deployment initiated!
echo Check Railway and Vercel dashboards for progress.
echo.
echo Backend: https://railway.app/dashboard
echo Frontend: https://vercel.com/dashboard
pause
```

### deploy.sh (Linux/Mac):
```bash
#!/bin/bash

echo "Starting deployment process..."

echo ""
echo "1. Running tests..."
cd backend
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed! Aborting deployment."
    exit 1
fi

echo ""
echo "2. Committing changes..."
cd ..
git add .
git commit -m "Deploy: $(date)"

echo ""
echo "3. Pushing to GitHub..."
git push origin main

echo ""
echo "4. Deployment initiated!"
echo "Check Railway and Vercel dashboards for progress."
echo ""
echo "Backend: https://railway.app/dashboard"
echo "Frontend: https://vercel.com/dashboard"
```

Make executable (Linux/Mac):
```bash
chmod +x deploy.sh
```

## 📱 Cloudinary Setup

### Get Cloudinary Credentials:
1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### Cloudinary URLs Format:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
```

## 🔍 Useful Monitoring URLs

### Railway:
- Dashboard: https://railway.app/dashboard
- Project: https://railway.app/project/[project-id]
- Metrics: https://railway.app/project/[project-id]/metrics
- Logs: https://railway.app/project/[project-id]/deployments

### Vercel:
- Dashboard: https://vercel.com/dashboard
- Project: https://vercel.com/[username]/[project-name]
- Analytics: https://vercel.com/[username]/[project-name]/analytics
- Logs: https://vercel.com/[username]/[project-name]/logs

### MongoDB Atlas:
- Dashboard: https://cloud.mongodb.com
- Metrics: https://cloud.mongodb.com/v2/[project-id]#/metrics/replicaSet/[cluster-id]
- Logs: https://cloud.mongodb.com/v2/[project-id]#/logs

## 💡 Pro Tips

### 1. Use Environment-Specific Branches:
```bash
# Development
git checkout -b development
git push origin development

# Staging
git checkout -b staging
git push origin staging

# Production (main)
git checkout main
git push origin main
```

### 2. Rollback Deployment:
```bash
# Railway - use dashboard to revert to previous deployment
# Vercel - use dashboard to redeploy previous version
```

### 3. Database Backup (MongoDB Atlas):
- Set up automated backups in MongoDB Atlas
- Go to: Backup → Enable Cloud Backup
- Schedule: Daily backups recommended

### 4. Monitor Costs:
```bash
# Check Railway usage
railway usage

# Vercel usage visible in dashboard
```

### 5. Set Up Alerts:
- Railway: Configure alerts in project settings
- Vercel: Enable deployment notifications
- MongoDB: Set up performance alerts

---

## 🆘 Emergency Rollback

If something goes wrong:

### Option 1: Revert Git Commit
```bash
git revert HEAD
git push origin main
```

### Option 2: Railway Dashboard
1. Go to Deployments
2. Select previous working deployment
3. Click "Redeploy"

### Option 3: Vercel Dashboard
1. Go to Deployments
2. Find working deployment
3. Click "..." → "Promote to Production"

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

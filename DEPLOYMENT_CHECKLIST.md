# 🚀 Quick Start Deployment Checklist

Follow this checklist for quick deployment:

## ☑️ Before You Start

- [ ] Push your code to GitHub
- [ ] Sign up for Railway (https://railway.app)
- [ ] Sign up for Vercel (https://vercel.com)
- [ ] Set up MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- [ ] Get Cloudinary credentials (https://cloudinary.com)
- [ ] Get Gmail App Password for email service

## ☑️ Backend Deployment (Railway)

1. **Create Project**
   - [ ] Go to Railway → New Project → Deploy from GitHub
   - [ ] Select your repository
   - [ ] Set root directory to `backend`

2. **Set Environment Variables** (copy from `.env.example`)
   - [ ] `NODE_ENV=production`
   - [ ] `PORT=5000`
   - [ ] `MONGODB_URI=<your-mongodb-uri>`
   - [ ] `JWT_SECRET=<generate-random-32-char-string>`
   - [ ] `JWT_EXPIRE=7d`
   - [ ] `CLOUDINARY_CLOUD_NAME=<your-value>`
   - [ ] `CLOUDINARY_API_KEY=<your-value>`
   - [ ] `CLOUDINARY_API_SECRET=<your-value>`
   - [ ] `EMAIL_HOST=smtp.gmail.com`
   - [ ] `EMAIL_PORT=587`
   - [ ] `EMAIL_USER=<your-email>`
   - [ ] `EMAIL_PASSWORD=<app-password>`
   - [ ] `FRONTEND_URL=<will-add-after-vercel>`

3. **Deploy & Get URL**
   - [ ] Wait for deployment
   - [ ] Generate domain in Settings
   - [ ] Save URL: `https://__________.up.railway.app`

## ☑️ Frontend Deployment (Vercel)

1. **Create Project**
   - [ ] Go to Vercel → Add New Project
   - [ ] Select your repository
   - [ ] Set root directory to `frontend`
   - [ ] Framework: Vite (auto-detected)

2. **Set Environment Variables**
   - [ ] `VITE_API_URL=https://your-railway-url.up.railway.app/api`
   - [ ] `VITE_SOCKET_URL=https://your-railway-url.up.railway.app`

3. **Deploy & Get URL**
   - [ ] Click Deploy
   - [ ] Wait for build
   - [ ] Save URL: `https://__________.vercel.app`

## ☑️ Final Steps

- [ ] Update Railway's `FRONTEND_URL` with your Vercel URL
- [ ] Test login/signup on live site
- [ ] Test real-time features (Socket.IO)
- [ ] Test file uploads
- [ ] Test email functionality
- [ ] Check mobile responsiveness

## 🎉 Done!

Your app is live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

---

**Need detailed help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

**Useful Commands:**
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test Backend Health
curl https://your-backend.up.railway.app/api/health

# View Railway Logs
# Go to Railway Dashboard → Your Service → View Logs

# View Vercel Logs
# Go to Vercel Dashboard → Your Project → Deployments → Select Deployment
```

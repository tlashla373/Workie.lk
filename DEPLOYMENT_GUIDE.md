# 🚀 Deployment Guide: Railway + Vercel

This guide will walk you through deploying your Workie.lk application with:
- **Backend** on Railway (Node.js/Express API + Socket.IO)
- **Frontend** on Vercel (React/Vite)

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] Git installed and project pushed to GitHub
- [ ] Railway account (sign up at https://railway.app)
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] MongoDB Atlas account (or another MongoDB hosting service)
- [ ] Cloudinary account for image uploads
- [ ] Email service credentials (Gmail App Password recommended)

---

## 🗄️ STEP 1: Set Up MongoDB (if not already done)

### Option A: MongoDB Atlas (Recommended - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **"M0 Free"** tier
5. Select a cloud provider and region (choose closest to your users)
6. Click **"Create Cluster"**
7. Create a database user:
   - Click **"Database Access"** → **"Add New Database User"**
   - Choose **"Password"** authentication
   - Create username and strong password
   - Set privileges to **"Read and write to any database"**
8. Set up network access:
   - Click **"Network Access"** → **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ This is okay for development, but for production consider using Railway's static IPs
9. Get your connection string:
   - Click **"Database"** → **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/workie_db`

---

## 🚂 STEP 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to https://railway.app and sign in with GitHub
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your **Workie.lk** repository
5. Railway will detect your project structure

### 2.2 Configure Backend Service

1. Railway may detect multiple services - select the **backend** folder
2. If not detected automatically:
   - Click **"Settings"**
   - Set **Root Directory** to `backend`
   - Set **Start Command** to `npm start`

### 2.3 Set Environment Variables

1. In your Railway project, click on your backend service
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add each of these:

```plaintext
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=generate_a_random_secret_at_least_32_characters_long
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=https://your-app-name.vercel.app
```

**Important Notes:**
- Generate a strong JWT_SECRET: You can use this command in terminal:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- For EMAIL_PASSWORD, use Gmail App Password (not your regular Gmail password):
  - Go to Google Account → Security → 2-Step Verification → App passwords
  - Generate a new app password for "Mail"
- You'll update FRONTEND_URL after deploying to Vercel

### 2.4 Deploy Backend

1. Railway will automatically deploy after setting variables
2. Wait for deployment to complete (check the logs)
3. Once deployed, click **"Settings"** → **"Generate Domain"**
4. Railway will give you a URL like: `https://your-backend-name.up.railway.app`
5. **Save this URL** - you'll need it for frontend configuration

### 2.5 Test Backend

1. Open your Railway backend URL in browser: `https://your-backend-name.up.railway.app`
2. You should see a response from your API
3. Test health endpoint: `https://your-backend-name.up.railway.app/api/health`

---

## ⚡ STEP 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your **Workie.lk** repository
4. Vercel will detect the configuration

### 3.2 Configure Frontend Deployment

1. In the project configuration screen:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Set Environment Variables

1. Before deploying, expand **"Environment Variables"**
2. Add these variables:

```plaintext
VITE_API_URL=https://your-backend-name.up.railway.app/api
VITE_SOCKET_URL=https://your-backend-name.up.railway.app
```

Replace `your-backend-name.up.railway.app` with your actual Railway backend URL from Step 2.4

### 3.4 Deploy Frontend

1. Click **"Deploy"**
2. Wait for build and deployment to complete (2-5 minutes)
3. Once deployed, Vercel will give you a URL like: `https://your-app-name.vercel.app`
4. Click on the URL to see your live site!

---

## 🔄 STEP 4: Update Backend with Frontend URL

Now that you have your Vercel frontend URL, update the backend:

1. Go back to Railway dashboard
2. Click on your backend service
3. Go to **"Variables"** tab
4. Update the **FRONTEND_URL** variable with your Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
5. Railway will automatically redeploy with the new variable

---

## ✅ STEP 5: Verify Deployment

### Test Backend:
- [ ] Visit: `https://your-backend-name.up.railway.app/api/health`
- [ ] Should return a health check response

### Test Frontend:
- [ ] Visit: `https://your-app-name.vercel.app`
- [ ] Try logging in or signing up
- [ ] Check browser console for errors
- [ ] Test real-time features (notifications, socket connections)
- [ ] Try uploading an image
- [ ] Test job posting and applications

### Common Issues:

**CORS Errors:**
- Make sure FRONTEND_URL in Railway matches your Vercel URL exactly
- Check your backend server.js CORS configuration

**API Not Connecting:**
- Verify VITE_API_URL in Vercel includes `/api` at the end
- Check Railway logs for errors

**Socket.IO Not Working:**
- Verify VITE_SOCKET_URL does NOT include `/api`
- Check that Socket.IO is properly configured in backend

**Database Connection Issues:**
- Verify MongoDB connection string is correct
- Check that IP whitelist in MongoDB Atlas includes 0.0.0.0/0

---

## 🔧 STEP 6: Post-Deployment Configuration

### 6.1 Custom Domain (Optional)

**For Vercel (Frontend):**
1. Go to your Vercel project → **Settings** → **Domains**
2. Add your custom domain (e.g., `workie.lk`)
3. Follow DNS configuration instructions

**For Railway (Backend):**
1. Go to your Railway service → **Settings** → **Networking**
2. Add custom domain (e.g., `api.workie.lk`)
3. Update VITE_API_URL in Vercel after setting up

### 6.2 Environment-Specific Settings

Make sure these are set correctly:

**Railway (Backend):**
- `NODE_ENV=production`
- Rate limiting should be enabled
- Logging configured for production

**Vercel (Frontend):**
- Production build optimizations enabled (automatic)
- Source maps disabled in production (for security)

---

## 📊 Monitoring & Maintenance

### Railway Monitoring:
1. **Logs**: Click on your service → **Deployments** → Select deployment → **View Logs**
2. **Metrics**: Monitor CPU, Memory, Network usage
3. **Alerts**: Set up alerts for service downtime

### Vercel Monitoring:
1. **Analytics**: Enable Vercel Analytics for traffic insights
2. **Logs**: Click on deployment → **Functions** tab for serverless function logs
3. **Performance**: Check Core Web Vitals

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

### Enable Auto-Deploy:
1. **Railway**: Automatically deploys on push to main branch
2. **Vercel**: Automatically deploys on push to main branch
3. Preview deployments are created for pull requests

### To Deploy Updates:
1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Both services will automatically deploy the changes
4. Check deployment status in respective dashboards

---

## 💰 Pricing Information

### Railway:
- **Free Trial**: $5 credit/month
- **Pro Plan**: $20/month (includes $20 credit for usage)
- Pricing based on usage (CPU, Memory, Network)
- Estimate: $5-15/month for small to medium apps

### Vercel:
- **Hobby Plan**: FREE
  - 100GB bandwidth/month
  - Unlimited deployments
  - Perfect for personal projects
- **Pro Plan**: $20/month per member
  - More bandwidth and features

### MongoDB Atlas:
- **Free Tier (M0)**: FREE forever
  - 512MB storage
  - Shared RAM
  - Perfect for development and small apps

### Total Estimated Cost:
- **Development/Small Apps**: $5-10/month (Railway usage + MongoDB Free + Vercel Free)
- **Production/Medium Apps**: $20-40/month

---

## 🆘 Troubleshooting

### Backend Issues:

**Build Fails:**
```bash
# Check Railway logs for specific error
# Common fix: Ensure package.json has correct scripts
```

**Database Connection Fails:**
```bash
# Verify MONGODB_URI is correct
# Check MongoDB Atlas network access
# Ensure database user has correct permissions
```

**Environment Variables Not Working:**
```bash
# Make sure to restart/redeploy after adding variables
# Check for typos in variable names
```

### Frontend Issues:

**Build Fails on Vercel:**
```bash
# Check build logs for specific errors
# Ensure all dependencies are in package.json
# Verify Node version compatibility
```

**API Calls Failing:**
```bash
# Check VITE_API_URL is correct
# Verify CORS is configured in backend
# Check Railway backend is running
```

**Environment Variables Not Available:**
```bash
# Ensure variables start with VITE_
# Redeploy after adding variables
# Check they're set for Production environment
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed successfully on Railway
- [ ] Frontend deployed successfully on Vercel
- [ ] Environment variables set correctly on both platforms
- [ ] Database connected and working
- [ ] CORS configured properly
- [ ] Authentication working (login/signup)
- [ ] File uploads working (Cloudinary)
- [ ] Email service working (password reset, notifications)
- [ ] Socket.IO real-time features working
- [ ] Payment gateway tested (if applicable)
- [ ] Mobile responsive design verified
- [ ] SSL certificates active (https)
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place

---

## 🎉 Success!

Your Workie.lk application should now be live! 

- **Frontend**: https://your-app-name.vercel.app
- **Backend API**: https://your-backend-name.up.railway.app/api

Share your links and start using your deployed application!

---

## 📞 Need Help?

If you encounter any issues:
1. Check the specific service logs (Railway/Vercel)
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check browser console for frontend errors
5. Review MongoDB Atlas connection and permissions

Good luck! 🚀

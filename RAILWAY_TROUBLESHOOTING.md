# 🚂 Railway Deployment Troubleshooting Guide

## ❌ Error: "No start command was found"

This error occurs when Railway can't find your backend code. Here are multiple solutions:

---

## ✅ **Solution 1: Set Root Directory (EASIEST)**

### In Railway Dashboard:

1. Go to your Railway project
2. Click on your backend service
3. Click **Settings** tab
4. Scroll to **Source** section
5. Find **Root Directory** field
6. Enter: `backend`
7. Save and redeploy

**This is the RECOMMENDED solution!**

---

## ✅ **Solution 2: Use the railway.toml File**

I've created a `railway.toml` file in your project root. Make sure to:

1. **Commit this file to Git:**
   ```bash
   git add railway.toml
   git commit -m "Add Railway configuration"
   git push origin main
   ```

2. **Railway will automatically detect it** on the next deployment

---

## ✅ **Solution 3: Deploy Backend as Separate Repo**

If you want to keep frontend and backend separate:

### Option A: Create Separate Railway Service from Same Repo

1. In Railway, click **New**
2. Select **Empty Service**
3. Link your GitHub repo
4. Set **Root Directory** to `backend`
5. Set environment variables
6. Deploy

### Option B: Create Monorepo with Multiple Services

Railway supports monorepo! You can have both frontend and backend in the same repo:

1. Create two services in Railway
2. Service 1: Set root to `backend`
3. Service 2: Set root to `frontend` (if you want Railway to host frontend too)

---

## ✅ **Solution 4: Use Railway CLI**

### Install Railway CLI:
```bash
npm i -g @railway/cli
```

### Login:
```bash
railway login
```

### Deploy with Specific Path:
```bash
cd backend
railway up
```

---

## 📋 **Verification Checklist**

After applying any solution, verify:

- [ ] Railway detects `package.json` in backend folder
- [ ] Build logs show `npm install` running
- [ ] Build logs show "Found start script: node server.js"
- [ ] Service starts successfully
- [ ] Health check passes at `/api/health`

---

## 🔍 **Debug: Check Railway Logs**

1. Go to your Railway service
2. Click **Deployments** tab
3. Click on the latest deployment
4. Check **Build Logs** for errors
5. Check **Deploy Logs** for runtime errors

### Common Log Errors:

#### Error: "Cannot find module"
**Solution:** Make sure all dependencies are in `package.json`

#### Error: "Port already in use"
**Solution:** Railway automatically sets PORT. Make sure your code uses:
```javascript
const PORT = process.env.PORT || 5000;
```

#### Error: "ECONNREFUSED MongoDB"
**Solution:** Check `MONGODB_URI` environment variable is set

---

## 🔧 **Alternative: Create Dockerfile**

If all else fails, use Docker:

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

Create `backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
logs
*.log
```

Then in Railway:
1. Go to Settings
2. Under **Build**, select **Dockerfile**
3. Set Dockerfile path to `backend/Dockerfile`
4. Redeploy

---

## 🎯 **Recommended Deployment Steps (Start Fresh)**

If you want to start over:

### Step 1: Prepare Files

Make sure these files exist and are committed:

```
Workie.lk/
├── railway.toml              ← Created for you
├── backend/
│   ├── nixpacks.toml         ← Created for you
│   ├── railway.json          ← Created for you
│   ├── package.json          ← Already exists (verified)
│   ├── server.js             ← Already exists
│   └── .env.example          ← Created for you
```

### Step 2: Commit All Files

```bash
git add .
git commit -m "Add Railway configuration files"
git push origin main
```

### Step 3: Deploy to Railway

**Method A: Dashboard**
1. Go to Railway → New Project
2. Deploy from GitHub Repo
3. Select `Workie.lk` repository
4. Railway will detect the config
5. Add environment variables
6. Deploy

**Method B: CLI**
```bash
cd backend
railway login
railway init
railway up
```

### Step 4: Set Environment Variables

In Railway dashboard, add these variables:

```env
NODE_ENV=production
PORT=${{PORT}}
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

**Note:** `${{PORT}}` is a Railway variable that auto-assigns the port

### Step 5: Deploy and Test

1. Railway will automatically deploy
2. Check deployment logs
3. Once deployed, go to Settings → Generate Domain
4. Test: `https://your-app.up.railway.app/api/health`

---

## 🆘 **Still Not Working?**

### Option 1: Simplify Structure

Create a new Railway project and:
1. Select **Deploy from GitHub repo**
2. Choose your repository
3. **Important:** Manually set **Root Directory** to `backend`
4. Let Railway auto-detect everything else
5. Add environment variables
6. Deploy

### Option 2: Check Railway Status

Visit: https://status.railway.app
- Make sure Railway services are operational
- Check for any ongoing incidents

### Option 3: Railway Community

- Railway Discord: https://discord.gg/railway
- Railway Forum: https://help.railway.app

### Option 4: Alternative Deployment (If Urgent)

If Railway isn't working, you can quickly deploy to:

**Render.com:**
1. Similar to Railway
2. Free tier available
3. Better for beginners
4. https://render.com

**Heroku:**
1. Classic platform
2. Easy deployment
3. Requires credit card for free tier
4. https://heroku.com

---

## 📝 **What I've Created for You**

To fix the "No start command" error, I've created:

1. ✅ `railway.toml` - Root config file
2. ✅ `backend/nixpacks.toml` - Backend-specific config
3. ✅ `backend/railway.json` - Service config
4. ✅ `RAILWAY_SETUP.md` - Setup instructions
5. ✅ This troubleshooting guide

---

## 🎯 **Quick Fix Summary**

**The fastest solution:**

1. Commit the new config files:
   ```bash
   git add railway.toml backend/nixpacks.toml backend/railway.json
   git commit -m "Add Railway configuration"
   git push origin main
   ```

2. In Railway Dashboard:
   - Go to your service → Settings
   - Set **Root Directory** to `backend`
   - Redeploy

3. Done! ✅

---

## 📞 **Need More Help?**

The error you're seeing means Railway is looking in the wrong directory. The fix is simple:
- **Tell Railway to look in the `backend` folder**
- Use any of the solutions above

**Most reliable:** Use Railway Dashboard to set Root Directory to `backend`

Good luck! 🚀

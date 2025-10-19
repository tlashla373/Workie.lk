# 🚨 Railway Healthcheck Failed - Debugging Guide

## ✅ Good News
Your build succeeded! Railway found your code and built it successfully.

## ❌ The Problem
Your app is building but not starting correctly. The healthcheck at `/api/health` is returning "service unavailable".

---

## 🔍 Most Common Causes

### 1. **Missing Environment Variables** ⚠️ (MOST LIKELY)

Your app needs environment variables to start. Check if you've set these in Railway:

**Required Variables:**
```env
NODE_ENV=production
PORT=${{PORT}}
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

**Without these, your app will crash!**

#### How to Check:
1. Go to Railway Dashboard
2. Click on your service
3. Go to **Variables** tab
4. Make sure ALL required variables are set

#### How to Fix:
1. Click **New Variable**
2. Add each variable one by one
3. After adding all, Railway will automatically redeploy

---

### 2. **MongoDB Connection Failed**

If `MONGODB_URI` is wrong or MongoDB is unreachable, your app won't start.

#### Check:
- Is your MongoDB URI correct?
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database`
- Did you whitelist Railway's IP in MongoDB Atlas?

#### Fix MongoDB Atlas Whitelist:
1. Go to MongoDB Atlas
2. Click **Network Access**
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (0.0.0.0/0)
5. Save

---

### 3. **Port Configuration Issue**

Railway assigns a dynamic port via the `PORT` environment variable.

#### Check your server.js:
Your code should have:
```javascript
const PORT = process.env.PORT || 5000;
```

✅ Your code already has this! (I verified earlier)

---

### 4. **App Crashing on Startup**

The app might be crashing due to missing dependencies or runtime errors.

---

## 🔧 **STEP-BY-STEP FIX**

### Step 1: View Railway Logs

1. Go to Railway Dashboard
2. Click on your service
3. Click **Deployments** tab
4. Click on the failed deployment
5. Click **View Logs**
6. Look for error messages (especially near the end)

**Common errors you'll see:**
- `MongooseServerSelectionError` → MongoDB connection failed
- `JWT_SECRET is not defined` → Missing environment variable
- `Cannot find module` → Missing dependency

---

### Step 2: Set ALL Required Environment Variables

Go to Railway → Your Service → **Variables** tab

Add these variables:

```env
NODE_ENV=production
PORT=${{PORT}}
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.xxxxx.mongodb.net/workie_db?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_key_at_least_32_characters
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** 
- Replace ALL the `your_*` placeholders with actual values
- Use `${{PORT}}` exactly as shown (Railway variable)
- Don't use quotes around values

---

### Step 3: Generate JWT Secret (if you haven't)

Run this command locally to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `JWT_SECRET`

---

### Step 4: Redeploy

After setting all variables:
1. Railway will automatically redeploy
2. OR click **Deployments** → **Redeploy**
3. Watch the logs for errors

---

## 📊 **What the Logs Should Show (Success)**

When working correctly, you'll see:

```
Server running in production mode on port 5000
MongoDB connected successfully
MongoDB connection established
```

---

## 🐛 **Debugging by Log Errors**

### Error: "MongooseServerSelectionError"
**Cause:** Can't connect to MongoDB

**Fix:**
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Verify database user has correct permissions

### Error: "JWT_SECRET is not defined"
**Cause:** Missing JWT_SECRET environment variable

**Fix:**
1. Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Add it in Railway Variables as `JWT_SECRET`

### Error: "ECONNREFUSED"
**Cause:** Can't connect to external service

**Fix:**
1. Check all service credentials (MongoDB, Cloudinary, Email)
2. Verify firewall/network settings

### Error: "Cannot find module 'xyz'"
**Cause:** Missing dependency

**Fix:**
1. Check if module is in `backend/package.json` dependencies
2. If missing, add it locally and push to Git
3. Railway will rebuild

---

## 🎯 **Quick Checklist**

Before redeploying, verify:

- [ ] `MONGODB_URI` is set and correct
- [ ] `JWT_SECRET` is set (32+ characters)
- [ ] `PORT` is set to `${{PORT}}`
- [ ] `NODE_ENV` is set to `production`
- [ ] MongoDB Atlas allows 0.0.0.0/0 IP access
- [ ] All other required env vars are set
- [ ] Railway logs don't show errors

---

## 🔍 **Advanced Debugging**

### Check if App Starts Locally

Test your app works with production settings:

```bash
cd backend

# Set environment variables (Windows CMD)
set NODE_ENV=production
set PORT=5000
set MONGODB_URI=your_mongodb_uri
set JWT_SECRET=your_jwt_secret

# Start server
npm start
```

If it works locally, the issue is with Railway environment variables.

### Enable Verbose Logging

Temporarily add to Railway variables:
```env
DEBUG=*
```

This will show detailed logs. Remove after debugging.

---

## 🚀 **Most Likely Solution**

Based on the error, **you're probably missing environment variables**.

### Do this NOW:

1. **Check Railway Variables tab**
2. **Add these minimum required variables:**
   ```env
   NODE_ENV=production
   PORT=${{PORT}}
   MONGODB_URI=<your-actual-mongodb-uri>
   JWT_SECRET=<generate-with-command-above>
   ```
3. **Save and wait for automatic redeploy**
4. **Check deployment logs**

---

## 📞 **Still Not Working?**

### Share Your Railway Logs

1. Go to Railway → Deployments → View Logs
2. Copy the last 50-100 lines (especially any red error messages)
3. Share them with me
4. I'll tell you exactly what's wrong

### What I Need to See:

- Error messages (usually in red)
- Lines that say "Error:", "Failed:", "Cannot", etc.
- MongoDB connection messages
- Server startup messages

---

## ✅ **Success Indicators**

When fixed, you'll see:

1. ✅ Build completes (you already have this!)
2. ✅ Healthcheck passes
3. ✅ App shows as "Active" with green status
4. ✅ You can visit: `https://your-app.railway.app/api/health`
5. ✅ Health endpoint returns JSON response

---

## 💡 **Pro Tip**

Test your MongoDB connection first:

```javascript
// Create a test file: test-mongo.js
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });
```

Run: `node test-mongo.js`

If this fails locally, your MongoDB URI is wrong.

---

## 🎯 **Next Steps**

1. **Check Railway Variables tab** → Add missing variables
2. **Check Railway Logs** → Look for specific error
3. **Fix the error** → Usually missing env vars
4. **Redeploy** → Wait for healthcheck to pass
5. **Success!** 🎉

**The healthcheck failure means your app can't start. 99% of the time it's missing environment variables, especially `MONGODB_URI` and `JWT_SECRET`.**

Let me know what you see in the logs! 🔍

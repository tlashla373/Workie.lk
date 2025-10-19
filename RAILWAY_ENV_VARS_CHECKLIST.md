# ✅ Railway Environment Variables Checklist

## 🚨 CRITICAL: Your App Won't Start Without These

Copy this checklist and fill in each variable in Railway.

---

## 📋 Required Variables (Must Have)

### ✅ 1. NODE_ENV
```
Variable Name: NODE_ENV
Value: production
```
**Why:** Tells your app to run in production mode

---

### ✅ 2. PORT
```
Variable Name: PORT
Value: ${{PORT}}
```
**⚠️ IMPORTANT:** Use exactly `${{PORT}}` - this is a Railway variable
**Why:** Railway assigns a dynamic port

---

### ✅ 3. MONGODB_URI
```
Variable Name: MONGODB_URI
Value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/workie_db?retryWrites=true&w=majority
```

**How to get this:**
1. Go to MongoDB Atlas → Database
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<database>` with `workie_db` (or your database name)

**Example:**
```
mongodb+srv://workieadmin:MySecurePass123@cluster0.abc123.mongodb.net/workie_db?retryWrites=true&w=majority
```

**⚠️ Common Mistakes:**
- ❌ Forgetting to replace `<password>`
- ❌ Wrong password
- ❌ Missing database name
- ❌ Not whitelisting IP in MongoDB Atlas

**Test it first:** Run `node test-mongo-connection.js` locally

---

### ✅ 4. JWT_SECRET
```
Variable Name: JWT_SECRET
Value: <generate a random 32+ character string>
```

**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```
Use this as your JWT_SECRET

**Why:** Used to sign authentication tokens securely

---

### ✅ 5. JWT_EXPIRE
```
Variable Name: JWT_EXPIRE
Value: 7d
```
**Why:** Sets token expiration to 7 days

---

## 📷 Image Upload Variables (Required if using Cloudinary)

### ✅ 6. CLOUDINARY_CLOUD_NAME
```
Variable Name: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name
```

### ✅ 7. CLOUDINARY_API_KEY
```
Variable Name: CLOUDINARY_API_KEY
Value: 123456789012345
```

### ✅ 8. CLOUDINARY_API_SECRET
```
Variable Name: CLOUDINARY_API_SECRET
Value: your_api_secret_here
```

**How to get these:**
1. Go to https://cloudinary.com
2. Sign up or log in
3. Go to **Dashboard**
4. Copy:
   - Cloud name
   - API Key
   - API Secret

---

## 📧 Email Variables (Required for notifications)

### ✅ 9. EMAIL_HOST
```
Variable Name: EMAIL_HOST
Value: smtp.gmail.com
```

### ✅ 10. EMAIL_PORT
```
Variable Name: EMAIL_PORT
Value: 587
```

### ✅ 11. EMAIL_USER
```
Variable Name: EMAIL_USER
Value: your_email@gmail.com
```

### ✅ 12. EMAIL_PASSWORD
```
Variable Name: EMAIL_PASSWORD
Value: your_app_password_here
```

**⚠️ IMPORTANT:** Don't use your regular Gmail password!

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com/
2. Security → 2-Step Verification (enable if not already)
3. Scroll down → App passwords
4. Select app: **Mail**
5. Select device: **Other** (type "Workie Backend")
6. Click **Generate**
7. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
8. Use this as EMAIL_PASSWORD (remove spaces)

---

## 🌐 Frontend URL (Set after Vercel deployment)

### ✅ 13. FRONTEND_URL
```
Variable Name: FRONTEND_URL
Value: http://localhost:5173
```

**⚠️ Update this later** after you deploy to Vercel!

**After Vercel deployment, change to:**
```
https://your-app-name.vercel.app
```

**Why:** For CORS configuration

---

## 🔐 Google OAuth (Optional - if using Google login)

### 14. GOOGLE_CLIENT_ID (Optional)
```
Variable Name: GOOGLE_CLIENT_ID
Value: your_google_client_id
```

### 15. GOOGLE_CLIENT_SECRET (Optional)
```
Variable Name: GOOGLE_CLIENT_SECRET
Value: your_google_client_secret
```

---

## 📊 How to Add Variables in Railway

1. Go to Railway Dashboard
2. Click on your backend service
3. Click **Variables** tab
4. Click **New Variable**
5. Enter **Variable Name** and **Value**
6. Press Enter or click outside to save
7. Repeat for all variables
8. Railway will automatically redeploy after you add/change variables

---

## ✅ Verification Checklist

Before redeploying, verify you have:

- [ ] NODE_ENV = `production`
- [ ] PORT = `${{PORT}}` (exactly this)
- [ ] MONGODB_URI = Your actual MongoDB connection string
- [ ] JWT_SECRET = 32+ character random string
- [ ] JWT_EXPIRE = `7d`
- [ ] CLOUDINARY_CLOUD_NAME = Your Cloudinary cloud name
- [ ] CLOUDINARY_API_KEY = Your Cloudinary API key
- [ ] CLOUDINARY_API_SECRET = Your Cloudinary API secret
- [ ] EMAIL_HOST = `smtp.gmail.com`
- [ ] EMAIL_PORT = `587`
- [ ] EMAIL_USER = Your Gmail address
- [ ] EMAIL_PASSWORD = Your Gmail app password (16 chars)
- [ ] FRONTEND_URL = `http://localhost:5173` (update after Vercel)

---

## 🧪 Test Variables Locally First

Create `backend/.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workie_db
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

Test locally:
```bash
cd backend
npm start
```

If it works locally, use the SAME values in Railway!

---

## 🔍 Test MongoDB Connection

Run this before deploying:

```bash
cd backend
node test-mongo-connection.js
```

This will verify your MongoDB URI is correct!

---

## 🚀 After Adding All Variables

1. Railway will automatically redeploy
2. Check **Deployments** tab
3. Click on the new deployment
4. Watch the logs for:
   ```
   MongoDB connected successfully
   Server running in production mode on port XXXX
   ```
5. Healthcheck should pass!

---

## ❌ Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using regular Gmail password | Use App Password instead |
| Wrong MongoDB password | Copy from MongoDB Atlas |
| Missing `<password>` in URI | Replace with actual password |
| Wrong PORT value | Must be `${{PORT}}` exactly |
| JWT_SECRET too short | Must be 32+ characters |
| IP not whitelisted | Add 0.0.0.0/0 in MongoDB Atlas |

---

## 📞 Need Help?

If you're stuck:

1. Share which variables you've set
2. Share the Railway deployment logs (last 50 lines)
3. Share any error messages

I'll help you fix it! 🚀

---

## 🎯 Quick Copy-Paste Template

Here's a template you can fill in:

```
NODE_ENV=production
PORT=${{PORT}}
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]
JWT_SECRET=[GENERATE_WITH_NODE_COMMAND]
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=[FROM_CLOUDINARY_DASHBOARD]
CLOUDINARY_API_KEY=[FROM_CLOUDINARY_DASHBOARD]
CLOUDINARY_API_SECRET=[FROM_CLOUDINARY_DASHBOARD]
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[YOUR_GMAIL]
EMAIL_PASSWORD=[GMAIL_APP_PASSWORD]
FRONTEND_URL=http://localhost:5173
```

Replace everything in [BRACKETS] with actual values!

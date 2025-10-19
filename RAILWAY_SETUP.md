# Railway Deployment Instructions

## Important: Set Root Directory in Railway

When deploying to Railway, you MUST configure the root directory:

### Option 1: Via Railway Dashboard (Recommended)

1. Go to your Railway project
2. Click on your service
3. Go to **Settings** tab
4. Find **Root Directory** setting
5. Set it to: `backend`
6. Click **Save** or the changes apply automatically
7. Redeploy the service

### Option 2: Via Railway CLI

```bash
railway up --service backend
```

### Option 3: Create railway.toml in Project Root

Create a `railway.toml` file in the root of your project (not in backend folder):

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[environments]
[environments.production]
root = "backend"
```

## Verification

After setting the root directory, Railway should:
- ✅ Detect `backend/package.json`
- ✅ Run `npm install` in the backend folder
- ✅ Find the `start` script
- ✅ Successfully deploy

## If Still Having Issues

### Check package.json has start script:

Your `backend/package.json` should have:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### Alternative: Use Nixpacks Config

Create `nixpacks.toml` in the backend folder:

```toml
[phases.setup]
nixPkgs = ["nodejs_18"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = []

[start]
cmd = "node server.js"
```

## Environment Variables to Set

Make sure these are set in Railway:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_CLOUD_NAME=<your-value>
CLOUDINARY_API_KEY=<your-value>
CLOUDINARY_API_SECRET=<your-value>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
FRONTEND_URL=<your-vercel-url>
```

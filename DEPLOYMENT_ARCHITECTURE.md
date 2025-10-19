# 🎨 Deployment Architecture & Flow

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                    (Desktop/Mobile/Tablet)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
              ┌──────────────┴──────────────┐
              │                             │
              │  Load Balancer/CDN          │
              │                             │
              └──────────────┬──────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   VERCEL     │    │   VERCEL     │    │   VERCEL     │
│   Edge Node  │    │   Edge Node  │    │   Edge Node  │
│   (US East)  │    │   (EU West)  │    │   (Asia)     │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       └───────────────────┴────────────────────┘
                           │
                           │ Serve React SPA
                           │
                   ┌───────▼────────┐
                   │   React App    │
                   │   (Static)     │
                   │                │
                   │ • HTML         │
                   │ • CSS/Tailwind │
                   │ • JavaScript   │
                   │ • Assets       │
                   └───────┬────────┘
                           │
                           │ API Calls (HTTPS)
                           │ WebSocket (WSS)
                           │
                   ┌───────▼────────┐
                   │   RAILWAY      │
                   │                │
                   │ ┌────────────┐ │
                   │ │ Express.js │ │
                   │ │  Server    │ │
                   │ └─────┬──────┘ │
                   │       │        │
                   │ ┌─────▼──────┐ │
                   │ │ Socket.IO  │ │
                   │ │   Server   │ │
                   │ └────────────┘ │
                   └───────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │  Cloudinary  │  │    Gmail     │
│    Atlas     │  │              │  │   SMTP       │
│              │  │              │  │              │
│ • Users      │  │ • Images     │  │ • Emails     │
│ • Jobs       │  │ • Videos     │  │ • Notifs     │
│ • Apps       │  │ • Thumbnails │  │ • Alerts     │
│ • Profiles   │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🔄 Request Flow

### 1️⃣ User Visits Website

```
User Browser
    │
    │ 1. Navigate to workie.lk
    ▼
Vercel Edge Network
    │
    │ 2. Serve cached static files (HTML, CSS, JS)
    ▼
Browser loads React App
    │
    │ 3. React initializes
    │ 4. Routes load
    │ 5. Components render
    ▼
User sees homepage
```

### 2️⃣ User Makes API Request (e.g., Login)

```
React App
    │
    │ 1. User clicks "Login"
    │ 2. Form validation
    ▼
Axios HTTP Client
    │
    │ 3. POST request to VITE_API_URL
    │    URL: https://backend.railway.app/api/auth/login
    │    Headers: { Content-Type: application/json }
    │    Body: { email, password }
    ▼
Railway Backend
    │
    │ 4. CORS check (verify origin)
    │ 5. Rate limiting check
    │ 6. Body parsing
    ▼
Auth Route Handler
    │
    │ 7. Validate credentials
    │ 8. Query MongoDB
    ▼
MongoDB Atlas
    │
    │ 9. Find user by email
    │ 10. Compare password hash
    ▼
Auth Route Handler
    │
    │ 11. Generate JWT token
    │ 12. Send response
    ▼
React App
    │
    │ 13. Store token
    │ 14. Update auth state
    │ 15. Redirect to dashboard
    ▼
User logged in!
```

### 3️⃣ File Upload Flow

```
React App
    │
    │ 1. User selects image
    │ 2. Preview shown
    ▼
Upload Button Clicked
    │
    │ 3. Create FormData
    │ 4. Append file
    ▼
Axios POST to /api/media/upload
    │
    │ 5. Multipart form data
    ▼
Railway Backend
    │
    │ 6. Multer middleware
    │ 7. Validate file type
    │ 8. Check file size
    ▼
Cloudinary Service
    │
    │ 9. Upload to Cloudinary
    │ 10. Get secure URL
    │ 11. Get optimized versions
    ▼
Railway Backend
    │
    │ 12. Save URL to MongoDB
    │ 13. Return URL to client
    ▼
React App
    │
    │ 14. Display uploaded image
    │ 15. Update profile
    ▼
Upload complete!
```

### 4️⃣ Real-time Notification Flow

```
Event Occurs (e.g., new job application)
    │
    ▼
Railway Backend
    │
    │ 1. Application created in DB
    │ 2. Trigger notification service
    ▼
Notification Service
    │
    │ 3. Create notification in DB
    │ 4. Check if user is online
    ▼
Socket.IO Service
    │
    │ 5. Find user's socket connection
    │ 6. Emit event: "notification"
    │ 7. Send notification data
    ▼
React App (Socket listener)
    │
    │ 8. Receive notification event
    │ 9. Update notification state
    │ 10. Show toast notification
    │ 11. Play sound (optional)
    │ 12. Update notification badge
    ▼
User sees notification in real-time!
    │
    │ Simultaneously...
    ▼
Email Service
    │
    │ 13. Format email template
    │ 14. Send via Gmail SMTP
    ▼
User receives email notification
```

---

## 🚀 Deployment Flow

### Step 1: Push to GitHub

```
Local Development
    │
    │ 1. Make code changes
    │ 2. Test locally
    ▼
Git Commit
    │
    │ 3. git add .
    │ 4. git commit -m "message"
    ▼
Git Push
    │
    │ 5. git push origin main
    ▼
GitHub Repository
```

### Step 2: Automatic Deployment

```
GitHub Repository
    │
    ├──────────────────┬──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
Railway Webhook    Vercel Webhook     Other Services
    │                  │
    │ Detected push    │ Detected push
    ▼                  ▼
Railway Build      Vercel Build
    │                  │
    │ 1. Clone repo    │ 1. Clone repo
    │ 2. npm install   │ 2. npm install
    │ 3. npm start     │ 3. npm run build
    │                  │ 4. Optimize assets
    ▼                  ▼
Railway Deploy     Vercel Deploy
    │                  │
    │ 4. Start server  │ 5. Deploy to CDN
    │ 5. Health check  │ 6. Invalidate cache
    ▼                  ▼
✅ Backend Live    ✅ Frontend Live
```

---

## 🔐 Security Layers

```
┌────────────────────────────────────────┐
│         User Request                   │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  1. HTTPS/TLS Encryption               │
│     ✓ Secure connection                │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  2. CORS Policy                        │
│     ✓ Check origin                     │
│     ✓ Verify credentials               │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  3. Rate Limiting                      │
│     ✓ Max 100 requests/15 min          │
│     ✓ IP-based throttling              │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  4. Helmet Security Headers            │
│     ✓ XSS protection                   │
│     ✓ Content security policy          │
│     ✓ Frame options                    │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  5. Authentication                     │
│     ✓ JWT token validation             │
│     ✓ Token expiry check               │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  6. Authorization                      │
│     ✓ Role-based access control        │
│     ✓ Resource ownership check         │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  7. Input Validation                   │
│     ✓ Sanitize inputs                  │
│     ✓ Validate data types              │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  8. Database Query                     │
│     ✓ Parameterized queries            │
│     ✓ NoSQL injection prevention       │
└───────────────┬────────────────────────┘
                │
                ▼
        Process Request
```

---

## 📊 Data Flow Examples

### Example 1: Job Posting

```
Employer
    │
    │ 1. Fill job form
    ▼
POST /api/jobs
    │
    │ 2. Auth middleware (verify employer)
    │ 3. Validation middleware
    ▼
Job Controller
    │
    │ 4. Create job document
    ▼
MongoDB
    │
    │ 5. Save job
    │ 6. Return job ID
    ▼
Notification Service
    │
    │ 7. Find matching workers
    │ 8. Create notifications
    ▼
Socket.IO + Email
    │
    │ 9. Real-time push
    │ 10. Send emails
    ▼
Workers notified!
```

### Example 2: Job Application

```
Worker
    │
    │ 1. Click "Apply"
    ▼
POST /api/applications
    │
    │ 2. Auth middleware
    │ 3. Check eligibility
    ▼
Application Controller
    │
    │ 4. Create application
    │ 5. Update job stats
    ▼
MongoDB
    │
    │ 6. Save application
    │ 7. Update counters
    ▼
Notification Service
    │
    │ 8. Notify employer
    ▼
Socket.IO + Email
    │
    │ 9. Push notification
    │ 10. Send email
    ▼
Employer notified!
```

---

## 🌐 Global Distribution

```
        VERCEL EDGE NETWORK
        
┌─────────────────────────────────┐
│         United States           │
│                                 │
│  ┌────┐  ┌────┐  ┌────┐        │
│  │ CA │  │ VA │  │ TX │        │
│  └────┘  └────┘  └────┘        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│            Europe               │
│                                 │
│  ┌────┐  ┌────┐  ┌────┐        │
│  │ UK │  │ DE │  │ FR │        │
│  └────┘  └────┘  └────┘        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│         Asia Pacific            │
│                                 │
│  ┌────┐  ┌────┐  ┌────┐        │
│  │ SG │  │ JP │  │ IN │  ← YOU │
│  └────┘  └────┘  └────┘        │
└─────────────────────────────────┘

All edge nodes cache and serve your
React app for lightning-fast loading!
```

---

## 💾 Database Schema Flow

```
Users Collection
    │
    ├──→ Profiles Collection (references userId)
    │
    ├──→ Jobs Collection (references userId as employer)
    │       │
    │       └──→ Applications Collection (references jobId, userId)
    │               │
    │               └──→ Notifications Collection
    │
    ├──→ Posts Collection (references userId)
    │
    ├──→ Reviews Collection (references userId as reviewer/reviewee)
    │
    └──→ Connections Collection (references userIds)
```

---

## 🔄 CI/CD Pipeline

```
Developer
    │
    │ 1. Code changes
    ▼
Local Testing
    │
    │ 2. npm run dev
    │ 3. Test features
    ▼
Git Commit & Push
    │
    │ 4. git push
    ▼
GitHub Actions (Optional)
    │
    │ 5. Run tests
    │ 6. Linting
    │ 7. Build check
    ▼
Deployment Trigger
    │
    ├─────────────┬─────────────┐
    │             │             │
    ▼             ▼             ▼
Railway       Vercel      GitHub
    │             │
    │ Build       │ Build
    ▼             ▼
Deploy        Deploy
    │             │
    │ Test        │ Test
    ▼             ▼
✅ Live       ✅ Live
    │             │
    └──────┬──────┘
           │
           ▼
    Monitor & Alert
```

---

## 📈 Monitoring & Analytics

```
Application
    │
    ├──→ Railway Metrics
    │      │
    │      ├─ CPU Usage
    │      ├─ Memory Usage
    │      ├─ Request Count
    │      ├─ Response Time
    │      └─ Error Rate
    │
    ├──→ Vercel Analytics
    │      │
    │      ├─ Page Views
    │      ├─ Core Web Vitals
    │      ├─ Geographic Data
    │      └─ Device Types
    │
    ├──→ MongoDB Metrics
    │      │
    │      ├─ Connections
    │      ├─ Query Performance
    │      ├─ Storage Usage
    │      └─ Index Efficiency
    │
    └──→ Cloudinary Stats
           │
           ├─ Bandwidth Usage
           ├─ Transformations
           ├─ Storage
           └─ API Calls
```

---

**Need Help?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions!
